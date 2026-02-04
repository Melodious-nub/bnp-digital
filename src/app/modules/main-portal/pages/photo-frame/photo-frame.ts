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
        { id: 1, name: 'ধানের শীষ - ১', url: '/photoframe/bnp-profile-dhaner-shish-1080_1080.png', type: 'profile', isFeatured: true },
        { id: 2, name: 'সবাই মিলে - ১', url: '/photoframe/bnp-profile-sobar-age-1080_1080.png', type: 'profile' },
        { id: 3, name: 'টেক ব্যাক - ১', url: '/photoframe/bnp-profile-TK-1080_1080.png', type: 'profile' },
        { id: 4, name: 'ধানের শীষ পোস্ট', url: '/photoframe/bnp-profile-dhaner-shish-1580_1875.png', type: 'post', isFeatured: true },
        { id: 5, name: 'সবাই মিলে পোস্ট', url: '/photoframe/bnp-profile-sobar-age-1580_1875.png', type: 'post' },
        { id: 6, name: 'টেক ব্যাক পোস্ট', url: '/photoframe/bnp-profile-TK-1580_1875.png', type: 'post' }
    ];

    get filteredFrames() {
        return this.frames.filter(f => f.type === this.selectedType);
    }

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
        this.selectedType = type;
        const framesOfType = this.filteredFrames;
        if (framesOfType.length > 0) {
            this.selectFrame(framesOfType[0]);
        }
    }

    selectFrame(frame: Frame) {
        this.selectedFrame = frame;
        const framesOfType = this.filteredFrames;
        this.selectedFrameIndex = framesOfType.indexOf(frame);
    }

    nextFrame() {
        const framesOfType = this.filteredFrames;
        this.selectedFrameIndex = (this.selectedFrameIndex + 1) % framesOfType.length;
        this.selectedFrame = framesOfType[this.selectedFrameIndex];
    }

    prevFrame() {
        const framesOfType = this.filteredFrames;
        this.selectedFrameIndex = (this.selectedFrameIndex - 1 + framesOfType.length) % framesOfType.length;
        this.selectedFrame = framesOfType[this.selectedFrameIndex];
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

        // Set dimensions based on type
        const CANVAS_WIDTH = this.selectedType === 'profile' ? 1080 : 1580;
        const CANVAS_HEIGHT = this.selectedType === 'profile' ? 1080 : 1875;

        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const container = document.querySelector('.canvas-wrapper');
        if (!container) return;
        const rect = container.getBoundingClientRect();

        // Use the width ratio for uniform scaling
        const ratio = CANVAS_WIDTH / rect.width;

        ctx.save();
        // Translate to the center of the canvas relative to the container's center
        // For non-square aspect ratios, we need to be careful with positioning
        ctx.translate(CANVAS_WIDTH / 2 + (this.posX * ratio), CANVAS_HEIGHT / 2 + (this.posY * ratio));
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
        ctx.drawImage(frameImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const link = document.createElement('a');
        link.download = `bnp_frame_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    }

    async copyLink() {
        const url = 'https://vote-bnp.com/frame-editor';
        try {
            await navigator.clipboard.writeText(url);
            import('sweetalert2').then(Swal => {
                Swal.default.fire({
                    title: 'লিংক কপি হয়েছে!',
                    text: 'আপনি এখন এটি শেয়ার করতে পারেন।',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    confirmButtonColor: '#006a4e'
                });
            });
        } catch (err) {
            // console.error('Failed to copy: ', err);
        }
    }

    async shareLink() {
        const url = 'https://vote-bnp.com/frame-editor';
        const text = 'আপনার ছবির সাথে ধানের শীষের ফ্রেম যুক্ত করুন এবং আগামীর বাংলাদেশ গড়তে আপনার সমর্থন জানান।';

        const encodedUrl = encodeURIComponent(url);
        const encodedText = encodeURIComponent(text);

        import('sweetalert2').then(Swal => {
            Swal.default.fire({
                title: '<div class="pt-4"><span class="text-2xl font-black text-gray-900 tracking-tight">শেয়ার করুন</span></div>',
                html: `
                    <div class="flex flex-col gap-3.5 p-1 mt-4">
                        <p class="text-gray-400 text-[13px] font-bold mb-5 tracking-wide uppercase">প্লাটফর্ম নির্বাচন করুন</p>
                        
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" 
                           class="flex items-center gap-5 p-5 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1877F2]/30 transition-all no-underline group active:scale-[0.98]">
                           <div class="w-12 h-12 bg-[#1877F2] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#1877F2]/20 group-hover:scale-110 transition-transform">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                           </div>
                           <div class="flex flex-col items-start gap-0.5">
                               <span class="text-gray-900 font-black text-lg">Facebook</span>
                               <span class="text-gray-500 text-xs font-bold">নিউজ ফিড বা মেসেজ</span>
                           </div>
                           <div class="ml-auto w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#1877F2]/10 group-hover:text-[#1877F2] transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                           </div>
                        </a>
                        
                        <a href="https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}" target="_blank"
                           class="flex items-center gap-5 p-5 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#25D366]/30 transition-all no-underline group active:scale-[0.98]">
                           <div class="w-12 h-12 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#25D366]/20 group-hover:scale-110 transition-transform">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.305-4.321 9.623-9.625 9.623q-.14 0-.279-.004zM12 0C5.373 0 0 5.373 0 12c0 2.123.55 4.12 1.511 5.86L0 24l6.327-1.662C7.99 23.36 9.917 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                           </div>
                           <div class="flex flex-col items-start gap-0.5">
                               <span class="text-gray-900 font-black text-lg">WhatsApp</span>
                               <span class="text-gray-500 text-xs font-bold">বন্ধুদের মেসেজ করুন</span>
                           </div>
                           <div class="ml-auto w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#25D366]/10 group-hover:text-[#25D366] transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                           </div>
                        </a>

                        <a href="https://t.me/share/url?url=${encodedUrl}&text=${encodedText}" target="_blank"
                           class="flex items-center gap-5 p-5 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#0088CC]/30 transition-all no-underline group active:scale-[0.98]">
                           <div class="w-12 h-12 bg-[#0088CC] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#0088CC]/20 group-hover:scale-110 transition-transform">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.33 7.843l-1.493 7.02c-.114.502-.41.627-.827.393l-2.274-1.675-1.097 1.056c-.12.12-.222.222-.455.222l.162-2.31 4.204-3.801c.183-.162-.04-.253-.284-.092l-5.197 3.273-2.24-.7c-.487-.152-.497-.487.102-.72l8.75-3.372c.405-.152.76.09.61.94z"/></svg>
                           </div>
                           <div class="flex flex-col items-start gap-0.5">
                               <span class="text-gray-900 font-black text-lg">Telegram</span>
                               <span class="text-gray-500 text-xs font-bold">টেলিগ্রাম গ্রুপে শেয়ার</span>
                           </div>
                           <div class="ml-auto w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#0088CC]/10 group-hover:text-[#0088CC] transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                           </div>
                        </a>
                    </div>
                `,
                showConfirmButton: false,
                showCloseButton: true,
                padding: '1.5rem',
                width: '450px',
                customClass: {
                    popup: 'rounded-[2rem] border-none shadow-2xl',
                    title: 'pt-0'
                }
            });
        });
    }

    reset() {
        this.resetControls();
    }
}
