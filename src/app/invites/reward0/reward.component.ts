import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickNavService } from '../../reuseables/services/quick-nav.service';

import { Header2Component } from "../../components/header2/header2.component";
import { SpinnerComponent } from '../../reuseables/http-loader/spinner.component';
import { CurrencyConverterPipe } from '../../reuseables/pipes/currency-converter.pipe';

@Component({
  selector: 'app-reward',
  imports: [
    CommonModule,
    Header2Component,SpinnerComponent,
    CurrencyConverterPipe
  ],
  templateUrl: './reward.component.html',
  styleUrl: './reward.component.css'
})
export class RewardComponent {

  constructor(
    public quickNav: QuickNavService
  ){}

  levels : any = [ ]
  totalDeposit = 0
  totalRewarded= 0;

  ngOnInit(){

    if (!this.quickNav.storeData.get("invite-rewards")) {
        this.quickNav.reqServerData.get('invite-rewards').subscribe((res)=>{

          console.log({res});

          this.levels = this.quickNav.storeData.get("invite-rewards").rewards
          this.totalDeposit = this.quickNav.storeData.get("invite-rewards").total_lv1_deposited
          this.totalRewarded = this.quickNav.storeData.get("invite-rewards").total_cashed
      })
    }
  }

  get currentReward() {
    const unlocked = this.levels.filter(
      (x:any) => this.totalDeposit >= x.required
    );

    return unlocked.length
      ? unlocked[unlocked.length - 1].reward
      : 0;
  }

  getProgress(required: number): number {
    const progress = (this.totalDeposit / required) * 100;
    return Math.min(progress, 100);
  }

}
