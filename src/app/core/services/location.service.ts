import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DIVISIONS, DISTRICTS } from '../data/mock-data';

export interface Division {
    id: number;
    name: string;
}

export interface District {
    id: number;
    division_id: number;
    name: string;
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
}
