import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Header2Component } from "../../components/header2/header2.component";
import { SpinnerComponent } from '../../reuseables/http-loader/spinner.component';

import { CurrencyConverterPipe } from '../../reuseables/pipes/currency-converter.pipe';

import { WalletService } from '../../reuseables/services/wallet.service';
import { QuickNavService } from '../../reuseables/services/quick-nav.service';
import { CreatePinComponent } from '../../components/wallet/create-pin/create-pin.component';
import { AddressesComponent } from '../../components/wallet/addresses/addresses.component';


@Component({
  selector: 'app-setup',
  imports: [
    CommonModule,
    Header2Component,
    SpinnerComponent,
    CreatePinComponent,
    AddressesComponent
  ],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css'
})
export class SetupComponent {

  quickNav = inject(QuickNavService)
  walletService = inject(WalletService);


  selectedMethod = 'crypto'
  selectedSubMethod = 'usdt_trc20'

  ngOnInit(){

    if (!this.quickNav.storeData.get("wallet")) {
      this.quickNav.reqServerData.get('wallet?dir=start_deposit').subscribe((res)=>{

        // this.walletService.saved_add = this.quickNav.storeData.get('wallet')?.saved_add?.[0]
        //
        // console.log({saved_add:this.walletService.saved_add});
        this.walletService.initializeCurrency()

        console.log({saved_add:this.walletService.saved_add});



    })}

  }
}
