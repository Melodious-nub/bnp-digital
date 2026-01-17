import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { Subject, takeUntil } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

@Component({
    selector: 'app-about-us',
    templateUrl: './about-us.html',
    styleUrl: './about-us.scss',
    standalone: false
})
export class AboutUsComponent implements OnInit, OnDestroy {
    teamMembers: any[] = [];
    private destroy$ = new Subject<void>();

    constructor(
        public router: Router,
        private api: Api,
        private loadingService: LoadingService
    ) { }

    ngOnInit(): void {
        // Register this component as requiring the splash screen/loading state
        this.loadingService.setLoading(true);
        this.getOurTeam();
    }

    private getOurTeam(): void {
        this.api.getOurTeam()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: any) => {
                    this.teamMembers = data;
                    // Finish the specific component loading part
                    this.loadingService.setLoading(false);
                },
                error: (err: any) => {
                    console.error('Error fetching team:', err);
                    this.loadingService.setLoading(false);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        // Safety check to ensure loading is released if component is destroyed prematurely
        this.loadingService.setLoading(false);
    }
}
