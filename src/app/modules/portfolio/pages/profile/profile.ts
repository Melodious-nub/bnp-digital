import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService, Candidate } from '../../../../core/services/candidate.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Api } from '../../../../core/services/api';
import { LoadingService } from '../../../../core/services/loading.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  standalone: false,
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  slug: string | null = null;
  candidate: Candidate | null = null;
  isLoading = true;
  selectedImageUrl: string | null = null;
  contactForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private candidateService: CandidateService,
    public router: Router,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private api: Api,
    private loaderService: LoadingService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openLightbox(url: string) {
    this.selectedImageUrl = url;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  closeLightbox() {
    this.selectedImageUrl = null;
    document.body.style.overflow = ''; // Restore scrolling
  }

  onSubmit() {
    if (this.contactForm.valid) {
      Swal.fire({
        title: 'ধন্যবাদ!',
        text: 'Backend not connected yet.',
        icon: 'info',
        confirmButtonText: 'ঠিক আছে',
        confirmButtonColor: '#1a5e4d'
      });
      this.contactForm.reset();
    } else {
      Swal.fire({
        title: 'ভুল হয়েছে',
        text: 'অনুগ্রহ করে সব ঘরগুলো সঠিক ভাবে পূরণ করুন।',
        icon: 'error',
        confirmButtonText: 'আবার চেষ্টা করুন',
        confirmButtonColor: '#f42a41'
      });
    }
  }

  ngOnInit() {
    // 1. Check for Path-based routing (Workaround for Vercel/No-Wildcard envs)
    // We check current route OR parent route (since param is defined in app.routes)
    const routeSlug = this.route.snapshot.paramMap.get('slug') || this.route.parent?.snapshot.paramMap.get('slug');

    if (routeSlug) {
      this.slug = routeSlug;
      this.loadCandidate();
      return;
    }

    // 2. Fallback to Subdomain routing
    const host = window.location.hostname;
    const parts = host.split('.');

    // Check if we are on a subdomain (excluding www)
    const isSubdomain = (host.includes('localhost') ? parts.length >= 2 : parts.length > 2) && parts[0] !== 'www';

    if (isSubdomain) {
      // Extract slug from subdomain
      this.slug = parts[0];
      console.log('Subdomain slug detected in ProfileComponent:', this.slug);
      this.loadCandidate();
    } else {
      // 3. Last resort: Query params (legacy)
      this.route.queryParams.subscribe(params => {
        this.slug = params['slug'];
        if (this.slug) {
          this.loadCandidate();
        } else {
          this.isLoading = false;
        }
      });
    }
  }

  loadCandidate() {
    this.isLoading = true;
    this.loaderService.setLoading(true);
    if (!this.slug) {
      this.isLoading = false;
      this.loaderService.setLoading(false);
      return;
    }

    this.api.getCandidateProfile(this.slug)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.loaderService.setLoading(false);
      }))
      .subscribe({
        next: (data) => {
          // Map API response to Candidate interface
          const photos = data.gallery?.filter((f: any) => f.fileType === 'image').map((f: any) => f.fileUrl) || [];
          const videos = data.gallery?.filter((f: any) => f.fileType === 'video').map((f: any) => f.fileUrl) || [];

          this.candidate = {
            id: data.id,
            full_name: data.fullNameBn || data.fullNameEn, // Use Bengali name as primary
            slug: data.slug,
            division_id: data.divisionId,
            district_id: data.districtId,
            division_name: data.divisionBn,
            district_name: data.districtBn,
            designation: data.designation,
            photo_url: data.photoUrl,
            bio: data.introBn, // Use Bengali bio
            campaign_images: [],
            recent_activity: [],
            stats: {
              followers: '150K', // Placeholder/Static for now if not in API
              volunteers: '500+',
              events_held: 25
            },
            manifesto: {
              title: "ভিশন",
              points: data.visionBn ? data.visionBn.split('\r\n\r\n') : [] // Split text into points
            },
            seat_name: `${data.districtBn}-${data.constituencyNo}`, // Construct seat name
            political_journey: data.politicalJourneyBn,
            personal_life: data.personalProfileBn,
            constituency_plan: data.visionBn, // Map vision to constituency plan as well if distinct one missing
            gallery: photos,
            videos: videos
          } as any; // Cast to any to fit flexible Candidate interface or mismatched fields
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  goBack() {
    const host = window.location.hostname;

    // Check if the current host starts with the slug (indicating Subdomain Routing)
    // Only applies if we are actually using custom domains/subdomains + slug is present
    if (this.slug && host.startsWith(this.slug + '.')) {
      const protocol = window.location.protocol;
      const port = window.location.port ? ':' + window.location.port : '';
      const parts = host.split('.');
      let rootDomain = host;

      if (host.includes('localhost')) {
        if (parts.length >= 2) rootDomain = parts.slice(1).join('.');
      } else {
        // e.g. slug.bnp.com -> bnp.com
        // Avoid stripping if it's already a main domain like 'myapp.vercel.app'
        if (parts.length > 2) rootDomain = parts.slice(1).join('.');
      }
      window.location.href = `${protocol}//${rootDomain}${port}/`;
    } else {
      // Path-based routing (Vercel workaround / Localhost Fallback)
      // Simply navigate to the root route configured in Angular
      this.router.navigate(['/']);
    }
  }
}
