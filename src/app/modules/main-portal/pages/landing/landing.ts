import { Component, OnInit } from '@angular/core';
import { CandidateService, Candidate } from '../../../../core/services/candidate.service';
import { LocationService, District, Division, Seat } from '../../../../core/services/location.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  standalone: false
})
export class LandingComponent implements OnInit {
  selectedDivision: string | null = null;
  selectedDivisionBn: string | null = null;
  selectedDivisionId: number | null = null;
  districts: District[] = [];
  showModal = false;

  constructor(
    private candidateService: CandidateService,
    private locationService: LocationService,
    public router: Router
  ) { }

  ngOnInit() {
    console.log('LandingComponent Initialized');
  }

  handleDivisionSelect(divisionName: string) {
    console.log('Map Event Received: ', divisionName);
    this.selectedDivision = divisionName;

    this.locationService.getDivisions().subscribe({
      next: (divisions) => {
        const division = divisions.find(d => d.name.toLowerCase() === divisionName.toLowerCase());

        if (division) {
          console.log('Matched Division:', division);
          this.selectedDivisionId = division.id;
          this.selectedDivisionBn = division.bn_name || division.name;

          this.locationService.getDistrictsByDivision(division.id).subscribe(districts => {
            console.log('Districts Filtered:', districts.length);
            this.districts = districts;
            this.showModal = true;
          });
        } else {
          console.warn('No division match found for:', divisionName);
          this.selectedDivisionBn = divisionName;
          this.showModal = true;
        }
      },
      error: (err) => console.error('Data loading error:', err)
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedDivision = null;
    this.selectedDivisionId = null;
    this.districts = [];
  }

  onDistrictSelect(district: District) {
    console.log('District Selected:', district.name);
    this.router.navigate(['/candidates'], {
      queryParams: {
        districtId: district.id,
        districtName: district.bn_name || district.name,
        divisionName: this.selectedDivisionBn || this.selectedDivision
      }
    });
    this.closeModal();
  }
}
