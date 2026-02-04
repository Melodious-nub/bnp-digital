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

    isMobileMenuOpen = false;

    constructor(public router: Router) { }

    get headerClass() {
        let base = 'sticky top-0 z-[100] bg-white/95 backdrop-blur-md border-b border-gray-100 py-3 md:py-4 transition-all duration-300 shadow-sm';
        return base;
    }

    toggleMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    onLogoClick() {
        this.router.navigate(['/']);
        this.isMobileMenuOpen = false;
    }

    onBackClick() {
        this.back.emit();
    }
}
