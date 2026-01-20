import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Api {
  baseUrl = 'https://api.vote-bnp.com/api';

  constructor(private https: HttpClient) { }

  get<T>(path: string, params?: any) {
    return this.https.get<T>(`${this.baseUrl}${path}`, { params });
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

  submitContactForm(data: any) {
    return this.https.post(`${this.baseUrl}/contact/submit`, data);
  }

  ensureHttps(url: string | undefined): string | undefined {
    if (!url) return url;
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  }
}

