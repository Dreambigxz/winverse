import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuickNavService } from '../../reuseables/services/quick-nav.service';

@Component({
  selector: 'app-quick-nav',
  imports: [CommonModule],
  templateUrl: './quick-nav.component.html',
  styleUrl: './quick-nav.component.css'
})


export class QuickNavComponent {


  quickNav = inject(QuickNavService)




}
