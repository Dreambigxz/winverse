import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { inject } from '@angular/core';

import { StoreDataService } from '../http-loader/store-data.service'; // ✅ adjust path as needed
import { FormHandlerService } from '../http-loader/form-handler.service';
import { ConfirmationDialogService } from '../modals/confirmation-dialog/confirmation-dialog.service';
import { RequestDataService } from '../http-loader/request-data.service';
import { ToastService } from '../toast/toast.service';

import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Router, NavigationEnd,NavigationStart,ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { QuickNavService } from '../services/quick-nav.service';
import { CurrencyConverterPipe } from '../pipes/currency-converter.pipe';


import {  copyContent} from '../helper';

// export type PaymentChannel = 'USD' | 'USDT' | 'TRON' | 'BANK';
export type PaymentChannelGrp = 'local'|'crypto'
type FormPageGroup = 'deposit'|'withdraw'  | 'set_new_pin'
type CryptoKey = 'USD' | 'TRON' | "BNB";

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  // Hold current payment method
  private paymentMethod$ = new BehaviorSubject<PaymentChannelGrp>('local');
  private reqConfirmation = inject(ConfirmationDialogService);
  private currencyConverter = inject(CurrencyConverterPipe);

  reqServerData = inject(RequestDataService);
  storeData = inject(StoreDataService);

  fb = inject(FormBuilder);
  toast = inject(ToastService)
  quickNav = inject(QuickNavService)

  private formHandler = inject(FormHandlerService);

  page : any = "deposit"

  withdraw_options :any= []

  formView: Record<PaymentChannelGrp, any> = {
    'crypto':{


      withdraw: this.fb.group({
          amount: ['', [Validators.required, Validators.min(1)]],

          origin: [""],

          withdraw_option: [''],

          saved_method_id: [''],

          payment_method: [""]
      }),

      payment_info:this.fb.group({
        account_number: ['', [Validators.required]],
        pin: ['', [Validators.required]],

      }),
      step:1
    },

    'local':{
      'withdraw':this.fb.group({
        amount: ['', [Validators.required, Validators.min]],
        origin:[""],
        withdraw_option: [''],
        saved_method_id: [''],
        payment_method:[""]

      }),

      'payment_info':this.fb.group({
        account_number: ['', [Validators.required]],
        account_holder: ['', [Validators.required]],
        bank: ['', [Validators.required]],
        pin: ['', [Validators.required]],
      }),

      step:1

    },
  }

  updateWithdrawalOptionsValidator(form:any) {

    const control = form.get('withdraw_option')
      control?.setValidators([Validators.required]);
  }

  updateWithdrawalOptionsSelector(){

    if (this.page  !== 'withdraw'  || !this.quickNav.storeData.get("is_agent"))return

    const Ref = this.storeData.get('ref_')
    const Bet = this.storeData.get("bet_")
    const Bal = this.storeData.get('wallet')?.balance?.new || 0

    let sec_won = Bet?.records?.true || 0
    let total_bet_profit = sec_won?.won?.won_amount || 0
    let total_bet_withd = Bet?.withdrawn || 0

    const bet_bal = total_bet_profit - total_bet_withd

    // ref
    let comm_cashed = Ref?.cashed_commissions || 0
    let total_comm_withd = Ref?.withdrawn || 0

    const team_bal = comm_cashed - total_comm_withd

    const main_bal = Bal - bet_bal  - team_bal

    this.withdraw_options =  [
      ['withdraw_from_bet_balance',"Bet balance "+this.currencyConverter.transform(bet_bal)],
      ['withdraw_from_team_balance',"Team balance "+this.currencyConverter.transform(team_bal)],
      ["withdraw_from_balance","Main Balance "+this.currencyConverter.transform(main_bal)],
    ]

  }

  cryptos = [
    { value: 'USD', label: 'USDT (TRC20)', img: 'assets/img/card/usdt.svg' },
    { value: 'TRON', label: 'TRON', img: 'assets/img/card/tron.png' },
    { value: 'BNB', label: 'BNB (BEP20)', img: 'assets/img/card/bnb.png' }
  ];
  cryptoMap: Record<CryptoKey, { value: string; label: string; img: string }> = {
    USD: { value: 'USD', label: 'USDT (TRC20)', img: 'assets/img/card/usdt.svg' },
    TRON: { value: 'TRON', label: 'TRON', img: 'assets/img/card/tron.png' },
    BNB: { value: 'BNB', label: 'BNB', img: 'assets/img/card/bnb.png' }
  };

  getCryptoLabel(code: string, value:any=null): string {
    return this.cryptoMap[code as keyof typeof this.cryptoMap]?.label || '';
  }

  cryptoCoins = ["TRON", "USD", "USDT", "BNB"]

  activeChannel$ = new BehaviorSubject<'crypto' | 'local'>('crypto');
  activeChannelObs$ = this.activeChannel$.asObservable();

  selectedNetwork = 'BEP20';

  selectedLocaLMethod: any
  selectedCryptoMethod : any = "USD"

  selectedData :any
  editingAddress = false

  // amounts>><<<
  localAmount : any

  showCryptoTab = true;
  showLocalTab = true;

  payAddress = ""

  constructor(private router: Router,  private route :ActivatedRoute) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (!event.urlAfterRedirects.includes('records')) {
          this.page = this.route.snapshot.queryParamMap.get('page')
        }
      });
  }

  selectNetwork(network: string) {
    this.selectedNetwork = network;
  }

  // DISPLAY ALL LOCAL CURRENCY OR JUST SELECTED
  getVisibleCurrencies(slice:any=[3]) {

    const isCryptoSelect = slice.length === 1
    const currencies = this.quickNav.storeData.store['init_currencies']?.slice(...slice);

    // console.log({currencies});

    if (!this.selectedLocaLMethod) {
      return currencies; // show all before selection
    }

     this.selectedData =  currencies.filter(
      (curr:any) => curr.code === this.selectedLocaLMethod
    )[0];

    this.minimumPayment

    return [this.selectedData]

  }

  getVisibleCrptoNetwork(slice:any=[0, 3]) {

    const isCryptoSelect = slice.length === 1
    const currencies = this.quickNav.storeData.store['init_currencies']?.slice(...slice);

     this.selectedData =  currencies.filter(
      (curr:any) => curr.code === this.selectedCryptoMethod
     )[0];


    if (this.selectedData.code==='BNB') {
      this.payAddress=this.storeData.get("pay_address")?.bnb
    }else{
      this.payAddress=this.storeData.get("pay_address")?.tether
    }

    return currencies//[this.selectedData]

  }

  get minimumPayment(){

    const code  = this.selectedData.code
    const index_by =  'minimum_'+this.page
    const settings = this.storeData.get('wallet').settings

    // console.log({index_by, settings}, this.selectedData);

    let minimum;
    if (code==='TRON') {
      minimum =this.convertUsdToTrx(settings[index_by] ,this.selectedData.rate)
    }else{
      minimum =settings[index_by] * this.selectedData.rate
    }
    // console.log({minimum,code, index_by});

    return minimum

  }

  setSelectedCurrency(code:string){

    let[getSelectedData,minimumPayment] = [this.storeData.get('wallet').init_currencies.filter((c:any)=>c.code===code),0]

    console.log({getSelectedData});

    if (getSelectedData) {
      // selectedCurrency=getSelectedData
      if (code==='TRON') {
        minimumPayment=this.convertUsdToTrx(this.storeData.get('wallet').settings['minimum_'+this.page] ,getSelectedData.rate)
      }else{
        minimumPayment=this.storeData.get('wallet').settings['minimum_'+this.page] * getSelectedData.rate
      }
    }

    return  {getSelectedData,minimumPayment}
    // else{
    //   this.selectedCurrency="";
    //   this.minimumPayment=0
    // }
    // console.log({initialized_currency:this.initialized_currency});
    // console.log({selectedCurrency:this.selectedCurrency});

  }

  convertUsdToTrx(usd: number, rate: number = 0.322407): number {
    return +(usd / rate).toFixed(2);
  }

  cancelPayment(type:any, callback:any=null){

    this.reqConfirmation.confirmAction(()=>{
      this.reqServerData.get(`wallet?dir=delete_${type}&showSpinner`).subscribe({
        next:(res)=>{
          this.initializeCurrency();
          this.updateWithdrawalOptionsSelector();
        }
      })
    }, 'Cancel', `remove ${type} ?` )
  }

  initializeCurrency(){

    const  wallet = this.storeData.get('wallet')
    const payment =  this.storeData.get(this.page)[0]

    let  payment_method  = wallet.payment_method
    if (!payment_method&&payment) {
      payment_method = payment.method
    }

    if (payment_method) {

      const isCrypto = this.cryptoCoins.includes(payment_method);

      this.setActiveChannel(isCrypto ? 'crypto' : 'local');

      // Hide the other tab
      this.showCryptoTab = isCrypto;
      this.showLocalTab = !isCrypto;

      // this.setSelectedCurrency(payment_method)
      !isCrypto?this.selectedLocaLMethod = payment_method:0;
    }else{
      this.showCryptoTab = true;
      this.showLocalTab = true;
    }


  }

  setActiveChannel(channel: 'crypto' | 'local') {
    this.activeChannel$.next(channel);
  }

  get activeChannel() {

    const active_channel = this.activeChannel$.value
    if (this.page==='withdraw'&&this.quickNav.storeData.get("is_agent")) {
      this.updateWithdrawalOptionsValidator(this.formView[active_channel].withdraw)
    }
    return active_channel;
  }

  handleSubmit(form:any,processor:any){


    form.patchValue({ payment_method: this.selectedData.code });
    form.patchValue({ origin: window.location.origin });

    this.formHandler.submitForm(form, processor, 'wallet/?showSpinner', true,  (res) => {
        this.editingAddress=false
        if (res.status === 'success' ) {
          this.updateWithdrawalOptionsSelector()
        }

        console.log({processor});


        setTimeout(() => {

          const deposit =  this.storeData.get('deposit')
          console.log({processor});

          if (deposit?.extraField?.get("payInfo")&&processor==='create_deposit') {
            this.quickNav.openTab(deposit?.extraField.get("payInfo"))
          }
        }, 300);
        // if (res.redirect) {
        //   this.quickNav.go(res.redirect)
        // }
    })
  }



}
