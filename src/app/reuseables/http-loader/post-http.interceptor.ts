import { HttpInterceptorFn, HttpResponse, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, tap, timeout, TimeoutError } from 'rxjs';

import { LoaderService } from './loader.service';
import { StoreDataService } from './store-data.service';
import { StatusDialogComponent } from '../status-dialog/status-dialog.component';
import { ToastService } from '../toast/toast.service';
import { AuthService } from '../auth/auth.service';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogService } from '../modals/confirmation-dialog/confirmation-dialog.service';
import { Router } from '@angular/router';

function  isIOS(): boolean {
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
}

export const PostHttpInterceptor: HttpInterceptorFn = (req, next) => {

  const loaderService = inject(LoaderService);
  const storeData = inject(StoreDataService);
  const dialog = inject(MatDialog);
  const toast = inject(ToastService);
  const reqConfirmation = inject(ConfirmationDialogService);
  const router = inject(Router);
  const authService = inject(AuthService);

  // 🔑 Ensure we always check login before sending
  authService.checkLogin();

  // Add token header if logged in
  let headers = req.headers || new HttpHeaders();
  if (authService.isLoggedIn && authService.token) {
    headers = headers.set('Authorization', `Token ${authService.token}`);
  }

  // Clone request with updated headers
  req = req.clone({ headers });

  const ua = window.navigator.userAgent;
  const isSafari =
    ua.includes('Safari') &&
    !ua.includes('Chrome') &&
    !ua.includes('CriOS') &&
    !ua.includes('Android') &&
    !ua.includes('Edg');

  const isPost = req.method === 'POST';
  const isGet  =  req.method === 'GET'

  if (!req.url.includes('hideSpinner')&&isGet||isIOS()||req.url.includes("upload/")||isSafari) {
    !req.url.includes('hideSpinnerimportant')&&!req.url.includes("coingecko")?loaderService.show():0;
  }

  if (isPost) {
    const activeBtn = document.activeElement as HTMLElement;
    loaderService.setLoadingButton(activeBtn);
  }

  return next(req).pipe(
    timeout(39000), // ⏱ 15 seconds timeout

    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          let body;

          if (event.body && typeof event.body === 'object' && !Array.isArray(event.body)) {
            body = event.body as { message?: string; status?: string; main?: Object; next_page?: any };

            body.status ? toast.show(body) : 0;
            body.main ? storeData.setMultiple(body.main) : 0;

            if (body.next_page) {
              const next_page = body.next_page;
              if (body.next_page.confirm_redirect) {
                reqConfirmation?.confirmAction(
                  (next_: any = next_page) => {
                    router.navigate(
                      [next_.url],
                      {
                        fragment: next_.focus
                      }
                    );
                  },
                  next_page.title,
                  next_page.message
                );
              }else{
                router.navigate(
                  [next_page.url],
                  {
                    fragment:next_page.focus
                  }
                )
              }
            }

            const wallet = storeData.get("wallet")
            console.log(body.main);

            if (wallet){
              if(!wallet?.hasPin||!wallet.saved_add) {
                if (!["/setup"].includes(window.location.pathname)) {
                  // window.location.href = '/setup'
                  router.navigate(['/setup'])
                }
              }
              authService.isVisible=false
            }

          }
        }
      },

      error: (err) => {

        // ⏱ Timeout handling
        if (err instanceof TimeoutError) {
          dialog.open(StatusDialogComponent, {
            data: {
              title: 'Request Timeout',
              message: 'Server is taking too long to respond. Please try again.',
              status: 'error'
            }
          });
          return;
        }

        if (err.status === 401 || err.statusText === 'Unauthorized') {
          authService.logout(true);
        } else {
          !req.url.includes('hideSpinner') ? dialog.open(StatusDialogComponent, {
            data: {
              title: 'Error',
              message: 'Request timeout, check internet connection and reload page!',
              status: 'error'
            }
          }) : 0;
        }
      }
    }),

    finalize(() => {
      loaderService.setLoadingButton(null);
      !req.url.includes('hideSpinner') ? loaderService.hide() : 0;
    })
  );
};
