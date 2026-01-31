import { Component, OnInit, OnDestroy } from '@angular/core';
import { CandidateService, Candidate } from '../../../../core/services/candidate.service';
import { LocationService, District, Division, Seat } from '../../../../core/services/location.service';
import { Api } from '../../../../core/services/api';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  standalone: false
})
export class LandingComponent implements OnInit, OnDestroy {
  selectedDivision: string | null = null;
  selectedDivisionBn: string | null = null;
  selectedDivisionId: number | null = null;
  districts: District[] = [];
  showModal = false;
  isLoading = false;
  isSeoExpanded = false;

  // Carousel State
  carouselImages: string[] = [
    '/carousel/1C.jpeg',
    '/carousel/2C.jpeg',
    '/carousel/3C.jpeg',
    '/carousel/4C.jpeg',
    '/carousel/5C.jpeg',
    '/carousel/6C.jpeg',
    '/carousel/7C.jpeg',
    '/carousel/8C.jpeg',
    '/carousel/9C.jpeg',
    '/carousel/10C.jpeg',
    '/carousel/11C.jpeg',
  ];
  displayImages: string[] = [];
  transitionEnabled = true;
  currentSlide = 0;
  private readonly clonesCount = 3; // Support up to 3 items per view

  // Lightbox State
  showLightbox = false;
  selectedImageIndex = 0;
  private destroy$ = new Subject<void>();
  private autoplayInterval: any;

  constructor(
    private candidateService: CandidateService,
    private locationService: LocationService,
    private api: Api,
    public router: Router,
    private seoService: SeoService
  ) { }

  ngOnInit() {
    this.seoService.updatePageSeo(
      'Vote BNP | Find BNP Candidates & Election Information',
      'Explore BNP candidates, manifesto and election updates. Vote BNP and take part in shaping Bangladesh’s future through national participation.',
      'https://vote-bnp.com/bnp_logo.jpg',
      'Vote for bnp, Vote-bnp, Vote bnp, BNP, Bangladesh Nationalist Party, Election, Bangladesh, ধানের শীষ',
      'https://vote-bnp.com'
    );
    this.initInfiniteCarousel();
    this.preloadLandingImages();

    // Combined Schema (Organization + FAQ)
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://vote-bnp.com/#organization",
          "name": "Vote BNP",
          "url": "https://vote-bnp.com",
          "logo": "https://vote-bnp.com/bnp_logo.jpg",
          "sameAs": [
            "https://facebook.com/bnp.digital",
            "https://twitter.com/bnp_digital"
          ],
          "description": "Official campaign portal for Bangladesh Nationalist Party."
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What does it mean to “Vote BNP”?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Voting BNP means choosing BNP (Bangladesh Nationalist Party) candidates in national or local elections. Supporters view a vote for BNP as a vote for democratic participation, accountability, and political reform in Bangladesh."
              }
            },
            {
              "@type": "Question",
              "name": "What is the symbol of BNP on the ballot?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "BNP’s election symbol is the Sheaf of Paddy, which voters select on the ballot to support BNP candidates."
              }
            },
            {
              "@type": "Question",
              "name": "How do I find my BNP candidate for my constituency?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can find your BNP candidate by selecting your division, district, and constituency. Our candidate finder helps voters identify BNP nominees for their local seat."
              }
            },
            {
              "@type": "Question",
              "name": "What values does BNP promote?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "BNP promotes democratic representation, constitutional rights, electoral transparency, national development, and political accountability."
              }
            },
            {
              "@type": "Question",
              "name": "Why do some voters choose BNP?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Many voters support the BNP due to its stance on democratic governance, reforms, national interest, and citizen rights. For supporters, voting BNP represents a pathway for change."
              }
            }
          ]
        }
      ]
    };
    this.seoService.setJsonLd(schema);
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleDivisionSelect(divisionName: string) {
    console.log('Map Event Received: ', divisionName);
    this.selectedDivision = divisionName;
    this.isLoading = true;
    this.showModal = true;
    this.districts = []; // Clear previous districts while loading

    this.locationService.getDivisions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (divisions: Division[]) => {
          const division = divisions.find(d => d.name.toLowerCase() === divisionName.toLowerCase());

          if (division) {
            console.log('Matched Division:', division);
            this.selectedDivisionId = division.id;
            this.selectedDivisionBn = division.bn_name || division.name;

            this.api.getDistricts(division.id)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (districts: District[]) => {
                  console.log('Districts Filtered:', districts.length);
                  this.districts = districts;
                  this.isLoading = false;
                },
                error: (err: any) => {
                  console.error('API Error:', err);
                  this.isLoading = false;
                }
              });
          } else {
            console.warn('No division match found for:', divisionName);
            this.selectedDivisionBn = divisionName;
            this.isLoading = false; // Stop loading if no division found
          }
        },
        error: (err) => {
          console.error('Data loading error:', err);
          this.isLoading = false;
        }
      });
  }

  closeModal() {
    this.showModal = false;
    this.selectedDivision = null;
    this.selectedDivisionId = null;
    this.districts = [];
    this.isLoading = false;
  }

  onDistrictSelect(district: District) {
    console.log('District Selected:', district.name);
    this.router.navigate(['/candidates'], {
      queryParams: {
        districtId: district.id,
        districtName: district.name, // Pass English name for API
        districtBnName: district.bn_name || district.name, // Pass BN name for display
        divisionName: this.selectedDivisionBn || this.selectedDivision
      }
    });
    this.closeModal();
  }
  onImgLoad(event: any) {
    event.target.classList.add('loaded');
  }

  toggleSeo() {
    this.isSeoExpanded = !this.isSeoExpanded;
  }

  // Carousel Methods
  startAutoplay() {
    this.stopAutoplay(); // Clear any existing interval
    this.autoplayInterval = setInterval(() => {
      if (!this.showLightbox) {
        this.nextSlide();
      }
    }, 4000); // Swap every 4 seconds
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  get itemsPerView(): number {
    if (typeof window === 'undefined') return 1;
    const width = window.innerWidth;
    if (width >= 1024) return 2; // Large (Now 2 for bigger images)
    return 1;                   // Mobile & Tablet (Now 1 for maximum clarity)
  }

  get maxSlide(): number {
    return Math.max(0, this.carouselImages.length - this.itemsPerView);
  }

  nextSlide() {
    if (!this.transitionEnabled) return;
    this.currentSlide++;
  }

  prevSlide() {
    if (!this.transitionEnabled) return;
    this.currentSlide--;
  }

  handleTransitionEnd() {
    if (this.currentSlide >= this.carouselImages.length + this.clonesCount) {
      this.transitionEnabled = false;
      this.currentSlide = this.clonesCount;
      setTimeout(() => this.transitionEnabled = true, 50);
    } else if (this.currentSlide < this.clonesCount) {
      this.transitionEnabled = false;
      this.currentSlide = this.carouselImages.length + this.clonesCount - 1;
      setTimeout(() => this.transitionEnabled = true, 50);
    }
  }

  goToSlide(index: number) {
    this.currentSlide = index + this.clonesCount;
  }

  // Lightbox Methods
  openLightbox(index: number) {
    this.stopAutoplay();
    this.selectedImageIndex = index;
    this.showLightbox = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  closeLightbox() {
    this.startAutoplay();
    this.showLightbox = false;
    document.body.style.overflow = 'auto'; // Restore scrolling
  }

  nextLightboxImage(event?: Event) {
    if (event) event.stopPropagation();
    this.selectedImageIndex = (this.selectedImageIndex + 1) % this.carouselImages.length;
  }

  prevLightboxImage(event?: Event) {
    if (event) event.stopPropagation();
    this.selectedImageIndex = (this.selectedImageIndex - 1 + this.carouselImages.length) % this.carouselImages.length;
  }

  private initInfiniteCarousel() {
    this.displayImages = [
      ...this.carouselImages.slice(-this.clonesCount),
      ...this.carouselImages,
      ...this.carouselImages.slice(0, this.clonesCount)
    ];
    this.currentSlide = this.clonesCount;
  }

  private preloadLandingImages() {
    const images = [
      '/landing/1.jpeg',
      '/landing/2.jpeg',
      '/landing/3.jpeg'
    ];
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }
}
