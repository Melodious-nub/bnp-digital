import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SeoService } from '../../../core/services/seo.service';

interface TeamMember {
    name: string;
    role: string;
    photoUrl: string;
    facebookLink?: string;
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
            title: 'উপদেষ্টা',
            members: [
                {
                    name: 'ব্যারিস্টার এম. এ. সালাম',
                    role: 'উপদেষ্টা',
                    photoUrl: '/teams/Barrister_MA_Salam.png',
                    facebookLink: 'https://www.facebook.com/barristermasalam'
                },
                {
                    name: 'ড. মাহদী আমিন',
                    role: 'উপদেষ্টা',
                    photoUrl: '/teams/mahdi_amin.png',
                    facebookLink: 'https://www.facebook.com/share/186irNseG3/?mibextid=wwXIfr'
                },
                {
                    name: 'ড. সালেহ শিবলী',
                    role: 'উপদেষ্টা',
                    photoUrl: '/teams/Dr_Saleh_Shibly.PNG',
                    facebookLink: 'https://www.facebook.com/share/16aEYhqokY/?mibextid=wwXIfr'
                },
                {
                    name: 'রেহান এ আসাদ',
                    role: 'উপদেষ্টা',
                    photoUrl: '/teams/Rehan_Asad.PNG',
                    linkedinLink: 'https://www.linkedin.com/in/rasad'
                },
                {
                    name: 'এইচ এম সাইফ আলী খান',
                    role: 'উপদেষ্টা',
                    photoUrl: '/teams/HM_Saif_Ali_Khan.PNG',
                    facebookLink: 'https://www.facebook.com/share/1JJQdeSxda/?mibextid=wwXIfr'
                },
                {
                    name: 'ব্যারিস্টার শরীফ এম. এস. হায়দার',
                    role: 'উপদেষ্টা',
                    photoUrl: '/teams/Barrister_Sharif_Hyder.png',
                    facebookLink: 'https://www.facebook.com/smshyder'
                }
            ]
        },
        {
            title: 'রাজনৈতিক সমন্বয় ও যোগাযোগ',
            members: [
                {
                    name: 'শফিকুল ইসলাম রিবলু',
                    role: 'প্রধান সমন্বয়ক',
                    photoUrl: '/teams/MdShafikul_Islam_Riblu.png',
                    facebookLink: 'https://www.facebook.com/mdshafikul.islam.73'
                },
                {
                    name: 'আসিফ উল ইসলাম',
                    role: 'সহকারী সমন্বয়ক',
                    photoUrl: '/teams/Aasif_Ul_Islam.PNG',
                    facebookLink: 'https://www.facebook.com/share/1SHTvM5Edr/?mibextid=wwXIfr'
                }
            ]
        },
        {
            title: 'কারিগরি বাস্তবায়ন',
            members: [
                {
                    name: 'এস. এম. মাহমুদুল হায়দার (মীম)',
                    role: 'কারিগরি বাস্তবায়ন',
                    photoUrl: '/teams/SM_Mahmudul_Hyder.png',
                    facebookLink: 'https://www.facebook.com/smmhyder/',
                    linkedinLink: 'https://www.linkedin.com/in/smmhyder/'
                },
                {
                    name: 'তানজিল চৌধুরী',
                    role: 'কারিগরি বাস্তবায়ন',
                    photoUrl: '/teams/Chowdhury_Tanjil.png',
                    facebookLink: 'https://www.facebook.com/tjc1971',
                    linkedinLink: 'https://www.linkedin.com/in/tanjil1971'
                },
                {
                    name: 'সেলিম মাহমুদ',
                    role: 'কারিগরি বাস্তবায়ন',
                    photoUrl: '/teams/Salim_Mahmud.png',
                    facebookLink: 'https://www.facebook.com/salim.mahmud.7758'
                },
                {
                    name: 'জুল আফরোজ মজুমদার',
                    role: 'কারিগরি বাস্তবায়ন',
                    photoUrl: '/teams/Zul_Afros.png',
                    facebookLink: 'https://www.facebook.com/zul.afros'
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
            'Vote BNP | About Us',
            'Meet the team behind Vote BNP. Explore BNP candidates, manifesto and election updates. Vote BNP and take part in shaping Bangladesh’s future.',
            'https://vote-bnp.com/bnp_logo.jpg',
            'Vote for bnp, Vote-bnp, Vote bnp, BNP, About Us, Team, গুলশান ২, ঢাকা',
            'https://vote-bnp.com/about-us'
        );
    }
}
