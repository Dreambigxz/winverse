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

      <div class="await-loader">

      <div class="loader-ring"></div>

      <div class="loader-text">

        Please wait...

      </div>

      </div>
    </div>
`,
styles: [`

  .spinner-overlay {
    position: fixed;
    inset: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    backdrop-filter: blur(1px);

    z-index: 99999999;
    overflow: hidden;
  }


  .await-loader {

      min-height: 12rem;

      display: flex;

      flex-direction: column;

      align-items: center;

      justify-content: center;

      gap: 1rem;

      }

      /* OUTER RING */

      .loader-ring {

      width: 4rem;
      height: 4rem;

      border-radius: 50%;

      border:
        .2rem solid rgba(205,127,214,.12);

      border-top-color: #cd7fd6;

      animation:
        spin 1s linear infinite;

      position: relative;

      }

      /* INNER GLOW */

      .loader-ring::after {

      content: '';

      position: absolute;

      inset: .4rem;

      border-radius: 50%;

      background:
        radial-gradient(
          circle,
          rgba(205,127,214,.18),
          transparent
        );

      }

      /* TEXT */

      .loader-text {

      color:
        rgba(255,255,255,.75);

      font-size: .9rem;

      font-weight: 700;

      letter-spacing: .04rem;

      animation:
        fadePulse 1.5s ease infinite;

      }

      @keyframes spin {

      from {

        transform:
          rotate(0deg);

      }

      to {

        transform:
          rotate(360deg);

      }

      }

      @keyframes fadePulse {

      0%,100% {

        opacity: .5;

      }

      50% {

        opacity: 1;

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
