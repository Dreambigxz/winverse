import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletService } from '../../reuseables/services/wallet.service';

import { CurrencyConverterPipe } from '../../reuseables/pipes/currency-converter.pipe';
import { SpinnerComponent } from '../../reuseables/http-loader/spinner.component';
import { StoreDataService } from '../../reuseables/http-loader/store-data.service';
import { RequestDataService } from '../../reuseables/http-loader/request-data.service';
import { Header2Component } from "../../components/header2/header2.component";

import { FormBuilder, FormGroup , ReactiveFormsModule, FormsModule} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

import { QuickNavService } from '../../reuseables/services/quick-nav.service';
// import { TxFilterPipe } from '../../reuseables/pipes/filter-date.pipe';
import { EmptyStateComponent } from "../../components/empty-state/empty-state.component";



@Component({
  selector: 'app-transaction',
  imports: [
    CommonModule,CurrencyConverterPipe,
    SpinnerComponent,Header2Component,
    CurrencyConverterPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    FormsModule,
    EmptyStateComponent
    // TxFilterPipe
  ],
  templateUrl: './transaction.component.html',
  // styleUrl: './transaction.component.css'
  styleUrls: ['./transaction.component.css', "./tra-styles.css"]

})
export class TransactionComponent {

  quickNav = inject(QuickNavService)

  storeData = inject(StoreDataService)
  reqServerData = inject(RequestDataService)
  walletService = inject(WalletService);

  transactions : any  = []
  expandedTraId:any

  filteredTransactions = [...this.transactions];
  filterForm: FormGroup;

  searchText:any
  startDate:any
  endDate:any

  constructor(private fb: FormBuilder) {
    const today = new Date();
    const last7 = new Date();
    last7.setDate(today.getDate() - 7);

    this.filterForm = this.fb.group({
      range: this.fb.group({
        start: [last7],
        stop: [today],
      }),
    });
  }

  ngOnInit(){
      this.storeData.store['pageDetails']='wallet'
      if (!this.storeData.get('transactions')) {this.reqServerData.get("wallet?dir=start_transactions&showSpinner").subscribe(
        (res)=>{
          console.log({res});

          this.transactions = this.storeData.get('transactions')

        }
      )}
  }

  viewDetails(tx: any) {
    this.expandedTraId=tx.id===this.expandedTraId?null:tx.id
  }

  filterByDate() {
    const { start, stop } = this.filterForm.value.range;
    if (!start || !stop) return;
    this.reqServerData.post('wallet/',{start,stop,processor:'filter_transactions'}).subscribe()
  }

}
