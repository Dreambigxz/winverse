import { Injectable, inject } from '@angular/core';
import { StoreDataService } from '../http-loader/store-data.service';
import { ConfirmationDialogService } from '../modals/confirmation-dialog/confirmation-dialog.service';
import { RequestDataService } from '../http-loader/request-data.service';
import { CurrencyConverterPipe } from '../pipes/currency-converter.pipe';

@Injectable({
  providedIn: 'root'
})
export class BetHistoryService {

  private currencyConverter = inject(CurrencyConverterPipe);
  private reqConfirmation = inject(ConfirmationDialogService);

  reqServerData = inject(RequestDataService);
  storeData = inject(StoreDataService);

  allBets: any[] = []; // keep your fetched bets here
  openBetDisplay:any
  settledBets:any = []
  emptyDataUrl = 'assets/images/empty-box.png'

  /**
   * Get bet history filtered by status.
   * @param status - could be 'open', 'settled', 'won', 'lost', etc.
   */
  async getHistory(status: string='all',newBet=false): Promise<any[]> {
    // ✅ If already loaded, no need to refetch

    if (this.storeData.get('betDir')?.ticket||newBet) {
      this.allBets = this.storeData.get('betDir')?.ticket || [ ]
      return this.filterBets(status);
    }

    // ✅ Otherwise, wait for backend
    try {
      const res: any = await this.reqServerData.get('bet/?showSpinner').toPromise();
      // console.log(res);

      this.allBets = res?.main?.betDir?.ticket || [];
      return this.filterBets(status);
    } catch (err) {
      console.error('Error fetching bet history:', err);
      return [];
    }
  }

  filterBets(status: string,allBets:any=null) {

    if (!status || status === 'all') {
      this.sortTickets();
      return this.allBets;
    }

    const filtered = this.allBets.filter((bet:any) => bet.status === status);
    return filtered

  }

  /* ------------------------------------
   COMPUTED LISTS (USED BY HTML)
  ------------------------------------- */
  // get allBet() {
  //   return this.allBets.filter(bet => bet.status === 'open');
  // }

  get openBets() {
    return this.allBets.filter(bet => bet.status === 'open');
  }

  get settledBets_() {
    return this.allBets.filter(
      bet => ["won",'loss', "postponed"].includes(bet.status)
      //=== 'won' || bet.status === 'loss'
    );
  }

  get wonBet() {
    return this.allBets.filter(
      bet => ["won"].includes(bet.status)
      //=== 'won' || bet.status === 'loss'
    );
  }

  get lossBet() {
    return this.allBets.filter(
      bet => ["loss"].includes(bet.status)
      //=== 'won' || bet.status === 'loss'
    );
  }


  CanCancel(ticket:any){
    const now = new Date()
    return ticket.status==='open'&&new Date(ticket.start_date)>now
  }

  CancelTicket(ticket:any){

    this.reqConfirmation.confirmAction(()=>{
      this.reqServerData.post('bet/?showSpinner',{ticket_id:ticket.ticket_id,processor:'cancel_bet'}).subscribe({
        next: res =>{
           this.allBets = this.storeData.get('betDir').ticket
          this.openBetDisplay = this.filterBets('open')
          this.sortTickets()
         }
      })
    }, "Cancel match" , "You're about to remove match from history ?")

  }

  sortTickets() {
      const order = ['open'];

      this.allBets = [...this.allBets]
        // remove closed completely
        .filter(t => t.status !== 'closed')
        // sort remaining by desired order
        .sort((a, b) => {
          const aIndex = order.indexOf(a.status);
          const bIndex = order.indexOf(b.status);

          const aRank = aIndex === -1 ? 999 : aIndex;
          const bRank = bIndex === -1 ? 999 : bIndex;

          return aRank - bRank;
        });
    }

}
