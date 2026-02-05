import { Routes, UrlSegment, UrlMatchResult } from '@angular/router';

export const routes: Routes = [
    // 1. Root-level Slug Route (e.g. domain.com/candidate-slug)
    // We use a matcher to avoid capturing main portal routes like 'candidates', 'login', etc.
    {
        matcher: (url: UrlSegment[]): UrlMatchResult | null => {
            const PORTAL_PATHS = ['candidates', 'login', 'about-us', 'contact-us', 'frame-editor', 'promise-wall', 'reform-plan'];
            if (url.length === 1 && !PORTAL_PATHS.includes(url[0].path)) {
                return {
                    consumed: url,
                    posParams: { slug: url[0] }
                };
            }
            return null;
        },
        loadChildren: () => import('./modules/portfolio/portfolio-module').then(m => m.PortfolioModule)
    },

    // 2. Legacy/Fallback Profile Prefix (e.g. domain.com/profile/candidate-slug)
    {
        path: 'profile/:slug',
        pathMatch: 'full',
        loadChildren: () => import('./modules/portfolio/portfolio-module').then(m => m.PortfolioModule)
    },

    // 3. Subdomain Logic (e.g. candidate.domain.com)
    {
        matcher: (url: UrlSegment[]): UrlMatchResult | null => {
            const host = window.location.hostname;
            const parts = host.split('.');
            let isSubdomain = false;

            if (host.includes('localhost')) {
                isSubdomain = parts.length >= 2 && parts[0] !== 'www';
            } else if (host.includes('vercel.app')) {
                isSubdomain = parts.length >= 4 && parts[0] !== 'www';
            } else if (host.includes('vote-bnp.com')) {
                isSubdomain = parts.length > 2 && parts[0] !== 'www';
            } else {
                isSubdomain = parts.length > 2 && parts[0] !== 'www';
            }

            if (isSubdomain) {
                return { consumed: url };
            }
            return null;
        },
        loadChildren: () => import('./modules/portfolio/portfolio-module').then(m => m.PortfolioModule)
    },

    // 4. Main Portal (Landing, Candidates List, etc.)
    {
        path: '',
        loadChildren: () => import('./modules/main-portal/main-portal-module').then(m => m.MainPortalModule)
    }
];
