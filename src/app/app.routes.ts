import { Routes, UrlSegment, UrlMatchResult } from '@angular/router';

export const routes: Routes = [
    // Workaround Route for environments without subdomain support (e.g. Vercel free tier)
    {
        path: 'profile/:slug',
        pathMatch: 'full', // Ensure specific path match
        loadChildren: () => import('./modules/portfolio/portfolio-module').then(m => m.PortfolioModule)
    },
    {
        matcher: (url: UrlSegment[]): UrlMatchResult | null => {
            const host = window.location.hostname;
            const parts = host.split('.');
            let isSubdomain = false;

            // Simple logic checks for localhost development or typical production subdomains
            if (host.includes('localhost')) {
                // e.g. "leader-dhaka.localhost" -> parts = 2
                isSubdomain = parts.length >= 2 && parts[0] !== 'www';
            } else if (host.includes('vercel.app')) {
                // Vercel Free Tier specific check
                // "bnp-digital.vercel.app" -> parts=3 (NOT a candidate subdomain)
                // "candidate.bnp-digital.vercel.app" -> parts=4 (IS a candidate subdomain)
                isSubdomain = parts.length >= 4 && parts[0] !== 'www';
            } else {
                // Production custom domain
                // e.g. "leader.bnp.com" -> parts = 3
                isSubdomain = parts.length > 2 && parts[0] !== 'www';
            }

            if (isSubdomain) {
                // If it's a subdomain, we map EVERYTHING to the portfolio module
                // We consume the entire URL so the child module handles the rest (usually just the root component)
                return { consumed: url };
            }
            return null;
        },
        loadChildren: () => import('./modules/portfolio/portfolio-module').then(m => m.PortfolioModule)
    },
    {
        path: '',
        loadChildren: () => import('./modules/main-portal/main-portal-module').then(m => m.MainPortalModule)
    }
];
