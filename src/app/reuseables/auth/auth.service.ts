import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { ConfirmationDialogService } from '../modals/confirmation-dialog/confirmation-dialog.service';
import { LoaderService } from '../http-loader/loader.service';
import { StoreDataService } from '../http-loader/store-data.service';
import { RequestDataService } from '../http-loader/request-data.service';

import { FormHandlerService } from '../http-loader/form-handler.service';
import {  FormBuilder, Validators, AbstractControl } from '@angular/forms';

interface StoredToken {
  created: string;  // ISO string
  exp: string;      // ISO string
  token: string;
}

type FormPageGroup = 'login' | 'register' | 'reset'

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private dialog = inject(MatDialog);
  public  router = inject(Router);
  private reqConfirmation = inject(ConfirmationDialogService)
  private storeData = inject(StoreDataService)
  private reqServerData = inject(RequestDataService)

  public tokenKey = 'token';
  public isLoggedIn = false;
  public redirectUrl: string | null = null;
  public token: string | null = null;
  public loaderService = inject(LoaderService);

  public tokenData : any

  fb = inject(FormBuilder);
  formHandler=inject(FormHandlerService)

  formView: Record<FormPageGroup, any> = {
    register:this.fb.group({
      username:['',[Validators.required]],
      email:["", [Validators.required]],
      password:["", [Validators.required, Validators.minLength(6)]],
      confirm_password:["", [Validators.required]],
      RefCode:[""],

    },{
      validators: this.passwordMatchValidator
    }),

      login:this.fb.group({
        identifier:['',[Validators.required]],
        password:["", [Validators.required]],
      }),
      reset:this.fb.group({
        email:['',[Validators.required]],
    }),

  }

  invitedBy:any
  RefCode:any
  uplinner:any
  showPassword=false

  isVisible = false;

  mode: 'login' | 'register' | 'reset' = 'login';

  private addHours(date: Date, hours: number): Date {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
  }

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirm_password')?.value;

    return password === confirm ? null : { passwordMismatch: true };
  }

  /** ✅ Checks if user is logged in and token still valid */
  checkLogin(): boolean {


    const raw = localStorage.getItem(this.tokenKey);

    if (!raw) {
      this.isLoggedIn = false;
      return false;
    }

    try {
      const stored: StoredToken = JSON.parse(raw);
      const exp = new Date(stored.exp);
      const now = new Date();

      if (now >= exp) {
        this.logout_now(); // Expired
        return false;
      }

      this.token = stored.token
      this.isLoggedIn = true;
      this.tokenData=stored

      return true;
    } catch (e) {
      this.logout_now();
      return false;
    }
  }

  /** ✅ Save login and token */
  login(token: string, authAction:any): Observable<boolean> {
    const payload: StoredToken = {
      created: new Date().toISOString(),
      exp: this.addHours(new Date(), 48).toISOString(),
      token,
    };

    localStorage.setItem(this.tokenKey, JSON.stringify(payload));
    localStorage.setItem("clientAction",authAction)
    localStorage.removeItem('invitedBy')

    this.isLoggedIn = true;

    this.isVisible=false

    return of(true);
  }

  /** ✅ Get current token if logged in */
  getToken(): string | null {
    if (this.checkLogin()) {
      const raw = localStorage.getItem(this.tokenKey);
      return raw ? JSON.parse(raw).token : null;
    }
    return null;
  }

  /** ✅ Force logout */
  logout_now(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedIn = false;
    this.storeData.clear()
    this.loaderService.show()
    window.location.reload()//='/sign-in';
  }

  /** ✅ Optional logout with confirmation */
  logout(force = true): void {
    if (force) {
      this.logout_now();
    } else {
      this.reqConfirmation.confirmAction(
        ()=>{this.logout_now()},
        'Sign out',
        'Continue logging out ?'
      )
    }
  }

  onSubmit(form:any,processor:any){

    if (this.RefCode) {
      form.patchValue({ RefCode: this.RefCode });
     }
    this.formHandler.submitForm(form,processor, processor+'/?showSpinner',  true, (res) => {
      if (res.status === 'success') {
        this.login(res.main.token, 'login').subscribe(() => {

          const redirectUrl = localStorage['redirectUrl'] || '/';

          try {

            const [path, query] = redirectUrl.split('?');

            delete this.storeData.store['soccer']


            if (query) {
              const queryParams = Object.fromEntries(new URLSearchParams(query));
              this.router.navigate([path], { queryParams });
            } else {
              this.router.navigate([path]);
            }

          } catch (error) {
            this.router.navigate(['/']);
          }

          delete localStorage['redirectUrl'];
        });
      }
    });

  }

  setRefCode(){
    let checkUrl = window.location.href.split('ref')
    console.log({checkUrl});

    if (checkUrl[1]) {
      this.RefCode=checkUrl[1].replaceAll('=','')
      localStorage['invitedBy']=this.RefCode
      this.formView.register.patchValue({ RefCode: this.RefCode });
    }else{
      if (localStorage['invitedBy']) {
        this.RefCode=localStorage['invitedBy']
      }
    }

    if (this.RefCode&&!this.invitedBy) {
      this.reqServerData.get('register?RefCode='+this.RefCode).subscribe({
        next:res =>{
          this.invitedBy=res.main?.invitedBy||''
          if (!this.invitedBy) this.RefCode=null

        }
      })
    }

  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  open(mode: 'login' | 'register' | 'reset' = 'login') {

    if (this.isLoggedIn)return;
    
    this.mode = mode;
    this.isVisible = true;

    if (mode==='register') {
      this.setRefCode()
    }

  }

  close() {

    this.isVisible = false;

  }

}
