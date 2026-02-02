import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { LoadingService } from '../../services/loading.service';
import { SeoService } from '../../services/seo.service';
import Swal from 'sweetalert2';
import { Subject, timer } from 'rxjs';
import { takeUntil, finalize, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DISTRICTS } from '../../data/mock-data';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-promise-wall',
    templateUrl: './promise-wall.html',
    styleUrl: './promise-wall.scss',
    standalone: false,
    encapsulation: ViewEncapsulation.None
})
export class PromiseWallComponent implements OnInit, OnDestroy {
    promiseForm: FormGroup;
    promises: any[] = [];
    totalPromises: number = 0;
    displayTotalPromises: number = 0;
    currentPage: number = 1;
    totalPages: number = 1;
    isLoadingPromises: boolean = false;
    isSubmitting: boolean = false;
    isDownloading: boolean = false;
    private counterInterval: any;

    // Modal & Form state
    showModal: boolean = false;
    showCertificateModal: boolean = false;
    isCustomPromise: boolean = false;
    selectedSampleIndex: number | null = null;

    // Submitted Data for Certificate
    submittedData: any = null;

    // District Autocomplete
    districts = DISTRICTS;
    filteredDistricts: any[] = [];
    districtSearch: string = '';
    showDistrictDropdown: boolean = false;

    private destroy$ = new Subject<void>();

    samplePromises = [
        { text: 'আমি দুর্নীতি থেকে দূরে থাকব এবং দুর্নীতির বিরুদ্ধে সোচ্চার থাকব', icon: '🚫' },
        { text: 'আমি জাতি-ধর্ম-বর্ণ নির্বিশেষে সকলের সাথে ঐক্যবদ্ধ থাকব', icon: '🤝' },
        { text: 'আমি ন্যায়বিচার প্রতিষ্ঠায় সর্বদা সচেষ্ট থাকব', icon: '⚖️' },
        { text: 'আমি পরিবেশ সংরক্ষণে সচেষ্ট থাকব এবং অন্যদেরও উদ্বুদ্ধ করব', icon: '🌱' },
        { text: 'আমি শিক্ষার আলো ছড়িয়ে দিতে সাহায্য করব', icon: '📚' }
    ];

    constructor(
        private fb: FormBuilder,
        private api: Api,
        private loader: LoadingService,
        private seo: SeoService,
        public router: Router
    ) {
        this.promiseForm = this.fb.group({
            name: [''],
            division: [''],
            promise_text: ['', [Validators.required, Validators.maxLength(500)]]
        });

        this.filteredDistricts = [];
    }

    ngOnInit(): void {
        this.seo.updatePageSeo(
            'অঙ্গীকারনামা | Vote BNP',
            'আমাদের দেশ, আমাদের অঙ্গীকার—পরিবর্তনের কারিগর হতে আপনার প্রতিশ্রুতি দিন।',
            'https://vote-bnp.com/assets/images/promise-banner.jpg',
            'অঙ্গীকারনামা, Promise Wall, BNP Promise, বাংলাদেশ জাতীয়তাবাদী দল',
            'https://vote-bnp.com/promise-wall'
        );

        this.loadPromises();
        this.startRealtimeUpdates();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadPromises(loadMore: boolean = false): void {
        if (this.isLoadingPromises) return;

        if (loadMore) {
            if (this.currentPage >= this.totalPages) return;
            this.currentPage++;
        } else {
            this.currentPage = 1;
            this.promises = [];
        }

        this.isLoadingPromises = true;
        this.api.getPromises(this.currentPage, 12)
            .pipe(finalize(() => this.isLoadingPromises = false))
            .subscribe({
                next: (res: any) => {
                    if (loadMore) {
                        this.promises = [...this.promises, ...res.data];
                    } else {
                        this.promises = res.data;
                    }
                    if (res.pagination.total > this.totalPromises) {
                        this.animateCount(this.totalPromises, res.pagination.total);
                    } else {
                        this.displayTotalPromises = res.pagination.total;
                    }
                    this.totalPromises = res.pagination.total;
                    this.totalPages = res.pagination.totalPages;
                },
                error: (err) => console.error('Error fetching promises', err)
            });
    }

    startRealtimeUpdates(): void {
        // Poll for count every 15 seconds to simulate realtime without killing shared hosting
        timer(0, 15000)
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.api.getPromiseCount())
            )
            .subscribe({
                next: (res) => {
                    if (res.total > this.totalPromises) {
                        this.animateCount(this.totalPromises, res.total);
                        this.totalPromises = res.total;
                        // If there are new promises and we are on page 1, refresh the list
                        if (this.currentPage === 1) {
                            this.loadPromises(false);
                        }
                    }
                },
                error: (err) => console.error('Error fetching promise count', err)
            });
    }

    selectSample(index: number): void {
        this.selectedSampleIndex = index;
        this.isCustomPromise = false;
        this.promiseForm.patchValue({ promise_text: this.samplePromises[index].text });
    }

    toggleCustomPromise(): void {
        this.isCustomPromise = true;
        this.selectedSampleIndex = null;
        this.promiseForm.patchValue({ promise_text: '' });
    }

    openModal(): void {
        this.showModal = true;
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    closeModal(): void {
        this.showModal = false;
        this.isCustomPromise = false;
        this.selectedSampleIndex = null;
        this.promiseForm.reset();
        this.districtSearch = '';
        document.body.style.overflow = 'auto'; // Restore scroll
    }

    closeCertificateModal(): void {
        this.showCertificateModal = false;
        document.body.style.overflow = 'auto';
    }

    filterDistricts(event: any): void {
        this.districtSearch = event.target.value;
        this.updateFilteredDistricts(this.districtSearch);
    }

    onDistrictFocus(): void {
        this.updateFilteredDistricts(this.districtSearch);
    }

    updateFilteredDistricts(val: string): void {
        const search = val.toLowerCase();
        if (search.length === 0) {
            this.filteredDistricts = this.districts.slice(0, 10); // Show top 10 initially
        } else {
            this.filteredDistricts = this.districts.filter(d =>
                d.bn_name.includes(search) || d.name.toLowerCase().includes(search)
            ).slice(0, 5);
        }
        this.showDistrictDropdown = true;
    }

    selectDistrict(district: any): void {
        this.promiseForm.patchValue({ division: district.bn_name });
        this.districtSearch = district.bn_name;
        this.showDistrictDropdown = false;
    }

    onSubmit(): void {
        if (this.promiseForm.invalid) {
            this.promiseForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;
        this.loader.setLoading(true);

        this.api.submitPromise(this.promiseForm.value)
            .pipe(finalize(() => {
                this.isSubmitting = false;
                this.loader.setLoading(false);
            }))
            .subscribe({
                next: (res: any) => {
                    this.submittedData = {
                        ...this.promiseForm.value,
                        promiseNo: res.promiseNo,
                        date: new Date()
                    };

                    this.closeModal();
                    this.loadPromises(false);

                    setTimeout(() => {
                        this.showCertificateModal = true;
                        document.body.style.overflow = 'hidden';
                    }, 500);
                },
                error: (err) => {
                    Swal.fire({
                        title: 'দুঃখিত!',
                        text: 'অঙ্গীকারটি জমা দেওয়া সম্ভব হয়নি। অনুগ্রহ করে পরে চেষ্টা করুন।',
                        icon: 'error',
                        confirmButtonText: 'ঠিক আছে',
                        confirmButtonColor: '#f42a41'
                    });
                }
            });
    }

    animateCount(startValue: number, endValue: number): void {
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        if (this.counterInterval) {
            cancelAnimationFrame(this.counterInterval);
        }

        const step = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            // Easing function for smoother animation (easeOutQuad)
            const easeProgress = progress * (2 - progress);

            this.displayTotalPromises = Math.floor(startValue + (endValue - startValue) * easeProgress);

            if (progress < 1) {
                this.counterInterval = requestAnimationFrame(step);
            } else {
                this.displayTotalPromises = endValue;
            }
        };

        this.counterInterval = requestAnimationFrame(step);
    }

    async downloadCertificate(): Promise<void> {
        const element = document.getElementById('certificate-card');
        if (!element || this.isDownloading) return;

        this.isDownloading = true;

        try {
            // Use a slight delay to ensure everything is rendered
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(element, {
                useCORS: true,
                scale: 2,
                backgroundColor: '#004d3d',
                logging: false,
                onclone: (clonedDoc) => {
                    // Ensure the card is visible in the clone
                    const card = clonedDoc.getElementById('certificate-card');
                    if (card) {
                        card.style.transform = 'none';
                        card.style.position = 'relative';
                    }
                }
            });

            const link = document.createElement('a');
            link.download = `bnp-ongikar-${this.submittedData?.promiseNo || 'card'}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        } catch (error) {
            console.error('Download error:', error);
            Swal.fire('Error', 'ডাউনলোড সম্পন্ন করা সম্ভব হয়নি। স্ক্রিনশট নিন।', 'error');
        } finally {
            this.isDownloading = false;
        }
    }

    getBengaliNumber(num: number): string {
        return this.api.toBengaliNumber(num);
    }
}
