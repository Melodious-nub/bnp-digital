import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Api {
  baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  get<T>(path: string, params?: any) {
    return this.http.get<T>(`${this.baseUrl}${path}`, { params });
  }

  getOurTeam() {
    return this.get<any[]>('/team/public');
  }

  getCandidatesByDistrict(districtName: string) {
    return this.get<any[]>('/candidates/by-district', { districtName });
  }

  getCandidateProfile(slug: string) {
    return this.get<any>(`/candidates/profile/${slug}`);
  }

  getDistricts(divisionId: number) {
    return this.get<any[]>('/auth/districts', { divisionId });
  }

  getCandidatesByDistrictName(districtName: string) {
    return this.get<any[]>('/candidates/by-district', { districtName });
  }
}

