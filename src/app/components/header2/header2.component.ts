import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrencyConverterPipe } from '../../reuseables/pipes/currency-converter.pipe';
import { StoreDataService } from '../../reuseables/http-loader/store-data.service';
// import { QuickNot ificationsComponent } from "../quick-notifications/quick-notifications.component";
import { QuickNavService } from '../../reuseables/services/quick-nav.service';

import { NotiPopupComponent } from "../../noti-popup/noti-popup.component";
import { Router, RouterLink, NavigationEnd, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-header2',
  imports: [CommonModule,CurrencyConverterPipe,NotiPopupComponent],
  templateUrl: './header2.component.html',
  styleUrl: './header2.component.css'
})
export class Header2Component {

  storeData = inject(StoreDataService)
  quickNav = inject(QuickNavService)
  router = inject(Router)


  pageName = location.pathname.replaceAll("/","")


  goBack(){this.pageName === 'confirm-payment'?this.router.navigate(['/']):window.history.go(-1)}

  ngOnInit() {
    this.segments(location.pathname.split('/'))
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.segments(event.urlAfterRedirects.split('/'))
      }
    });
  }

  segments(segments:any){

    // console.log({segments:segments.pop()});

    if (segments.includes("game-details")) {
      this.pageName="Who will win"
    }else if(segments.includes("matches")){
      this.pageName='market'
    }else if(segments.includes("bethistory")){
      this.pageName='bets'
    }else if(segments.includes("earnings")){
      this.pageName='teams'
    }else if(segments.includes("records")){
      this.pageName='Transactions'
    }else if (segments.includes('users')&&segments.includes('promotions')) {
      this.pageName='Level-'+segments.pop()
    }
    else if(segments.includes("inactive-users")){
      this.pageName='Inactive'
    }
    else if(segments.includes("my-plan")){
      this.pageName='Trade'
    }

    else{
      this.pageName=segments.pop()?.split("?")[0] || ''
    }

    if (this.pageName.includes("vip")) {
      this.pageName="Vip"
    }

    this.quickNav.storeData.set("pageName", this.pageName)

    // console.log({"pageName": this.pageName});
    // console.log({segments});


  }


}
