import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-scroll-to-top',
    template: `
    <button 
      class="scroll-to-top" 
      [class.show]="showButton"
      (click)="scrollToTop()"
      aria-label="Scroll to top">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  `,
    styles: [`
    .scroll-to-top {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background-color: #1a5e4d;
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 999;
    }

    .scroll-to-top.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .scroll-to-top:hover {
      background-color: #f42a41;
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(244, 42, 65, 0.3);
    }

    .scroll-to-top svg {
      width: 24px;
      height: 24px;
    }

    @media (max-width: 768px) {
      .scroll-to-top {
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
      }
    }
  `],
    standalone: false
})
export class ScrollToTopComponent {
    showButton = false;

    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.showButton = window.pageYOffset > 400;
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}
