import { Component, signal, OnInit, Signal } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CoreModule } from './core/core-module';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CoreModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('multi-tenent-frontend');
  loading!: Signal<boolean>;

  constructor(
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.loading = this.loadingService.loading;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.setLoading(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // Enforce scroll to top on every navigation
        if (event instanceof NavigationEnd) {
          window.scrollTo({
            top: 0,
            behavior: 'instant'
          });
        }

        // Slight delay for transition smoothness
        setTimeout(() => {
          this.loadingService.setLoading(false);
        }, 500);
      }
    });
  }

  ngOnInit() {
    // Current routing logic is handled by app.routes.ts and matcher
  }
}
