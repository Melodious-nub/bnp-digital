import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('multi-tenent-frontend');

  constructor(private router: Router) { }

  ngOnInit() {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    // Subdomain logic (ziaur.bnp-project.com)
    // On localhost, we can test with ?slug=name or similar emulations
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (slug) {
      console.log('Subdomain/Slug detected:', slug);
      // In a real scenario, parts.length > 2 etc. would be used
      // For now, if slug is present, navigate to portfolio
      this.router.navigate(['/portfolio'], { queryParams: { slug: slug } });
    }
  }
}
