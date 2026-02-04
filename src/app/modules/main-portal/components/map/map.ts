import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CandidateService, Candidate } from '../../../../core/services/candidate.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrls: ['./map.scss'],
  standalone: false
})
export class MapComponent implements OnInit {
  @Output() divisionSelected = new EventEmitter<string>();

  candidates: Candidate[] = [];
  @Input() selectedDivision: string | null = null;

  divisionsLabels = [
    { id: 'Dhaka', name: 'ঢাকা', x: 470, y: 510 },
    { id: 'Chittagong', name: 'চট্টগ্রাম', x: 740, y: 650 },
    { id: 'Sylhet', name: 'সিলেট', x: 690, y: 340 },
    { id: 'Khulna', name: 'খুলনা', x: 370, y: 630 },
    { id: 'Barishal', name: 'বরিশাল', x: 495, y: 695 },
    { id: 'Rajshahi', name: 'রাজশাহী', x: 340, y: 380 },
    { id: 'Rangpur', name: 'রংপুর', x: 320, y: 180 },
    { id: 'Mymensingh', name: 'ময়মনসিংহ', x: 510, y: 310 }
  ];

  constructor(private candidateService: CandidateService) { }

  ngOnInit() {
    this.candidateService.getAllCandidates().subscribe({
      next: (data) => {
        this.candidates = data;
        // console.log('Candidates loaded:', this.candidates);
      },
      error: (err) => { } // console.error('Error loading candidates:', err)
    });
  }

  selectDivision(divisionName: string) {
    this.selectedDivision = divisionName;
    this.divisionSelected.emit(divisionName);
  }



  getCandidateCount(divisionId: number): number {
    return this.candidates.filter(c => c.division_id === divisionId).length;
  }
}
