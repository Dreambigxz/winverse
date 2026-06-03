import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Header2Component } from "../../components/header2/header2.component";
import { SpinnerComponent } from '../../reuseables/http-loader/spinner.component';

import { CurrencyConverterPipe } from '../../reuseables/pipes/currency-converter.pipe';

import { FormHandlerService } from '../../reuseables/http-loader/form-handler.service';
import { QRCodeComponent } from 'angularx-qrcode';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { WalletService } from '../../reuseables/services/wallet.service';
import { QuickNavService } from '../../reuseables/services/quick-nav.service';

// import { CryptoComponent } from "../../components/wallet/withdraw/crypto/crypto.component";
import { WithdrawFormComponent } from "../../components/wallet/withdraw/withdraw.component";
import { InvoiceComponent } from "../../components/wallet/invoice/invoice.component";
import { WalletComponent } from "../wallet.component";


@Component({
  selector: 'app-withdraw',
  imports: [
      CommonModule,FormsModule,
      ReactiveFormsModule,CurrencyConverterPipe,
      Header2Component, SpinnerComponent,
      WalletComponent, WithdrawFormComponent,
      InvoiceComponent
    ],
  templateUrl: './withdraw.component.html',
  // styleUrl:  "../wallet-styles.component.css"
  styleUrls: ['./withdraw.component.css', "../wallet-styles.component.css"]
})
export class WithdrawComponent {

  formHandler = inject(FormHandlerService)
  walletService = inject(WalletService);
  quickNav = inject(QuickNavService)

  ngOnInit(){

      this.walletService.page = 'withdraw'
      this.quickNav.storeData.store['pageDetails']='wallet'
      if (!this.quickNav.storeData.get('withdraw')) {
        this.quickNav.reqServerData.get('wallet?dir=start_withdraw').subscribe((res)=>{

          console.log({res});

          this.walletService.initializeCurrency()
          this.walletService.updateWithdrawalOptionsSelector()

      })}
  }

}
