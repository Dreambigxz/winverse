import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreDataService } from '../../../reuseables/http-loader/store-data.service';
import { MatchService } from '../../../reuseables/services/match.service';

import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { CurrencyConverterPipe } from '../../../reuseables/pipes/currency-converter.pipe';

@Component({
  selector: 'app-betslip',
  imports: [CommonModule,FormsModule, CurrencyConverterPipe],
  templateUrl: './betslip.component.html',
  styleUrls: ['./betslip.component.css', ]
})
export class BetslipComponent {

  storeData = inject(StoreDataService)
  matchService = inject(MatchService);
  currencyConverter_ = inject(CurrencyConverterPipe);

  possibleWin = 0

  // this.matchService.minimumStake,
  amounts = [  5, 10, 20, 50, 100];
  selectedAmount: any | null = null;


  selectAmount(value: number): void {
    this.selectedAmount = value;
    this.matchService.stakeAmount=this.currencyConverter_.transform(value)
    console.log({
      "this.matchService.stakeAmount":this.matchService.stakeAmount
    });

    this.matchService.setProfit()
  }

  get profit() {
    return 0 //(this.matchService.stakeAmount * (this.odds / 100)).toFixed(2);
  }

  get fee() {
    return (this.matchService.stakeAmount * 0.05).toFixed(2);
  }

  add(val: number) {
    this.matchService.stakeAmount += val;
  }

}
