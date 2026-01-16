import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.html',
    styleUrl: './contact-us.scss',
    standalone: false
})
export class ContactUsComponent {
    mapUrl: SafeResourceUrl;

    constructor(
        public router: Router,
        private sanitizer: DomSanitizer
    ) {
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.614476822143!2d90.41512!3d23.796739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c700631e8301%3A0x70cbbb2dad808989!2z4Kas4Ka_4KaP4Kao4Kaq4Ka_4oCZ4KawIOCmleCnh-CmqOCnjeCmpuCnjeCmsOCngOCmr-CmrCDgpqjgpr_gprDgp43gpqzgpr7gpprgpqgg4Kaq4Kaw4Ka_4Kaa4Ka-4Kay4Kao4Ka-IOCmleCmvuCmsOCnjeCmr-CmvuCmsuCmr-CmvA!5e0!3m2!1sen!2sbd!4v1768579845354!5m2!1sen!2sbd');
    }
}
