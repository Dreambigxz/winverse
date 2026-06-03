import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletService } from '../../../reuseables/services/wallet.service';
import { CurrencyConverterPipe } from '../../../reuseables/pipes/currency-converter.pipe';

import {  FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-withdraw-form',
  imports: [
    CommonModule,
    CurrencyConverterPipe,
    ReactiveFormsModule
  ],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.css'
})
export class WithdrawFormComponent {

  walletService = inject(WalletService);

  quickAmounts = [10, 20, 50, 100]

}
