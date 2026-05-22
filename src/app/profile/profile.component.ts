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

}
