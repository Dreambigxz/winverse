import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { Header2Component } from "../components/header2/header2.component";
// import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';

import { WalletService } from '../reuseables/services/wallet.service';
import { TruncateCenterPipe } from '../reuseables/pipes/truncate-center.pipe';

// import { DepositComponent } from "./deposit/deposit.component";
// import { WithdrawComponent } from "./withdraw/withdraw.component";
// import { TransactionComponent } from "./transaction/transaction.component";

@Component({
  selector: 'app-wallet',
  imports: [
    CommonModule,
    TruncateCenterPipe
  ],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent {

  walletService = inject(WalletService)


}
