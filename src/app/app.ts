import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

import { CoreModule } from './core/core-module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CoreModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('multi-tenent-frontend');
  loading = signal(false);

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // Enforce scroll to top on every navigation
        if (event instanceof NavigationEnd) {
          window.scrollTo({
            top: 0,
            behavior: 'instant' // Instant is better for route changes to avoid seeing the old scroll position
          });
        }

        // Add a slight delay for better UX and smoother transitions
        setTimeout(() => {
          this.loading.set(false);
        }, 500);
      }
    });
  }

  ngOnInit() {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (slug) {
      console.log('Subdomain/Slug detected:', slug);
      this.router.navigate(['/portfolio'], { queryParams: { slug: slug } });
    }
  }
}
