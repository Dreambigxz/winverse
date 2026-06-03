import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';


import { SpinnerComponent } from '../../reuseables/http-loader/spinner.component';
import { Header2Component } from "../../components/header2/header2.component";
import { CurrencyConverterPipe } from '../../reuseables/pipes/currency-converter.pipe';

import { InviteServices } from "../invite.service";
import { EmptyStateComponent } from "../../components/empty-state/empty-state.component";


@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    CurrencyConverterPipe,
    SpinnerComponent,
    Header2Component,
    EmptyStateComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {


  route = inject(ActivatedRoute)
  router=inject(Router)
  inviteService = inject(InviteServices)


  ngOnInit(){

    this.route.queryParams.subscribe(

        (params) => {

        let  generation = params['generation'];
        let type = params['type']

        console.log({generation,type});

        this.inviteService.loadUser(generation,type)
        // this.type = params['type'];
        //
        // this.loadUsers();

      }
    );
  }





}
