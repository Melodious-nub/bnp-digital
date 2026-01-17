import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService, Candidate } from '../../../../core/services/candidate.service';
import { LocationService, Seat } from '../../../../core/services/location.service';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.html',
  styleUrl: './candidate-list.scss',
  standalone: false
})
export class CandidateListComponent implements OnInit {
  districtId: number | null = null;
  districtName: string = '';
  divisionName: string = '';
  candidates: Candidate[] = [];
  seats: Seat[] = [];
  searchQuery: string = '';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidateService: CandidateService,
    private locationService: LocationService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.districtId = +params['districtId'];
      this.districtName = params['districtName'];
      this.divisionName = params['divisionName'] || 'Central Hub';

      if (this.districtId) {
        this.loadCandidates();
        this.loadSeats();
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
    }
  }

  loadSeats() {
    if (this.districtId) {
      this.locationService.getSeatsByDistrict(this.districtId).subscribe({
        next: (seats) => {
          this.seats = seats;
        },
        error: (err) => console.error(err)
      });
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
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/profile', slug])
    );
    window.open(url, '_blank');
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
