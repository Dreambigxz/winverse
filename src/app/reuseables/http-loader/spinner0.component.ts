import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderService } from './loader.service';
import { Observable, of} from 'rxjs';

// <div class="spinner"></div>
// <div *ngIf="isLoading | async" class="spinner-overlay"> <div class="spinner"></div> </div>
@Component({
  selector: 'app-spinner',
  imports: [ CommonModule],

  template: `
    <div *ngIf="isLoading | async" class="spinner-overlay">

    <div class="logo-container">

      <div class="glow-ring"></div>

      <img src="assets/img/favicon.svg"
           alt="App Logo"
           class="logo-float" />

    </div>

    <div class="loading-text">
      Securing connection...
    </div>

  </div>
`,
styles: [`

    /* overlay */
  .spinner-overlay {
    position: fixed;
    inset: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    backdrop-filter: blur(2px);
    background: rgba(20, 14, 6, 0.6);

    z-index: 2000;
    overflow: hidden;
  }

  /* container */
  .logo-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* loading text */
  .loading-text {
    position: absolute;
    bottom: 35%;
    font-size: 13px;
    color: #ffeb3b;
    letter-spacing: 0.4px;
    animation: fadePulse 1.6s infinite;
  }

  @keyframes fadePulse {
    0%,100% { opacity: .4 }
    50% { opacity: 1 }
  }

  /* glow ring */
  .glow-ring {
    position: absolute;

    width: 110px;
    height: 110px;

    border-radius: 50%;

    background: radial-gradient(circle,
      rgba(255,152,0,0.6),
      rgba(255,235,59,0.2),
      transparent
    );

    animation: pulseGlow 2s ease-in-out infinite;
  }

  /* logo */
  .logo-float {
    width: 70px;
    max-width: 35vw;

    z-index: 2;

    filter: drop-shadow(0 0 12px rgba(255,152,0,0.6));

    animation: logoFloat 2.2s ease-in-out infinite;
  }

  /* float */
  @keyframes logoFloat {
    0%,100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  /* glow pulse */
  @keyframes pulseGlow {
    0%,100% {
      transform: scale(.9);
      opacity: .7;
    }
    50% {
      transform: scale(1.25);
      opacity: .2;
    }
  }

  /* mobile */
  @media (max-width: 480px) {

    .logo-float {
      width: 55px;
    }

    .glow-ring {
      width: 90px;
      height: 90px;
    }

  }

  `]
})
export class SpinnerComponent {
    isLoading: Observable<boolean>;
   constructor(private loaderService: LoaderService) {
     this.isLoading = this.loaderService.loading$; // ✅ safe
   }

}
