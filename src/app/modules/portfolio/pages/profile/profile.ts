import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService, Candidate } from '../../../../core/services/candidate.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  standalone: false,
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  slug: string | null = null;
  candidate: Candidate | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private candidateService: CandidateService,
    public router: Router
  ) { }

  ngOnInit() {
    // 1. Check for Path-based routing (Workaround for Vercel/No-Wildcard envs)
    // We check current route OR parent route (since param is defined in app.routes)
    const routeSlug = this.route.snapshot.paramMap.get('slug') || this.route.parent?.snapshot.paramMap.get('slug');

    if (routeSlug) {
      this.slug = routeSlug;
      this.loadCandidate();
      return;
    }

    // 2. Fallback to Subdomain routing
    const host = window.location.hostname;
    const parts = host.split('.');

    // Check if we are on a subdomain (excluding www)
    const isSubdomain = (host.includes('localhost') ? parts.length >= 2 : parts.length > 2) && parts[0] !== 'www';

    if (isSubdomain) {
      // Extract slug from subdomain
      this.slug = parts[0];
      console.log('Subdomain slug detected in ProfileComponent:', this.slug);
      this.loadCandidate();
    } else {
      // 3. Last resort: Query params (legacy)
      this.route.queryParams.subscribe(params => {
        this.slug = params['slug'];
        if (this.slug) {
          this.loadCandidate();
        } else {
          this.isLoading = false;
        }
      });
    }
  }

  loadCandidate() {
    this.isLoading = true;
    if (!this.slug) return;

    this.candidateService.getCandidateBySlug(this.slug).subscribe({
      next: (data) => {
        this.candidate = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  goBack() {
    const host = window.location.hostname;

    // Check if the current host starts with the slug (indicating Subdomain Routing)
    // Only applies if we are actually using custom domains/subdomains + slug is present
    if (this.slug && host.startsWith(this.slug + '.')) {
      const protocol = window.location.protocol;
      const port = window.location.port ? ':' + window.location.port : '';
      const parts = host.split('.');
      let rootDomain = host;

      if (host.includes('localhost')) {
        if (parts.length >= 2) rootDomain = parts.slice(1).join('.');
      } else {
        // e.g. slug.bnp.com -> bnp.com
        // Avoid stripping if it's already a main domain like 'myapp.vercel.app'
        if (parts.length > 2) rootDomain = parts.slice(1).join('.');
      }
      window.location.href = `${protocol}//${rootDomain}${port}/`;
    } else {
      // Path-based routing (Vercel workaround / Localhost Fallback)
      // Simply navigate to the root route configured in Angular
      this.router.navigate(['/']);
    }
  }
}
