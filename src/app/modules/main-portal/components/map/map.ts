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
  hoveredDivision: string | null = null;
  hoveredDivisionBn: string | null = null;
  mouseX: number = 0;
  mouseY: number = 0;
  @Input() selectedDivision: string | null = null;

  constructor(private candidateService: CandidateService) { }

  ngOnInit() {
    this.candidateService.getAllCandidates().subscribe({
      next: (data) => {
        this.candidates = data;
        console.log('Candidates loaded:', this.candidates);
      },
      error: (err) => console.error('Error loading candidates:', err)
    });
  }

  selectDivision(divisionName: string) {
    this.selectedDivision = divisionName;
    this.divisionSelected.emit(divisionName);
  }

  onMouseEnter(divisionName: string) {
    this.hoveredDivision = divisionName;
    // Map English name to Bengali for tooltip
    const divMap: { [key: string]: string } = {
      'Dhaka': 'ঢাকা',
      'Chittagong': 'চট্টগ্রাম',
      'Sylhet': 'সিলেট',
      'Khulna': 'খুলনা',
      'Barishal': 'বরিশাল',
      'Rajshahi': 'রাজশাহী',
      'Rangpur': 'রংপুর',
      'Mymensingh': 'ময়মনসিংহ'
    };
    this.hoveredDivisionBn = divMap[divisionName] || divisionName;
  }

  onMouseLeave() {
    this.hoveredDivision = null;
    this.hoveredDivisionBn = null;
  }

  updateTooltipPosition(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY - 20; // Offset slightly above cursor
  }

  getCandidateCount(divisionId: number): number {
    return this.candidates.filter(c => c.division_id === divisionId).length;
  }
}
