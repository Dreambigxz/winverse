import { Pipe, PipeTransform, inject } from '@angular/core';
import { StoreDataService } from '../http-loader/store-data.service'; // ✅ adjust path as needed

@Pipe({
  name: 'currencyConverter',
  standalone: true, // ✅ must be standalone
  // providedIn: 'root' // 👈 THIS makes it injectable in services

})
export class CurrencyConverterPipe implements PipeTransform {
  private storeData = inject(StoreDataService);
  public wallet = this.storeData.get('wallet');
  public init_currency = this.wallet?.init_currency


  transform(amount: number=0, showSymbol: boolean = false, another_currency=false,minimumFractionDigits:number=2): string {

    // const wallet = this.storeData.get('wallet');
    // let

    const pathname =  window.location.pathname

    // if (this.init_currency?.symbol==="BNB") {
    // if (this.storeData.get('wallet')?.init_currency?.symbol==="BNB"||this.storeData.get('wallet')?.symbol==="BNB"){
    //
    //   if (!this.storeData.get('wallet')?.symbol) {
    //     this.storeData.get('wallet').symbol="BNB"
    //   }
    //
    //   if (!["withdraw", "deposit"].includes(pathname)) {
    //
    //     this.storeData.get('wallet').init_currency = {
    //         'symbol': '$',
    //         'name': 'Dollar',
    //         'code': 'USD',
    //         'rate': 1,
    //         'flag': '🇺🇸'
    //     }
    //
    //   } else{
    //       this.storeData.get('wallet').init_currency={
    //           'symbol': 'BNB',
    //           'name': 'BNB',
    //           'code': 'BNB',
    //           'rate': 0.0015,
    //           'flag': '🌐'
    //       }
    //   }
    //
    // }

    // if (!this.wallet) {
      this.wallet=this.storeData.get('wallet');
      this.init_currency = this.wallet?.init_currency

    // }




    if (another_currency) {
      [this.init_currency] = this.wallet.init_currencies.filter((c:any)=>c.code===another_currency)
    }


    const rate = this.init_currency?.rate || 1;
    const symbol = this.init_currency?.symbol || '';
    let converted;


    if (symbol==='trx') {
      converted = amount / rate;
    }else{
      converted = amount * rate;
    }

    if (symbol==="BNB"&&minimumFractionDigits<=2) {
      minimumFractionDigits=3
    }



    return showSymbol
      ? `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: minimumFractionDigits, maximumFractionDigits: minimumFractionDigits })}`
      : converted.toFixed(minimumFractionDigits);
  }
}
