import { Injectable } from '@angular/core';
import { StoreDataService } from '../reuseables/http-loader/store-data.service'; // ✅ adjust path as needed
import { QuickNavService } from '../reuseables/services/quick-nav.service';

import { Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InviteServices {

  constructor(
    public storeData: StoreDataService,
    public quickNav: QuickNavService
  ) {}

  page: string = 'commissions';
  level: string = 'all';
  users : any = [ ]

  pending_users = false
  main = "referral"

  activePercent:any
  activeText:any



  loadUser(generation: any, main:any) {

    this.main = main
    this.level = generation

    const key = 'promotionLevel_' + generation;


    const cont = ()=>{
      const data = this.quickNav.storeData.get(key) || [ ];
      const filterd_data =  generation !== "pending" ? data.filter((item: any) => item.type === main) : data;

      // ✅ return ONLY the selected type (no mutation)
      this.users =  filterd_data

    }

    if (!this.quickNav.storeData.get(key)) {

      this.quickNav.reqServerData
        .get('promotions/?level=' + generation)
        .subscribe(()=>cont());
    }else{
      cont()
    }



  }

  get nextCashoutDate() {

    return this.nextCashDate()

  }

  nextCashDate(targetDay: number = 2): Date {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday ... 6 = Saturday

    let daysUntil = (targetDay - currentDay + 7) % 7;

    // If target day is today, move to next week
    if (daysUntil === 0) daysUntil = 7;

    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + daysUntil);
    nextDate.setHours(0, 0, 0, 0);

    return nextDate;
  }

  countdown(target: Date): Observable<string> {
    return interval(1000).pipe(
      startWith(0),
      map(() => {
        const now = new Date().getTime();
        const diff = target.getTime() - now;

        if (diff <= 0) return "0d 0h 0m 0s";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
      })
    );
  }

  nextCashCountdown$ = this.countdown(this.nextCashDate());

  get totalFrozenReferral(): number {

      const ref = this.storeData.get('refDir')?.referral
      return (
        (ref?.generation_1?.frozen || 0) +
        (ref?.generation_2?.frozen || 0) +
        (ref?.generation_3?.frozen || 0)
      );

  }

  get totalFrozenRebate(): number {

      const reb = this.storeData.get('refDir')?.rebate

      return reb?.generation_1?.frozen || 0

  }


}
