import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from "../components/header/header.component";
import { MarketComponent } from "../market/market.component";

import { RequestDataService } from '../reuseables/http-loader/request-data.service';
import { StoreDataService } from '../reuseables/http-loader/store-data.service';

import { MenuBottomComponent } from "../components/menu-bottom/menu-bottom.component";
import { QuickNavComponent } from "../components/quick-nav/quick-nav.component";
import { SliderComponent } from "../components/main/slider/slider.component";

import { QuickNotificationsComponent } from "../components/quick-notifications/quick-notifications.component";
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';
import { QuickNavService } from '../reuseables/services/quick-nav.service';
import { TruncateCenterPipe } from '../reuseables/pipes/truncate-center.pipe';
import { CurrencyConverterPipe } from '../reuseables/pipes/currency-converter.pipe';

import { AppDownloadManager } from '../reuseables/services/app-download-manager.service';
import { AccountSummaryComponent } from "../account-summary/account-summary.component";
import { NotificationModalComponent } from '../shared/notification-modal/notification-modal.component';

import { MatchesComponent } from "../matches/matches.component";
import { CpgComponent } from "../cpg/cpg.component";
import { reloadScript } from "../reuseables/helper";
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-main',
  imports: [
    HeaderComponent,
    MenuBottomComponent,
    CommonModule,
    QuickNotificationsComponent,
    SpinnerComponent,MarketComponent,
    TruncateCenterPipe, CurrencyConverterPipe,
    AccountSummaryComponent,
     MatchesComponent,

     QuickNavComponent,
     SliderComponent,
     CpgComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent {

  storeData = inject(StoreDataService)
  reqServerData = inject(RequestDataService)

  quickNav = inject(QuickNavService)
  appManager = inject(AppDownloadManager)

  route = inject(ActivatedRoute)

  ngOnInit(){

    reloadScript("assets/js/main.js")

    this.route.queryParams.subscribe(params => {

      const join = params['join'];

      if (join !== undefined) {

        this.quickNav.authService.open('register');
        // this.quickNav.authService.setRefCode()

      }

    });



  }

}
