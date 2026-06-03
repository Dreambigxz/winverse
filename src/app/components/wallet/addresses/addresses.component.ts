import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletService } from '../../../reuseables/services/wallet.service';

import {  FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-addresses',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css'
})
export class AddressesComponent {

  walletService = inject(WalletService);

}
