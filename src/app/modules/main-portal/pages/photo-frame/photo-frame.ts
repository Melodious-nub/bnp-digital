import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SeoService } from '../../../../core/services/seo.service';

interface Frame {
    id: number;
    name: string;
    url: string;
    type: 'profile' | 'post';
    isFeatured?: boolean;
}

@Component({
    selector: 'app-photo-frame',
    templateUrl: './photo-frame.html',
    styleUrl: './photo-frame.scss',
    standalone: false
})
export class PhotoFrameComponent implements OnInit {
    @ViewChild('editorCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    frames: Frame[] = [
        { id: 1, name: 'সারপ্রাইজ ফ্রেম ১', url: '/photoframe/bnp_profile_1.png', type: 'profile', isFeatured: true },
        { id: 2, name: 'সারপ্রাইজ ফ্রেম ২', url: '/photoframe/bnp_profile_2.png', type: 'profile' }
    ];

    selectedFrameIndex: number = 0;
    selectedFrame: Frame = this.frames[0];
    selectedType: 'profile' | 'post' = 'profile';

    userImageSrc: string | null = null;
    userImageEl: HTMLImageElement | null = null;

    scale: number = 100;
    rotation: number = 0;
    posX: number = 0;
    posY: number = 0;

    isDragging: boolean = false;
    lastMouseX: number = 0;
    lastMouseY: number = 0;

    constructor(
        public router: Router,
        private seoService: SeoService
    ) { }

    ngOnInit() {
        this.seoService.updatePageSeo(
            'Vote BNP | Photo Frame Editor',
            'আপনার ছবির সাথে ধানের শীষের ফ্রেম যুক্ত করুন এবং শেয়ার করুন। আগামীর বাংলাদেশ গড়তে আপনার সমর্থন জানান।',
            'https://vote-bnp.com/bnp_logo.jpg',
            'BNP Photo Frame, Vote BNP Frame, ধানের শীষ ফ্রেম, বাংলাদেশ জাতীয়তাবাদী দল'
        );
    }

    selectType(type: 'profile' | 'post') {
        if (type === 'post') return; // Not implemented yet
        this.selectedType = type;
    }

    selectFrame(frame: Frame) {
        this.selectedFrame = frame;
        this.selectedFrameIndex = this.frames.indexOf(frame);
    }

    nextFrame() {
        this.selectedFrameIndex = (this.selectedFrameIndex + 1) % this.frames.length;
        this.selectedFrame = this.frames[this.selectedFrameIndex];
    }

    prevFrame() {
        this.selectedFrameIndex = (this.selectedFrameIndex - 1 + this.frames.length) % this.frames.length;
        this.selectedFrame = this.frames[this.selectedFrameIndex];
    }

    triggerFileInput(input: HTMLInputElement) {
        input.click();
    }

    onFileSelected(event: any) {
        let file: File | null = null;
        if (event.target.files && event.target.files.length > 0) {
            file = event.target.files[0];
        } else if (event.dataTransfer && event.dataTransfer.files.length > 0) {
            file = event.dataTransfer.files[0];
        }

        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.userImageSrc = e.target.result;
                const img = new Image();
                img.src = this.userImageSrc as string;
                img.onload = () => {
                    this.userImageEl = img;
                    this.resetControls();

                    // Initial scale to fit the container
                    const container = document.querySelector('.canvas-wrapper');
                    if (container) {
                        const rect = container.getBoundingClientRect();
                        const scaleW = rect.width / img.width;
                        const scaleH = rect.height / img.height;
                        this.scale = Math.max(scaleW, scaleH) * 100;
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.onFileSelected(event);
    }

    resetControls() {
        this.scale = 100;
        this.rotation = 0;
        this.posX = 0;
        this.posY = 0;
    }

    get transformStyle() {
        return `translate(${this.posX}px, ${this.posY}px) rotate(${this.rotation}deg) scale(${this.scale / 100})`;
    }

    onMouseDown(event: MouseEvent | TouchEvent) {
        if (!this.userImageSrc) return;
        this.isDragging = true;
        const pos = this.getEventPos(event);
        this.lastMouseX = pos.x;
        this.lastMouseY = pos.y;
    }

    onMouseMove(event: MouseEvent | TouchEvent) {
        if (!this.isDragging) return;
        const pos = this.getEventPos(event);
        const dx = pos.x - this.lastMouseX;
        const dy = pos.y - this.lastMouseY;

        this.posX += dx;
        this.posY += dy;

        this.lastMouseX = pos.x;
        this.lastMouseY = pos.y;
    }

    onMouseUp() {
        this.isDragging = false;
    }

    private getEventPos(event: MouseEvent | TouchEvent) {
        if (event instanceof MouseEvent) {
            return { x: event.clientX, y: event.clientY };
        } else {
            return { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }
    }

    rotate(deg: number) {
        this.rotation = (this.rotation + deg);
    }

    async download() {
        if (!this.userImageEl || !this.selectedFrame) return;

        const canvas = this.canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const CANVAS_SIZE = 1080;
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        const container = document.querySelector('.canvas-wrapper');
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const ratio = CANVAS_SIZE / rect.width;

        ctx.save();
        ctx.translate(CANVAS_SIZE / 2 + (this.posX * ratio), CANVAS_SIZE / 2 + (this.posY * ratio));
        ctx.rotate((this.rotation * Math.PI) / 180);

        const drawWidth = this.userImageEl.width * (this.scale / 100) * ratio;
        const drawHeight = this.userImageEl.height * (this.scale / 100) * ratio;

        ctx.drawImage(
            this.userImageEl,
            -drawWidth / 2,
            -drawHeight / 2,
            drawWidth,
            drawHeight
        );
        ctx.restore();

        const frameImg = new Image();
        frameImg.src = this.selectedFrame.url;
        await new Promise(resolve => frameImg.onload = resolve);
        ctx.drawImage(frameImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

        const link = document.createElement('a');
        link.download = `bnp_frame_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    }

    reset() {
        this.resetControls();
    }
}
