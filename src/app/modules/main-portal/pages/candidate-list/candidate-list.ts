import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService, Candidate } from '../../../../core/services/candidate.service';
import { LocationService, Seat } from '../../../../core/services/location.service';
import { Api } from '../../../../core/services/api';
import { LoadingService } from '../../../../core/services/loading.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.html',
  styleUrl: './candidate-list.scss',
  standalone: false
})
export class CandidateListComponent implements OnInit, OnDestroy {
  districtId: number | null = null;
  districtName: string = '';
  districtBnName: string = '';
  divisionName: string = '';
  candidates: Candidate[] = [];
  seats: Seat[] = [];
  searchQuery: string = '';
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidateService: CandidateService,
    private locationService: LocationService,
    private api: Api,
    private loaderService: LoadingService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.districtId = +params['districtId'];
      this.districtName = params['districtName'];
      this.districtBnName = params['districtBnName'] || this.districtName;
      this.divisionName = params['divisionName'] || 'Central Hub';

      if (this.districtId) {
        this.loadCandidates();
      } else {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCandidates() {
    this.isLoading = true;
    this.loaderService.setLoading(true);

    // Prioritize Name for the API call as requested
    const targetDistrict = this.districtName || '';

    if (targetDistrict) {
      this.api.getCandidatesByDistrictName(targetDistrict)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.isLoading = false;
            this.loaderService.setLoading(false);
          })
        )
        .subscribe({
          next: (candidates) => {
            this.candidates = candidates || []; // Keep if needed for other things, or remove if only seats matter

            // Map API response to Seats
            this.seats = (candidates || []).map((c: any) => ({
              id: c.id,
              district_id: this.districtId || 0,
              name: `${c.districtBn}-${c.constituencyNo}`, // e.g. ঢাকা-১
              name_en: `${this.districtName}-${c.constituencyNo}`, // e.g. Dhaka-1
              candidate_slug: c.slug,
              candidate_name: c.fullNameBn,
              candidate_photo: c.photoUrl
            }));
          },
          error: (err) => {
            console.error('Candidate Load Error:', err);
          }
        });
    } else if (this.districtId) {
      // Fallback or alternative if needed, but user emphasized districtName API
      this.candidateService.getCandidatesByDistrict(this.districtId)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.isLoading = false;
            this.loaderService.setLoading(false);
          })
        ).subscribe({
          next: (candidates) => {
            this.candidates = candidates;
          },
          error: (err) => {
            console.error(err);
          }
        });
    } else {
      this.isLoading = false;
      this.loaderService.setLoading(false);
    }
  }

  get filteredSeats(): Seat[] {
    if (!this.searchQuery) return this.seats;
    const query = this.searchQuery.toLowerCase();
    return this.seats.filter(seat =>
      seat.name.toLowerCase().includes(query) ||
      (seat.name_en && seat.name_en.toLowerCase().includes(query)) ||
      (seat.candidate_name && seat.candidate_name.toLowerCase().includes(query))
    );
  }

  onSeatSelect(seat: Seat) {
    if (seat.candidate_slug) {
      this.viewProfile(seat.candidate_slug);
    } else {
      console.log('No candidate for seat:', seat.name);
    }
  }

  viewProfile(slug: string) {
    const protocol = window.location.protocol;
    const host = window.location.host;
    // Strip 'www.' if present to get the base domain
    const baseHost = host.replace(/^www\./, '');

    // Construct the subdomain URL: protocol://slug.domain
    const url = `${protocol}//${slug}.${baseHost}`;

    // Navigate to the candidate's subdomain
    window.open(url, '_blank');
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
