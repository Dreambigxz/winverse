import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {  FormsModule } from '@angular/forms';
import { WalletService } from '../../../../reuseables/services/wallet.service';
import { TruncateCenterPipe } from '../../../../reuseables/pipes/truncate-center.pipe';
import { CreatePinComponent } from '../../create-pin/create-pin.component';

@Component({
  selector: 'app-crypto',
  imports: [
    CommonModule, FormsModule,
    TruncateCenterPipe,CreatePinComponent

  ],
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.css']
  // styleUrls: ["../../crypto-style.component.css"]
})
export class CryptoComponent {

  walletService = inject(WalletService);

  get payAddress(){

    return this.walletService.storeData.get('pay_address')
  }

}
