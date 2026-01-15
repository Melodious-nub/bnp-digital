import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DIVISIONS, DISTRICTS, SEATS } from '../data/mock-data';

export interface Division {
    id: number;
    name: string;
    bn_name?: string;
}

export interface District {
    id: number;
    division_id: number;
    name: string;
    bn_name?: string;
}

export interface Seat {
    id: number;
    district_id: number;
    name: string;
    name_en?: string;
    candidate_slug: string | null;
    candidate_name: string | null;
    candidate_photo?: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    constructor() { }

    getDivisions(): Observable<Division[]> {
        console.log('LocationService: Fetching Divisions');
        return of(DIVISIONS);
    }

    getDistrictsByDivision(divisionId: number): Observable<District[]> {
        console.log('LocationService: Fetching Districts for Division', divisionId);
        return of(DISTRICTS.filter(d => d.division_id === divisionId));
    }

    getSeatsByDistrict(districtId: number): Observable<Seat[]> {
        console.log('LocationService: Fetching Seats for District', districtId);
        return of(SEATS.filter(s => s.district_id === districtId));
    }
}
