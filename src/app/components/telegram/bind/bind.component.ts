import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header2Component } from "../../header2/header2.component";
import { SpinnerComponent } from '../../../reuseables/http-loader/spinner.component';

import { TelegramService } from "../../../reuseables/services/telegram-binder.service";
import { QuickNavService } from '../../../reuseables/services/quick-nav.service';

@Component({
  selector: 'app-bind',
  imports: [
    CommonModule,
    Header2Component,
    SpinnerComponent
  ],
  templateUrl: './bind.component.html',
  styleUrl: './bind.component.css'
})
export class BindComponent {

  telegramService = inject(TelegramService)
  quickNav = inject(QuickNavService)

  bonus = 0.04

  ngOnInit() {

    if (!this.quickNav.storeData.get("bindedTg")) {
      this.quickNav.reqServerData.get("dashboard")
      .subscribe(()=>{
        document.addEventListener("visibilitychange", this.handleVisibilityChange);

      })
    }else{
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
    }


  }


  handleVisibilityChange = () =>{

    if (this.quickNav?.storeData?.get('skippedTgBind') || this.quickNav?.storeData?.get("bindedTg") ) return;
    
    if (!document.hidden) {

      this.quickNav.reqServerData.get('check-if-binded')
      .subscribe((res)=>{
        // if (res.main.bindedTg) {}

      })


    }

  };

  skipConnection(){
    this.quickNav.reqServerData.get("dashboard?skippedTgBind=true&showSpinner")
    .subscribe(()=>this.quickNav.router.navigate(['/']))
  }


}
