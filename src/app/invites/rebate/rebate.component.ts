import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerComponent } from '../../reuseables/http-loader/spinner.component';
import { Header2Component } from "../../components/header2/header2.component";
import { CurrencyConverterPipe } from '../../reuseables/pipes/currency-converter.pipe';

import { QuickNavService } from '../../reuseables/services/quick-nav.service';

import { MenuBottomComponent } from "../../components/menu-bottom/menu-bottom.component";
import { InviteServices } from "../invite.service";

@Component({
  selector: 'app-rebate',
  imports: [
    CommonModule,
    Header2Component,
    SpinnerComponent,
    CurrencyConverterPipe
  ],
  templateUrl: './rebate.component.html',
  styleUrl: '../styles.css'
})
export class RebateComponent {

  quickNav = inject(QuickNavService)
  inviteService = inject(InviteServices)

  gen_ = [1,2,3]

  title_head = [
    1,
    "Direct Referrals",
    "Network Referrals",
    "Extended Network"
  ]


  ngOnInit(){
      if (!this.quickNav.storeData.get('refDir')) {this.quickNav.reqServerData.get("promotions/").subscribe(
        (res)=>{

          console.log({res});


        }
      )}

  }


}
