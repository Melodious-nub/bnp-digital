import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
    selector: 'app-reform-plan',
    templateUrl: './reform-plan.html',
    styleUrl: './reform-plan.scss',
    standalone: false
})
export class ReformPlanComponent implements OnInit {
    constructor(public router: Router, private seoService: SeoService) { }

    ngOnInit() {
        this.seoService.updateTitle('রাষ্ট্র কাঠামো মেরামতের ৩১ দফা | BNP Reform Plan');
        window.scrollTo(0, 0);
    }
}
