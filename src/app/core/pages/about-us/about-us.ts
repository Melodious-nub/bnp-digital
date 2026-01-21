import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface TeamMember {
    name: string;
    role: string;
    photoUrl: string;
    facebookLink: string;
    linkedinLink?: string;
}

interface TeamCategory {
    title: string;
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
            title: 'Media & Technology',
            members: [
                {
                    name: 'S M Mahmudul Hyder (Mim)',
                    role: 'Media & Technology',
                    photoUrl: '/teams/SM_Mahmudul_Hyder.png',
                    facebookLink: 'https://www.facebook.com/smmhyder/',
                    linkedinLink: 'https://www.linkedin.com/in/smmhyder/'
                },
                {
                    name: 'Chowdhury Tanjil J',
                    role: 'Media & Technology',
                    photoUrl: '/teams/Chowdhury_Tanjil.png',
                    facebookLink: 'https://www.facebook.com/tjc1971',
                    linkedinLink: 'https://www.linkedin.com/in/tanjil1971'
                },
                {
                    name: 'Salim Mahmud',
                    role: 'Media & Technology',
                    photoUrl: '/teams/Salim_Mahmud.png',
                    facebookLink: 'https://www.facebook.com/salim.mahmud.7758'
                }
            ]
        },
        {
            title: 'Co-ordination & Communication',
            members: [
                {
                    name: 'Md Shafikul Islam Riblu',
                    role: 'Co-ordination & Communication',
                    photoUrl: '/teams/MdShafikul_Islam_Riblu.png',
                    facebookLink: 'https://www.facebook.com/mdshafikul.islam.73'
                },
                {
                    name: 'Zul Afros',
                    role: 'Co-ordination & Communication',
                    photoUrl: '/teams/Zul_Afros.png',
                    facebookLink: 'https://www.facebook.com/zul.afros'
                }
            ]
        },
        {
            title: 'Advisor & Patron',
            members: [
                {
                    name: 'Barrister M A Salam',
                    role: 'Advisor & Patron',
                    photoUrl: '/teams/Barrister_MA_Salam.png',
                    facebookLink: 'https://www.facebook.com/barristermasalam'
                },
                {
                    name: 'Barrister Sharif Hyder',
                    role: 'Advisor & Patron',
                    photoUrl: '/teams/Barrister_Sharif_Hyder.png',
                    facebookLink: 'https://www.facebook.com/smshyder'
                }
            ]
        }
    ];

    constructor(public router: Router) { }

    ngOnInit(): void { }
}
