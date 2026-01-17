import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private _loading = signal(false);
    public loading = this._loading.asReadonly();
    private activeRequests = 0;

    setLoading(value: boolean) {
        if (value) {
            this.activeRequests++;
        } else {
            this.activeRequests = Math.max(0, this.activeRequests - 1);
        }
        this._loading.set(this.activeRequests > 0);
    }
}
