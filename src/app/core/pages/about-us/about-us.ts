import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SeoService } from '../../../core/services/seo.service';

interface TeamMember {
    name: string;
    role: string;
    photoUrl: string;
    facebookLink: string;
    linkedinLink?: string;
}

interface TeamCategory {
    title: string;
    subtitle?: string;
    members: TeamMember[];
}

@Component({
    selector: 'app-about-us',
    templateUrl: './about-us.html',
    styleUrl: './about-us.scss',
    standalone: false
})
export class AboutUsComponent implements OnInit {

    teams: TeamCategory[] = [
        {
            title: 'ওয়েবসাইট টিম',
            members: [
                {
                    name: 'এস. এম. মাহমুদুল হায়দার (মীম)',
                    role: 'ওয়েবসাইট টিম',
                    photoUrl: '/teams/SM_Mahmudul_Hyder.png',
                    facebookLink: 'https://www.facebook.com/smmhyder/',
                    linkedinLink: 'https://www.linkedin.com/in/smmhyder/'
                },
                {
                    name: 'তানজিল চৌধুরী',
                    role: 'ওয়েবসাইট টিম',
                    photoUrl: '/teams/Chowdhury_Tanjil.png',
                    facebookLink: 'https://www.facebook.com/tjc1971',
                    linkedinLink: 'https://www.linkedin.com/in/tanjil1971'
                },
                {
                    name: 'সেলিম মাহমুদ',
                    role: 'ওয়েবসাইট টিম',
                    photoUrl: '/teams/Salim_Mahmud.png',
                    facebookLink: 'https://www.facebook.com/salim.mahmud.7758'
                },
                {
                    name: 'জুল আফরোজ',
                    role: 'ওয়েবসাইট টিম',
                    photoUrl: '/teams/Zul_Afros.png',
                    facebookLink: 'https://www.facebook.com/zul.afros'
                }
            ]
        },
        {
            title: 'উপদেষ্টা এবং পৃষ্ঠপোষক',
            members: [
                {
                    name: 'ব্যারিস্টার এম এ সালাম',
                    role: 'উপদেষ্টা এবং পৃষ্ঠপোষক',
                    photoUrl: '/teams/Barrister_MA_Salam.png',
                    facebookLink: 'https://www.facebook.com/barristermasalam'
                },
                {
                    name: 'ব্যারিস্টার শরীফ হায়দার (মৃদুল)',
                    role: 'উপদেষ্টা এবং পৃষ্ঠপোষক',
                    photoUrl: '/teams/SharifHyder.png',
                    facebookLink: 'https://www.facebook.com/smshyder'
                },
                {
                    name: 'শফিকুল ইসলাম রিবলু',
                    role: 'উপদেষ্টা এবং পৃষ্ঠপোষক',
                    photoUrl: '/teams/MdShafikul_Islam_Riblu.png',
                    facebookLink: 'https://www.facebook.com/mdshafikul.islam.73'
                }
            ]
        }
    ];

    constructor(
        public router: Router,
        private seoService: SeoService
    ) { }

    ngOnInit(): void {
        this.seoService.updatePageSeo(
            'Vote BNP - About Us',
            'Meet the team behind Vote BNP. Official campaign portal for Bangladesh Nationalist Party (BNP). গুলশান ২, ঢাকা। ফোন: +৮৮০১৭১১-০৮৩৪৫৬',
            'https://vote-bnp.com/bnp_logo.jpg',
            'Vote for bnp, Vote-bnp, Vote bnp, BNP, About Us, Team, গুলশান ২, ঢাকা',
            'https://vote-bnp.com/about-us'
        );
    }
}
