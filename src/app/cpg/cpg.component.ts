import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeFormatPipe } from '../reuseables/pipes/time-format.pipe';
import { CountdownPipe } from '../reuseables/pipes/countdown.pipe';
import { TruncateCenterPipe } from '../reuseables/pipes/truncate-center.pipe';
import { Router } from '@angular/router';


import { MatchService } from '../reuseables/services/match.service';

@Component({
  selector: 'app-cpg',
  imports: [
    CommonModule,
    TruncateCenterPipe,
    TimeFormatPipe
  ],
  templateUrl: './cpg.component.html',
  styleUrl: './cpg.component.css'
})
export class CpgComponent {

  router = inject(Router);

  matchService = inject(MatchService);

}
