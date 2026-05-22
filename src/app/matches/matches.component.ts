import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatchService } from '../reuseables/services/match.service';
import { CurrencyConverterPipe } from '../reuseables/pipes/currency-converter.pipe';
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';
import { Header2Component } from "../components/header2/header2.component";
import { MenuBottomComponent } from "../components/menu-bottom/menu-bottom.component";

import { TimeFormatPipe } from '../reuseables/pipes/time-format.pipe';
import { CountdownPipe } from '../reuseables/pipes/countdown.pipe';
import { TruncateCenterPipe } from '../reuseables/pipes/truncate-center.pipe';

import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { ReactiveFormsModule,FormsModule, FormBuilder } from '@angular/forms';
import { QuickNotificationsComponent } from "../components/quick-notifications/quick-notifications.component";
import { filter } from 'rxjs/operators';

import { AuthService } from '../reuseables/auth/auth.service';

@Component({
  selector: 'app-matches',
  imports: [
    CommonModule,CurrencyConverterPipe,
    SpinnerComponent,Header2Component, MenuBottomComponent,
    TimeFormatPipe,TruncateCenterPipe,FormsModule,CountdownPipe,
    QuickNotificationsComponent
  ],
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent {

  matchService = inject(MatchService);
  router = inject(Router);

  notStarted:any=[]

  location = window.location

  circumference = 2 * Math.PI * 52;
  totalWindow = 1800; // 30 mins

  mode: 'safe' | 'risk' = 'risk';
  signal = {
    'safe':"🟢",
    "risk": "🔥"
  }
  index_by: "notStartedMatches" | "CPG" = 'notStartedMatches'

  slice = 10

  toggleMode() {
    this.mode = this.mode === 'safe' ? 'risk' : 'safe';
    this.index_by = this.mode === 'safe'? 'CPG':"notStartedMatches"

  }

  ngOnInit(): void {


    this.getSoccer()
    this.router.events.pipe(filter((event:any) => event instanceof NavigationEnd)).subscribe((event: any) => {
      if (event.urlAfterRedirects==='/'||event.urlAfterRedirects==='/matches') {
        this.getSoccer()
      }
    });
  }

  getSoccer(){
    if (!localStorage.getItem("token")) {this.router.navigate(['login']); return}
    if (!this.matchService.storeData.get('soccer')) {
      this.matchService.reqServerData.get('soccer/?showSpinner').subscribe({
        next: (res) => {
          this.setData()}
      });
    }else{this.setData()}
  }

  async setData(){

    this.matchService.setFixtures()
    this.matchService.notStarted(this.matchService.storeData.store['soccer']);
    this.matchService.loadBonusMatches()
    await this.matchService.companyGame()


    if (this.location.pathname==='/matches') {
      this.slice=this.matchService.notStartedMatches.length
      this.mode='risk';
      this.index_by = 'notStartedMatches'
    }else{
      if (this.matchService.CPG.length) {
        this.mode='safe';
        this.index_by = 'CPG'

      }
    }
  }

  getDashOffset(remaining: any): number {

    // only animate last 30 mins
    const active = Math.min(remaining, this.totalWindow);

    const progress = active / this.totalWindow;

    return this.circumference - (progress * this.circumference);
  }

  formatTime(seconds: any): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    // if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    // }

    // return `${m}:${s.toString().padStart(2, '0')}`;
  }


}
