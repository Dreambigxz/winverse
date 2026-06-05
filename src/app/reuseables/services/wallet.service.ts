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
export type PaymentChannelGrp = 'local'|'crypto'| "withdraw"
type FormPageGroup = 'deposit'|'withdraw'  | 'set_new_pin'
type CryptoKey = 'USD' | 'TRON' | "BNB";

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  // Hold current payment method
  private paymentMethod$ = new BehaviorSubject<PaymentChannelGrp>('local');
  private reqConfirmation = inject(ConfirmationDialogService);
  public currencyConverter = inject(CurrencyConverterPipe);

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
        payment_method: [""]

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

        payment_method: [""]
      }),

      step:1

    },

    withdraw: this.fb.group({
        amount: ['', [Validators.required]],

        origin: [""],

        withdraw_option: [''],

        saved_method_id: [''],

        payment_method: [""]
    }),

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
    { value: 'BNB', label: 'BNB NETWORK', img: 'assets/img/card/bnb.png' },

    { value: 'TRON', label: 'TRON', img: 'assets/img/card/tron.png' },
  ];
  cryptoMap: Record <CryptoKey, any> = {
    USD: { value: 'USD', label: 'TRC20', img: 'assets/img/card/usdt.svg',  },
    TRON: { value: 'TRON', label: 'TRON', img: 'assets/img/card/tron.png', },
    BNB: { value: 'BNB', label: 'BNB', img: 'assets/img/card/bnb.png' }
  };

  getCrypto(code: CryptoKey) {
    return this.cryptoMap[code];
  }

  cryptoCoins = ["TRON", "USD", "USDT", "BNB"]

  activeChannel$ = new BehaviorSubject<'crypto' | 'local'>('crypto');
  activeChannelObs$ = this.activeChannel$.asObservable();

  selectedNetwork = 'BEP20';

  selectedLocaLMethod: any
  selectedCryptoMethod : any = "USD"

  initCryptoMethod : any

  selectedData :any
  editingAddress = false

  // amounts>><<<
  localAmount : any

  showCryptoTab = true;
  showLocalTab = true;

  payAddress = ""
  saved_add :any

  quickAmounts = [10, 20, 50, 100]
  amountInUSD:number=0

  constructor(private router: Router,  private route :ActivatedRoute) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (!event.urlAfterRedirects.includes('records')) {
          this.page = this.route.snapshot.queryParamMap.get('page')
        }
      });
  }

  get Page(){
    return window.location.pathname.replace("/", "")
  }

  selectNetwork(network: string) {
    this.selectedNetwork = network;
  }

  // DISPLAY ALL LOCAL CURRENCY OR JUST SELECTED
  get getVisibleCurrencies() {

    let slice = [2]
    const isCryptoSelect = slice.length === 1
    const currencies = this.quickNav.storeData.store['init_currencies']?.slice(...slice);

    if (!this.selectedLocaLMethod) {
      return currencies; // show all before selection
    }

     this.selectedData =  currencies.filter(
      (curr:any) => curr.code === this.selectedLocaLMethod
    )[0];

    this.minimumPayment

    return [this.selectedData]

  }

  get getVisibleCrptoNetwork() {

    let slice =[0, 2]

    const isCryptoSelect = slice.length === 1
    const currencies = this.quickNav.storeData.store['init_currencies']?.slice(...slice);

     this.selectedData =  currencies?.filter(
      (curr:any) => curr.code === this.selectedCryptoMethod
     )[0];


    if (this.selectedData?.code==='BNB') {
      this.payAddress=this.storeData.get("pay_address")?.bnb
    }else{
      this.payAddress=this.storeData.get("pay_address")?.tether
    }


    //
    // if (this.initCryptoMethod) {
    //   return [this.selectedData]
    // }


    return currencies//[this.selectedData]

  }

  get minimumPayment(){

    const code  = this.selectedData?.code
    const index_by =  'minimum_'+this.Page
    const settings = this.storeData.get('wallet')?.settings


    let minimum;
    if (code==='TRON') {
      minimum =this.convertUsdToTrx(settings[index_by] ,this.selectedData.rate)
    }else{
      minimum =settings[index_by] * this.selectedData?.rate
    }

    return minimum

  }

  setSelectedCurrency(code:string){

    let[getSelectedData,minimumPayment] = [this.storeData.get('wallet').init_currencies.filter((c:any)=>c.code===code),0]

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
    const payment =  (this.storeData.get(this.page)?.[0])

    let  payment_method  = wallet.payment_method
    if (!payment_method&&payment) {
      payment_method = payment.method
    }

    if (!payment_method) {
      payment_method = wallet.saved_add?.[0].payment_method
    }

    if (payment_method) {

      const isCrypto = this.cryptoCoins.includes(payment_method);

      this.setActiveChannel(isCrypto ? 'crypto' : 'local');

      // Hide the other tab
      this.showCryptoTab = isCrypto;
      this.showLocalTab = !isCrypto;

      // this.setSelectedCurrency(payment_method)
      if (!isCrypto) {
        this.selectedLocaLMethod = payment_method
        this.getVisibleCurrencies;;

      }else{
        this.selectedCryptoMethod=payment_method;
        this.initCryptoMethod=payment_method
        this.getVisibleCrptoNetwork
      }
      // !isCrypto?this.selectedLocaLMethod = payment_method:this.selectedCryptoMethod=payment_method;
    }else{
      this.showCryptoTab = true;
      this.showLocalTab = true;
    }

    this.saved_add = this.quickNav.storeData.get('wallet')?.saved_add?.[0]

  }

  setActiveChannel(channel: 'crypto' | 'local') {
    this.activeChannel$.next(channel);

    if (channel=='local') {
      this.selectedData = ""
    }
  }

  get activeChannel() {

    const active_channel = this.activeChannel$.value
    if (this.page==='withdraw'&&this.quickNav.storeData.get("is_agent")) {
      this.updateWithdrawalOptionsValidator(this.formView[active_channel].withdraw)
    }
    return active_channel;
  }

  setMaxAmount(form:any, amount:any = 0 ) {

    const symbol =  this.selectedData?.symbol
    if (!amount) {
        amount=this.storeData.get('wallet').balance.new;
    }

    form.patchValue({
      amount: this.currencyConverter.transform(amount,false)
    });

}

  handleSubmit(form:any,processor:any){

    if (!this.selectedData) {
      this.quickNav.alert(`Please selcet method method`,'info');
      return

    }
    form.patchValue({ payment_method: this.selectedData.code });
    form.patchValue({ origin: window.location.origin });

    this.formHandler.submitForm(form, processor, 'wallet/?showSpinner', true,  (res) => {
        this.editingAddress=false
        if (res.status === 'success' ) {
          this.initializeCurrency()
          this.updateWithdrawalOptionsSelector()

        }

        setTimeout(() => {

          const deposit =  this.storeData.get('deposit')

          if (deposit?.extraField?.get("payInfo")&&processor==='create_deposit') {
            this.quickNav.openTab(deposit?.extraField.get("payInfo"))
          }
        }, 300);
        // if (res.redirect) {
        //   this.quickNav.go(res.redirect)
        // }
    })


  }

  cvtToUSD(amount:any){

    if(!amount)  this.amountInUSD=0; return

    let rate = this.storeData.get("wallet").init_currencies.filter((item:any) => item.code === this.selectedCryptoMethod)[0].rate;//[this.selectedCryptoMethod]

    let cvt_val = 0
    if (this.selectedCryptoMethod==='USD') {
      cvt_val=0
    }else if (this.selectedCryptoMethod==='TRON') {
      cvt_val = +(amount * rate).toFixed(2)
    }else{
      cvt_val = +(amount / rate).toFixed(2)
    }

    this.amountInUSD = cvt_val
  }




}
