import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CANDIDATES } from '../data/mock-data';

export interface Candidate {
    id: number;
    full_name: string;
    slug: string;
    division_id: number;
    district_id: number;
    photo_url: string;
    designation: string;
    bio: string;
    division_name?: string;
    district_name?: string;

    // Extended Profile Data
    campaign_images: string[];
    recent_activity: {
        id: number;
        date: string;
        title: string;
        excerpt: string;
        image_url?: string;
        type: 'Rally' | 'Meeting' | 'Press' | 'Community';
    }[];
    stats: {
        followers: string;
        volunteers: string;
        events_held: number;
    };
    manifesto: {
        title: string;
        points: string[];
    };
}

@Injectable({
    providedIn: 'root'
})
export class CandidateService {
    constructor() { }

    getAllCandidates(): Observable<Candidate[]> {
        console.log('CandidateService: Fetching all candidates');
        return of(CANDIDATES);
    }

    getCandidatesByDistrict(districtId: number): Observable<Candidate[]> {
        console.log('CandidateService: Fetching candidates for district', districtId);
        return of(CANDIDATES.filter(c => c.district_id === districtId));
    }

    getCandidateBySlug(slug: string): Observable<Candidate> {
        console.log('CandidateService: Fetching candidate by slug', slug);
        const candidate = CANDIDATES.find(c => c.slug === slug);
        return of(candidate!);
    }
}
