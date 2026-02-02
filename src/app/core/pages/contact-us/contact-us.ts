import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
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
    captchaSvg: SafeHtml = '';
    captchaToken: string = '';

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
            'Vote BNP | Contact Us',
            'Contact Vote BNP campaign team. Explore BNP candidates, manifesto and election updates. Vote BNP and take part in shaping Bangladesh’s future.',
            'https://vote-bnp.com/bnp_logo.jpg',
            'Vote for bnp, Vote-bnp, Vote bnp, BNP, Contact Us, Address, গুলশান ২, ঢাকা',
            'https://vote-bnp.com/contact-us'
        );

        this.contactForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            subject: ['', Validators.required],
            message: ['', Validators.required],
            captcha: ['', Validators.required],
            honeypot: ['']
        });
        this.fetchCaptcha();
    }

    fetchCaptcha() {
        this.api.getCaptcha().subscribe({
            next: (res) => {
                this.captchaSvg = this.sanitizer.bypassSecurityTrustHtml(res.data);
                this.captchaToken = res.token;
            },
            error: (err) => {
                console.error('Failed to fetch captcha', err);
            }
        });
    }

    onSubmit() {
        if (this.contactForm.valid) {
            this.loaderService.setLoading(true);

            const formData = {
                name: this.contactForm.value.name,
                email: this.contactForm.value.email,
                subject: this.contactForm.value.subject,
                message: this.contactForm.value.message,
                slugName: 'contact-page',
                captchaToken: this.captchaToken,
                captchaText: this.contactForm.value.captcha,
                honeypot: this.contactForm.value.honeypot
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
                        this.fetchCaptcha();
                    },
                    error: (err: any) => {
                        const errorMsg = err.error?.message || 'বার্তাটি পাঠানো সম্ভব হয়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।';
                        Swal.fire({
                            title: 'দুঃখিত!',
                            text: errorMsg,
                            icon: 'error',
                            confirmButtonText: 'ঠিক আছে',
                            confirmButtonColor: '#f42a41'
                        });
                        this.fetchCaptcha();
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
