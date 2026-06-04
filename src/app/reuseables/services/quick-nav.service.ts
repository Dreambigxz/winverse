import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';


import { StoreDataService } from '../http-loader/store-data.service'; // ✅ adjust path as needed
import { FormHandlerService } from '../http-loader/form-handler.service';
import { ConfirmationDialogService } from '../modals/confirmation-dialog/confirmation-dialog.service';
import { RequestDataService } from '../http-loader/request-data.service';
import { ToastService } from '../toast/toast.service';
import { AuthService } from '../auth/auth.service';

import { copyContent } from '../helper';


@Injectable({
  providedIn: 'root'
})
export class QuickNavService {
  constructor(public router: Router) {}

  /**
   * Navigate quickly to any route.
   * @param url - Route path or full URL.
   * @param extras - Optional router navigation extras.
   */

   storeData = inject(StoreDataService)
   reqServerData = inject(RequestDataService)
   authService=inject(AuthService)
   toast=inject(ToastService)
   confirmation = inject(ConfirmationDialogService)
   emptyDataUrl = 'assets/images/empty-box.png'

   modal:any

   availableLang = {
     "English": "en",
     "French": "fr",
     "Spanish": "es",
     "Portuguese (Brazil)": "pt",
     "Arabic": "ar",
     "Chinese": "zh-CN",
     "Italian": "it",
     "Greek": "el"
   }

    langKeys = Object.keys(this.availableLang)

   go(url: string,  queryParams?: any, fragment?: string,): void {

     this.router.navigate([url], {
       queryParams,
       fragment
     });

   }


  alert(message:any,status:string='success'){
    this.toast.show({message,status})
  }

  copy(item:any, message:any="Data copied"){
    copyContent(this.toast,item,message)
  }

  openTab(url:any){

    console.log({url});

    window.open(url, '_blank')
  }

  openModal(modalName:any) {
    if (this.modal) {
      this.closeModal();
    }
    const modalEl = document.getElementById(modalName);
    if (modalEl) {
      this.modal = new (window as any).bootstrap.Modal(modalEl);
      this.modal.show();
    }
  }
  closeModal(){
    this.modal.hide()
  }

  reload(url:string){

    // console.log('reloading>>', {url});

    this.reqServerData.get(url+'/?showSpinner').subscribe()

  }

  changeLanguage(event: any) {

    const lang = event.target.value;
    const langVals = Object.values(this.availableLang)
    let indexSelected = this.langKeys.indexOf(lang)

    const interval = setInterval(() => {

      const select:any = document.querySelector('.goog-te-combo');

      if (select) {

        select.value = langVals[indexSelected];
        select.dispatchEvent(new Event('change'));

        clearInterval(interval);
      }

    }, 500);
  }

  generatePassword(length: number = 12): string {

    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~';

    const allChars = upper + lower + numbers + symbols;

    let password = '';

    for (let i = 0; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    return password;
  }

  getDateRange() {
    const now = new Date();

    const currentDate = new Date(now);

    const firstNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    return {
      currentDate,
      firstNextMonth
    };
  }

  checkIn(){

    if (!this.storeData.store['checked_in']&&this.authService.isLoggedIn) {

      this.reqServerData.get("dashboard?check_in=check_in")
      .subscribe((res)=>{
        console.log({res});

      })
    }
  }
}
