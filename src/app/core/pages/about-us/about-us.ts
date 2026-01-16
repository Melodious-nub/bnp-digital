import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-about-us',
    templateUrl: './about-us.html',
    styleUrl: './about-us.scss',
    standalone: false
})
export class AboutUsComponent {
    constructor(public router: Router) { }

    teamMembers = [
        {
            name: 'Team Member 1',
            role: 'Role Description',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop',
            facebook: 'https://facebook.com',
            linkedin: 'https://linkedin.com'
        },
        {
            name: 'Team Member 2',
            role: 'Role Description',
            photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&h=256&auto=format&fit=crop',
            facebook: 'https://facebook.com',
            linkedin: 'https://linkedin.com'
        },
        {
            name: 'Team Member 3',
            role: 'Role Description',
            photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&auto=format&fit=crop',
            facebook: 'https://facebook.com',
            linkedin: 'https://linkedin.com'
        },
        {
            name: 'Team Member 4',
            role: 'Role Description',
            photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop',
            facebook: 'https://facebook.com',
            linkedin: 'https://linkedin.com'
        },
        {
            name: 'Team Member 5',
            role: 'Role Description',
            photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&auto=format&fit=crop',
            facebook: 'https://facebook.com',
            linkedin: 'https://linkedin.com'
        },
        {
            name: 'Team Member 6',
            role: 'Role Description',
            photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&auto=format&fit=crop',
            facebook: 'https://facebook.com',
            linkedin: 'https://linkedin.com'
        }
    ];
}
