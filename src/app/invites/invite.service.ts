import { Injectable } from '@angular/core';
import { StoreDataService } from '../reuseables/http-loader/store-data.service'; // ✅ adjust path as needed
import { QuickNavService } from '../reuseables/services/quick-nav.service';

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

}
