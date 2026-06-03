import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { authService } from "./reauth-model.service";
import { AuthService } from '../reuseables/auth/auth.service';
import { QuickNavService } from '../reuseables/services/quick-nav.service';

import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent {

  constructor(
    public authModal: AuthService,
    public quickNav: QuickNavService
  ) {}

  get authMode() {

    return this.authModal.mode;

  }

}
