import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';

import { CurrencyConverterPipe } from '../reuseables/pipes/currency-converter.pipe';
import { Header2Component } from "../components/header2/header2.component";
import { MenuBottomComponent } from "../components/menu-bottom/menu-bottom.component";

import { QuickNavService } from '../reuseables/services/quick-nav.service';

import { FormHandlerService } from '../reuseables/http-loader/form-handler.service';

import { ReactiveFormsModule, FormBuilder, Validators , FormsModule} from '@angular/forms';

import { AppDownloadManager } from '../reuseables/services/app-download-manager.service';
import { AccountSummaryComponent } from "../account-summary/account-summary.component";
import { TelegramService } from "../reuseables/services/telegram-binder.service";


@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,CurrencyConverterPipe,
    SpinnerComponent,Header2Component,
    FormsModule, ReactiveFormsModule,
    MenuBottomComponent, AccountSummaryComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent {

  quickNav = inject(QuickNavService)
  appManager= inject(AppDownloadManager)
  telegramService = inject(TelegramService)

  formHandler = inject(FormHandlerService);
  fb = inject(FormBuilder);

  form = this.fb.group({
    'old-password': ['', [Validators.required]],
      'new-password': ['', [Validators.required]],
  })

  modal:any
  voucherCount = 3
  notificationCount=3

  ngOnInit(){
    if (!this.quickNav.storeData.get('profile')) {
      this.quickNav.reqServerData.get("profile/")
      .subscribe()
    }

    document.addEventListener("visibilitychange", this.handleVisibilityChange);
}

  openModal() {
    const modalEl = document.getElementById('changePassword');
    if (modalEl) {
      this.modal = new (window as any).bootstrap.Modal(modalEl);
      this.modal.show();
    }
  }

  onSubmit(){

    if (!this.form.valid)return;

      this.modal.hide()
     this.formHandler.submitForm(this.form,'changePassword', 'change-password/?showSpinner', true, (res) => {
      if (res.status==='success') {
        this.quickNav.authService.logout()
      }
    });
  }

  handleVisibilityChange = () => {

    // console.log(this.quickNav?.storeData.store);

    if (this.quickNav?.storeData?.get('skippedTgBind') || this.quickNav.storeData.get("bindedTg") ) return;

    if (!document.hidden) {

      this.quickNav?.reqServerData.get('check-if-binded')
      .subscribe((res)=>{
        // if (res.main.bindedTg) {}

      })


    }

  };

}
