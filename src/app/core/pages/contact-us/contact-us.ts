import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../services/api';
import { LoadingService } from '../../services/loading.service';
import { SeoService } from '../../services/seo.service';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.html',
    styleUrl: './contact-us.scss',
    standalone: false
})
export class ContactUsComponent {
    mapUrl: SafeResourceUrl;
    contactForm: FormGroup;
    captchaQuestion: string = '';
    private captchaResult: number = 0;

    constructor(
        public router: Router,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        private api: Api,
        private loaderService: LoadingService,
        private seoService: SeoService
    ) {
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.614476822143!2d90.41512!3d23.796739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c700631e8301%3A0x70cbbb2dad808989!2z4Kas4Ka_4KaP4Kao4Kaq4Ka_4oCZ4KawIOCmleCnh-CmqOCnjeCmpuCnjeCmsOCngOCmr-CmrCDgpqjgpr_gprDgp43gpqzgpr7gpprgpqgg4Kaq4Kaw4Ka_4Kaa4Ka-4Kay4Kao4Ka-IOCmleCmvuCmsOCnjeCmr-CmvuCmsuCmr-CmvA!5e0!3m2!1sen!2sbd!4v1768579845354!5m2!1sen!2sbd');

        this.seoService.updatePageSeo(
            'Vote BNP - Contact Us',
            'Contact Vote BNP campaign team. Address: গুলশান ২, ঢাকা। Phone: +৮৮০১৭১১-০৮৩৪৫৬. Official campaign portal for Bangladesh Nationalist Party (BNP).',
            'https://vote-bnp.com/bnp_logo.jpg',
            'Vote for bnp, Vote-bnp, Vote bnp, BNP, Contact Us, Address, গুলশান ২, ঢাকা',
            'https://vote-bnp.com/contact-us'
        );

        this.contactForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            subject: ['', Validators.required],
            message: ['', Validators.required],
            captcha: ['', Validators.required]
        });
        this.generateCaptcha();
    }

    generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        this.captchaResult = num1 + num2;
        this.captchaQuestion = `${this.api.toBengaliNumber(num1)} + ${this.api.toBengaliNumber(num2)} = ?`;
    }

    onSubmit() {
        if (this.contactForm.valid) {
            if (parseInt(this.contactForm.value.captcha) !== this.captchaResult) {
                Swal.fire({
                    title: 'ক্যাপচা ভুল হয়েছে!',
                    text: 'সঠিক উত্তরটি লিখুন।',
                    icon: 'warning',
                    confirmButtonText: 'ঠিক আছে',
                    confirmButtonColor: '#f42a41'
                });
                this.generateCaptcha();
                this.contactForm.patchValue({ captcha: '' });
                return;
            }

            this.loaderService.setLoading(true);

            const { captcha, ...submitData } = this.contactForm.value;
            const formData = {
                ...submitData,
                slugName: 'dhaka17'
            };

            this.api.submitContactForm(formData)
                .pipe(finalize(() => this.loaderService.setLoading(false)))
                .subscribe({
                    next: () => {
                        Swal.fire({
                            title: 'ধন্যবাদ!',
                            text: 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে।',
                            icon: 'success',
                            confirmButtonText: 'ঠিক আছে',
                            confirmButtonColor: '#1a5e4d'
                        });
                        this.contactForm.reset();
                        this.generateCaptcha();
                    },
                    error: (err: any) => {
                        Swal.fire({
                            title: 'দুঃখিত!',
                            text: 'বার্তাটি পাঠানো সম্ভব হয়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।',
                            icon: 'error',
                            confirmButtonText: 'ঠিক আছে',
                            confirmButtonColor: '#f42a41'
                        });
                        this.generateCaptcha();
                    }
                });
        } else {
            Swal.fire({
                title: 'ভুল হয়েছে',
                text: 'অনুগ্রহ করে সব ঘরগুলো সঠিক ভাবে পূরণ করুন।',
                icon: 'error',
                confirmButtonText: 'আবার চেষ্টা করুন',
                confirmButtonColor: '#f42a41'
            });
            Object.keys(this.contactForm.controls).forEach(key => {
                const control = this.contactForm.get(key);
                control?.markAsTouched();
            });
        }
    }
}
