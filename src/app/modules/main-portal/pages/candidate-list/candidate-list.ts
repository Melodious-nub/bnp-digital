import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService, Candidate } from '../../../../core/services/candidate.service';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.html',
  styleUrl: './candidate-list.scss',
  standalone: false
})
export class CandidateListComponent implements OnInit {
  districtId: number | null = null;
  districtName: string = '';
  candidates: Candidate[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidateService: CandidateService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.districtId = +params['districtId'];
      this.districtName = params['districtName'];

      if (this.districtId) {
        this.loadCandidates();
      } else {
        this.isLoading = false;
      }
    });
  }

  loadCandidates() {
    this.isLoading = true;
    if (this.districtId) {
      this.candidateService.getCandidatesByDistrict(this.districtId).subscribe({
        next: (candidates) => {
          this.candidates = candidates;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
    } else {
      // Fallback if no district selected, though usually handled by route params earlier
      this.candidateService.getAllCandidates().subscribe({
        next: (all) => {
          this.candidates = all;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }

  viewProfile(slug: string) {
    // Workaround for Vercel Free Tier (No Wildcard Subdomains)
    // We use path-based routing: /profile/:slug
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/profile', slug])
    );
    window.open(url, '_blank');
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
