import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrls: ['./login.scss'],
    standalone: false
})
export class LoginComponent {
    constructor(private router: Router) { }

    goBack() {
        this.router.navigate(['/']);
    }

    onSubmit(event: Event) {
        event.preventDefault();
        // For prototype, just redirect or show alert
        alert('Leader authentication is currently in closed beta.');
    }
}
