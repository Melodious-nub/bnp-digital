import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.html',
    styleUrl: './header.scss',
    standalone: false
})
export class HeaderComponent {
    @Input() type: 'landing' | 'candidate-list' | 'profile' = 'landing';
    @Output() back = new EventEmitter<void>();

    constructor(private router: Router) { }

    get headerClass() {
        let base = 'sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100 py-4';
        if (this.type === 'profile') {
            base += ' shadow-sm transition-all duration-300';
        }
        return base;
    }

    onLogoClick() {
        if (this.type === 'landing' || this.type === 'candidate-list') {
            this.back.emit();
        }
        // In landing, it navigates to / via back.emit() if handled by parent, 
        // but in Landing page it was (click)="router.navigate(['/'])".
        // I'll make it flexible.
    }

    onBackClick() {
        this.back.emit();
    }
}
