import { Component, OnInit, OnDestroy } from '@angular/core';
import { CandidateService, Candidate } from '../../../../core/services/candidate.service';
import { LocationService, District, Division, Seat } from '../../../../core/services/location.service';
import { Api } from '../../../../core/services/api';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  standalone: false
})
export class LandingComponent implements OnInit, OnDestroy {
  selectedDivision: string | null = null;
  selectedDivisionBn: string | null = null;
  selectedDivisionId: number | null = null;
  districts: District[] = [];
  showModal = false;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private candidateService: CandidateService,
    private locationService: LocationService,
    private api: Api,
    public router: Router,
    private seoService: SeoService
  ) { }

  ngOnInit() {
    this.seoService.updatePageSeo(
      'Vote BNP - Home',
      'Official campaign portal for Bangladesh Nationalist Party. Support our candidates for a better future.',
      'https://vote-bnp.com/bnp_logo.jpg',
      'BNP, Vote BNP, Election, Bangladesh',
      'https://vote-bnp.com'
    );

    // Organization Schema
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Vote BNP",
      "url": "https://vote-bnp.com",
      "logo": "https://vote-bnp.com/bnp_logo.jpg",
      "sameAs": [
        "https://facebook.com/bnp.digital",
        "https://twitter.com/bnp_digital"
      ],
      "description": "Official campaign portal for Bangladesh Nationalist Party."
    };
    this.seoService.setJsonLd(schema);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleDivisionSelect(divisionName: string) {
    console.log('Map Event Received: ', divisionName);
    this.selectedDivision = divisionName;
    this.isLoading = true;
    this.showModal = true;
    this.districts = []; // Clear previous districts while loading

    this.locationService.getDivisions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (divisions: Division[]) => {
          const division = divisions.find(d => d.name.toLowerCase() === divisionName.toLowerCase());

          if (division) {
            console.log('Matched Division:', division);
            this.selectedDivisionId = division.id;
            this.selectedDivisionBn = division.bn_name || division.name;

            this.api.getDistricts(division.id)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (districts: District[]) => {
                  console.log('Districts Filtered:', districts.length);
                  this.districts = districts;
                  this.isLoading = false;
                },
                error: (err: any) => {
                  console.error('API Error:', err);
                  this.isLoading = false;
                }
              });
          } else {
            console.warn('No division match found for:', divisionName);
            this.selectedDivisionBn = divisionName;
            this.isLoading = false; // Stop loading if no division found
          }
        },
        error: (err) => {
          console.error('Data loading error:', err);
          this.isLoading = false;
        }
      });
  }

  closeModal() {
    this.showModal = false;
    this.selectedDivision = null;
    this.selectedDivisionId = null;
    this.districts = [];
    this.isLoading = false;
  }

  onDistrictSelect(district: District) {
    console.log('District Selected:', district.name);
    this.router.navigate(['/candidates'], {
      queryParams: {
        districtId: district.id,
        districtName: district.name, // Pass English name for API
        districtBnName: district.bn_name || district.name, // Pass BN name for display
        divisionName: this.selectedDivisionBn || this.selectedDivision
      }
    });
    this.closeModal();
  }
  onImgLoad(event: any) {
    event.target.classList.add('loaded');
  }
}
