// src/app/services/telegram.service.ts
import { Injectable } from '@angular/core';
import { RequestDataService } from '../http-loader/request-data.service';


declare global {
  interface Navigator {
    standalone?: boolean;
  }
}



@Injectable({ providedIn: 'root' })
export class TelegramService {
  private botUsername = 'socrex_bot';  // Replace with your bot username (without @)

  constructor(private http: RequestDataService) {}

  isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  isInStandaloneMode() {
    return window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
  }

  connect(store:any= null) {

    if (store) {
      store.skippedTgBind=false
    }

    const popup = window.open('', '_blank'); // keep popup for blockers

    this.http.post('generate-token/', {}).subscribe({
      next: (res:any) => {

        const bindToken = res.bind_token;

        // Telegram deep link for app
        const tgDeepLink = `tg://resolve?domain=${this.botUsername}&start=${bindToken}`;
        // Web fallback
        const tgWebLink = `https://t.me/${this.botUsername}?start=${bindToken}`;

        // Try app first, fallback after short timeout
        if (popup) {
          if (this.isIOS() && this.isInStandaloneMode()) {
            // iOS PWA → just use web link (deep links don’t always work)
            popup.location.href = tgWebLink;
          } else if (this.isIOS()) {
            // iOS Safari → try deep link, then fallback
            window.location.href = tgDeepLink;
            setTimeout(() => {
              window.location.href = tgWebLink;
            }, 1500);
            popup.close();
          } else {
            // Android/Desktop → use popup
            popup.location.href = tgDeepLink;
            setTimeout(() => {
              if (popup && !popup.closed) {
                popup.location.href = tgWebLink;
              }
            }, 1500);
          }
        } else {
          // Popup blocked → fallback in same tab
          window.location.href = tgDeepLink;
          setTimeout(() => {
            window.location.href = tgWebLink;
          }, 1500);
        }
      },
      error: () => {
        if (popup) popup.close();
      }
    });
  }
}
