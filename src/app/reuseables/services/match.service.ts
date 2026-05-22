import { Injectable, inject } from '@angular/core';
import { CurrencyConverterPipe } from '../pipes/currency-converter.pipe';
import { StoreDataService } from '../http-loader/store-data.service';
import { ConfirmationDialogService } from '../modals/confirmation-dialog/confirmation-dialog.service';
import { RequestDataService } from '../http-loader/request-data.service';
import { QuickNavService } from '../services/quick-nav.service'; // ✅ adjust path as needed


@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private currencyConverter=inject(CurrencyConverterPipe)
  storeData = inject(StoreDataService)
  reqConfirmation = inject(ConfirmationDialogService)
  reqServerData= inject(RequestDataService)
  quickNav= inject(QuickNavService)

  fixtures:any

  addingFixture:any
  possibleWin:any=0
  stakeAmount:any=0
  profit:any=0
  minimumStake:any=0
  booking_link = ''
  upcomingMatches:any=[]
  CPG:any=[]

  searchTerm = '';
  notStartedMatches:any=[]
  bonusMatches:any=[]
  filteredMatches$!: Promise<any[]>;
  isSlipVisible= false;
  // isSlipVisible: any;

  emptyDataUrl = 'assets/images/empty-box.png'
  noMoreData = false

  setFixtures(){

    if (this.fixtures&&!this.storeData.get('nextDayData'))return
    if (this.storeData.get('nextDayData')){
      this.storeData.store['soccer'] = [...this.storeData.store['soccer'], ...this.storeData.store['nextDayData'] ]
    }
    this.fixtures=this.storeData.store['soccer']
  }

  async categorizeMatches(allMatches: any[], companyGames: any[] = []) {
    const now = new Date();

    const sortedData: { [key: string]: any[] } = {
      secured: [],
      notStarted: await this.notStarted(allMatches, now),
      live: this.live(allMatches),
      finished: this.finished(allMatches),
    };

    // Attach company games (secured)
    companyGames.forEach((element: any) => {
      const match = sortedData['notStarted'].find(
        (m: any) => m.fixture.fixture.id == element.fixtureID
      );
      if (match) {
        match['secured'] = true;
        sortedData['secured'].push(match);
      }
    });

    // Add upcoming (subset of notStarted)
    sortedData['upcoming'] = sortedData['notStarted'].slice(0, 10);

    return sortedData;
  }

  /** Matches that haven’t started yet */
  async notStarted(matches: any=null, now: Date = new Date()) {
    !matches?matches=this.fixtures:0;

      let notStartedMatches = [ ];
     notStartedMatches= matches
      .filter((m: any) => new Date(m.fixture.fixture.timestamp*1000) > now)
      .sort(
        (a: any, b: any) =>
          a.fixture.fixture.timestamp - b.fixture.fixture.timestamp
      );
      if (!notStartedMatches.length) {
        await this.nextDayData()

        notStartedMatches= this.fixtures
          .filter((m: any) => new Date(m.fixture.fixture.timestamp*1000) > now)
          .sort(
            (a: any, b: any) =>
              a.fixture.fixture.timestamp - b.fixture.fixture.timestamp
          );
      }

      if (!this.notStartedMatches.length) {
        this.notStartedMatches = notStartedMatches.slice(0, 50)

      }
        return notStartedMatches
  }

  /** Live matches (1H, 2H, HT) */
  live(matches: any[]) {
    return matches.filter((m: any) =>
      ['HT', '2H', '1H'].includes(m.fixture.fixture.status.short)
    );
  }

  /** Finished matches */
  finished(matches: any[]) {
    return matches.filter(
      (m: any) => m.fixture.fixture.status.short === 'FT'
    );
  }

  /** Upcoming (first 10 not started) */
  async upcoming(matches: any=null, now: Date = new Date(),slice=5) {


    !matches?[this.setFixtures(),matches=this.fixtures]:0;
    let ns = await this.notStarted(matches, now)
    this.upcomingMatches=ns.slice(0, slice)

    return this.upcomingMatches;
  }

  async companyGame(cpg:any=null){

    this.CPG = [ ]

    !cpg?cpg=this.storeData.get('company_games'):0;

    cpg = cpg.slice()//(0,1)


    // Attach company games (secured)
    let ns = await this.notStarted()

    cpg.forEach((element: any) => {
      const match = ns.find(
        (m: any) => m.fixture.fixture.id === element.fixtureID
      );
      if (match) {
        match['secured'] = true;
        this.CPG.push(match);
        cpg.length = 0
      }
    });

  }

  async loadBonusMatches(): Promise<any[]> {

    this.bonusMatches = []; // reset to avoid duplicates

    const bonus_matches = this.storeData.get('bonus_games');

    if (!bonus_matches?.length) return this.bonusMatches;

    const ns = await this.notStarted(); // now valid

    bonus_matches.forEach((element: any) => {
      const match = ns.find(
        (m: any) => m.fixture.fixture.id === element.fixtureID
      );

      if (match) {
        match.secured = true;
        this.bonusMatches.push(match);
      }
    });

    return this.bonusMatches;
  }

  showBetSlip(fixture:any,selected:any){
    let slipEle =document.querySelector(".fixed_footer")
    this.toggleSlip()
    fixture['selectedScore']=selected
    this.addingFixture=fixture
    this.minimumStake = this.storeData.get("bet_settings").minimum
    // !this.minimumStake?[this.currencyConverter.transform(this.storeData.get("bet_settings").minimum)]:0
  }

  stakeAmountHandler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.stakeAmount = !input.value ? 0 : input.value;
    this.setProfit()

  }

  setProfit(){
    this.profit = (this.stakeAmount * this.addingFixture.selectedScore.odds / 100 )//.toFixed(2)

    this.possibleWin  = parseFloat(this.stakeAmount) + parseFloat(this.profit)
  }

  setProfitOLD() {

    this.profit =
      this.stakeAmount *
      this.addingFixture.selectedScore.odds;

    this.possibleWin =
      parseFloat(this.stakeAmount) +
      parseFloat(this.profit);
  }

  toFixedNoRound(num:any, decimals: any) {
    const factor = Math.pow(10, decimals);
    return (Math.trunc(num * factor) / factor).toFixed(decimals);
  }

  stakeAll() {
    let stakeAll = this.currencyConverter.transform(this.storeData.get('wallet')?.balance?.new);
    this.stakeAmount = this.toFixedNoRound(parseFloat(stakeAll),4)//parseFloat(stakeAll).toFixed(1)
    this.setProfit()
  }

  slipHandler(processor:string){
    const slipData = {
      fixtureID:this.addingFixture.fixtureID,
      stakeAmount:this.stakeAmount,
      selectedScore:this.addingFixture.selectedScore,
      processor:'place_bet',
      startDate:new Date(this.addingFixture.fixture.fixture.timestamp*1000)
    }

    const minimumStake = this.currencyConverter.transform(this.minimumStake)

    const trade =  !["book_bet",'extra_bet'].includes(processor)

    console.log("minimumStake", parseFloat(minimumStake), this.minimumStake);
    console.log({"this.stakeAmount":parseFloat(this.stakeAmount)});


    if (trade&&parseFloat(minimumStake)>parseFloat(this.stakeAmount)) {
      this.quickNav.alert(`You need at least ${minimumStake} to bet!`,'info')
      return
    }


    this.reqConfirmation.confirmAction(()=>{
      if (trade)processor='place_bet'

      this.reqServerData.post('bet/?showSpinner',{...slipData,processor}).subscribe({
        next:res=>{
          if (!trade) {
              this.booking_link = `${window.location.origin}/betinfo/${this.addingFixture.fixtureID}`
              // this.openModal("bookingLinkmodal")

              setTimeout(() => {
                this.quickNav.copy(this.booking_link)

              }, 4000);
              // this.quickNav.alert(`Booking url Copied`,'success')
          }else{
            // setTimeout(() => {
              res.url?this.quickNav.go(res.url):0;
            // }, 0);
          }
      }
    })
  },processor.replace('_'," "), trade?`Confirming   ${processor.split('_')[0]} amount with ${this.storeData.get('wallet').init_currency.symbol}${slipData.stakeAmount} ?`:'')
  // },processor.replace('_'," "), `About to ${processor.split('_')[0].replace('e','').replace("!",'')}ing bet with ${this.storeData.get('wallet').init_currency.symbol}${slipData.stakeAmount} ?`)

  }

  async nextDayData(run_func = true, func='not_started') {
    const nextDayData:any = await this.reqServerData.get('soccer/?nextDayData=true').toPromise()
    this.setFixtures()
 }

  async search() {

   const term = this.searchTerm.toLowerCase()//this.searchTerm.toLowerCase();
   const matches = await this.notStarted();

   this.notStartedMatches = matches.filter((m:any) =>
     m.fixtureID?.toString().includes(term) ||
     m.fixture.teams.home.name?.toLowerCase().includes(term) ||
     m.fixture.teams.away.name?.toLowerCase().includes(term) ||
     m.fixture.league.namme?.toLowerCase().includes(term) ||
     m.fixture.league.country?.toLowerCase().includes(term)
   ).slice(0,50);
 }

  toggleSlip() {
     this.isSlipVisible = !this.isSlipVisible;
     // console.log({"this.isSlipVisible": this.isSlipVisible});

   }

  async loadMore(stop = 50) {

      const total_current_state = this.notStartedMatches.length;
      const notStarted = await this.notStarted(); // full list

      if (total_current_state < notStarted.length) {

        const nextBatch = notStarted.slice(
          total_current_state,
          total_current_state + stop
        );

        this.notStartedMatches = [
          ...this.notStartedMatches,
          ...nextBatch
        ];
      }else{
        this.noMoreData=true
      }
    }


}
