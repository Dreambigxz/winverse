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

  get calculateTabData() {

    if (this.main==='rebate') {
      this.activeText='continuous'
    }else{
      this.activeText='one time'
    }

    const ref = this.storeData.store['refDir'];
    const active = ref.active
    const total = ref.active
    const page = this.page;
    const level = this.level;

    const percentages = ref.settings.percent

    const data = {
      amount: 0,
      count: 0,
      total: 0,
      frozen:0,
      active: 0,
      deposit: { amount: 0, count: 0 },
      withdraw: { amount: 0, count: 0 },
      // users: [ ]
    };

    if(this.main==='rebate'&&this.page==='transactions'){
      this.page='commissions'
    }

    const getGen = (key: string, gen: number, update_data:any=data) => {

      const res =  ref?.[key]?.[`generation_${gen}`] || { count: 0, amount: 0 , frozen: 0};

      update_data.amount += res.amount || 0 //ref.total[`generation_${gen}`]
      update_data.count += res.count || 0  //ref.active[`generation_${gen}`]
      update_data.frozen += res.frozen || 0
      return res
    };

    const sumGen = (key: string, target: any) => {
      for (let g = 1; g <= 3; g++) {
        const d = getGen(key, g,target);
      }
    };

    const gen = parseInt(level.replace('level', '')) || 1;

    /* COMMISSIONS */
    if (page === 'commissions') {

      if (level === 'all') {
        sumGen(this.main,data);

        this.activePercent = percentages[this.main]
      } else {
        const r = getGen(this.main, gen);

        this.activePercent = percentages[this.main][gen-1]
      }
    }

    /* TRANSACTIONS */
    if (page === 'transactions') {

      if (level === 'all') {
        sumGen('deposit', data.deposit);
        sumGen('withdraw', data.withdraw);
      } else {
        Object.assign(data.deposit, getGen('deposit', gen, data.deposit));
        Object.assign(data.withdraw, getGen('withdraw', gen,data.withdraw));
      }
    }

    /* USERS */
    if (page === 'users') {

      if (this.level.includes('pending')){
        this.users = this.loadUser(this.level)
      }else{
        this.users = this.loadUser(gen)
      }

    }

    return data;
  }

  loadUser(generation: any) {

    const key = 'promotionLevel_' + generation;

    if (!this.quickNav.storeData.get(key)) {

      this.quickNav.reqServerData
        .get('promotions/?level=' + generation)
        .subscribe();
    }

    const data = this.quickNav.storeData.get(key) || [ ];
    const filterd_data =  generation !== "pending" ? data.filter((item: any) => item.type === this.main) : data;

    // ✅ return ONLY the selected type (no mutation)
    return filterd_data
  }

}
