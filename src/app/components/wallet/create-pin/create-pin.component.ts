import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletService } from '../../../reuseables/services/wallet.service';

import {  FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-create-pin',
  imports: [CommonModule,FormsModule],
  templateUrl: './create-pin.component.html',
  styleUrl: './create-pin.component.css'
})
export class CreatePinComponent {

  walletService = inject(WalletService);
  transactionPin:any

  createPin(){

    const data  = {
      processor:"create_pin",
      pin:this.transactionPin,
    }

    this.walletService.reqServerData.post('wallet/', data).subscribe()
  }

}
