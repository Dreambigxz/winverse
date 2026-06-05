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


  transform(amount: number=0, showSymbol: boolean = false, another_currency:any=false,minimumFractionDigits:number=2): string {

    // const wallet = this.storeData.get('wallet');
    // let

    const pathname =  window.location.pathname

    this.wallet=this.storeData.get('wallet');
    this.init_currency = this.wallet?.init_currency

    // console.log({another_currency,"init_currency_symbol":this.init_currency.symbol});

    if (another_currency) {
    // if (another_currency!==this.init_currency.symbol) {
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
