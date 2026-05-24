import { Component,inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RequestDataService } from '../../reuseables/http-loader/request-data.service';
import { StoreDataService } from '../../reuseables/http-loader/store-data.service';
import { ConfirmationDialogService } from '../../reuseables/modals/confirmation-dialog/confirmation-dialog.service';
import { SpinnerComponent } from '../../reuseables/http-loader/spinner.component';

import { Router, ActivatedRoute } from '@angular/router';

import { FormHandlerService } from '../../reuseables/http-loader/form-handler.service';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Header2Component } from "../../components/header2/header2.component";
import { QuickNavService } from '../../reuseables/services/quick-nav.service';

import { ReferralManagementComponent } from "../referral-management/referral-management.component";

@Component({
  selector: 'app-agent-management',
  imports: [CommonModule,SpinnerComponent,
      ReactiveFormsModule,Header2Component, FormsModule,
      ReferralManagementComponent
    ],
  templateUrl: './agent-management.component.html',
  styleUrl: './agent-management.component.css'
})
export class AgentManagementComponent {

  quickNav = inject(QuickNavService)

  manageUser : any
  selectedData:any
  loadNewUser  = true

  sendingData : any
  readyData:any
  dataPrompt:any


  ngOnInit(){this.quickNav.reqServerData.get("agent-management").subscribe((res)=>{
    console.log({res});

  })}

  getStatusSymbol(status: any) {

    const makeSymbols: Record<string, string> = {
      true: "active 🟢",
      false: "inactive ⛔️"
    };

    return makeSymbols[status];
  }

  getuserInfo(){

    delete(this.quickNav.storeData.store['loaded_user'])
    this.quickNav.reqServerData.get("agent-management?user="+this.manageUser).subscribe((res)=>{
      console.log({res});

      if (res.main.loaded_user) {
        this.loadNewUser=false
      }

    })

  }

  changeSelectedData(event: any) {

    const select = event.target;

    const selectedOption = select.options[select.selectedIndex];

    this.selectedData = selectedOption.value;

    this.dataPrompt = selectedOption.getAttribute('data-prompt');

  }

  loadUserData(){

    this.readyData =  {
      processor: this.selectedData,
      process: this.sendingData,
      user:this.manageUser
    }
    if (!this.sendingData&&this.dataPrompt)return;

    this.quickNav.reqServerData.post('agent-management/', this.readyData).subscribe(
      (res)=>{
        console.log({res});

      }
    )
  }

}
