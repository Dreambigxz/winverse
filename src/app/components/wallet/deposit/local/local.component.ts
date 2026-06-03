import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {  FormsModule } from '@angular/forms';
import { WalletService } from '../../../../reuseables/services/wallet.service';
import { InvoiceComponent } from './invoice/invoice.component';
import { CreatePinComponent } from '../../create-pin/create-pin.component';
import { CurrencyConverterPipe } from '../../../../reuseables/pipes/currency-converter.pipe';


@Component({
  selector: 'app-local',
  imports: [CommonModule, FormsModule, InvoiceComponent, CreatePinComponent, CurrencyConverterPipe],
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.css', "../../wallet-styles.component.css"]
})
export class LocalComponent {

  walletService = inject(WalletService);

  makeFlag(code:any){
    return `https://flagsapi.com/${code.slice(0,2)}/flat/64.png`
  }

  get locaBank(){
    return this.walletService.quickNav.storeData.get("local_banks")[0]
  }

  creeateDeposit(){

    const data  = {
      'processor':'create_deposit',
      'amount':this.walletService.localAmount,
      'method':this.walletService.selectedData.code
    }

    this.walletService.reqServerData.post('wallet/', data).subscribe((res)=>{
      this.walletService.initializeCurrency()
    })

  }

}
