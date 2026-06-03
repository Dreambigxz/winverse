import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, RouterLink, NavigationEnd, RouterLinkActive} from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  key: string;
  path: string;
}
@Component({
  selector: 'app-menu-bottom',
  imports: [
    CommonModule,
    RouterLink, RouterLinkActive,
  ],
  templateUrl: './menu-bottom.component.html',
  styleUrl: './menu-bottom.component.css'
})
export class MenuBottomComponent {

    router = inject(Router)
    items: NavItem[] = [
      { label: 'Home', route: '/', key: '', path:"dashboard" },
      // { label: 'Market', route: '/matches', key: 'matches', path:"M7 10h5v5H7zM3 5h1V3h2v2h10V3h2v2h1a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM3 8v11h18V8H3z" },
      { label: 'Market', route: '/matches', key: 'matches', path:"chart-line" },
      { label: 'Trade', route: '/trade', key: 'trade', path:"desktop" },

      // { label: 'Teams', route: '/', key: 'earnings', path:"users" },
      { label: 'Invite', route: '/invite', key: 'invite', path:"dollar" },

      { label: 'Account', route: '/account', key: 'account', path:"user" },
      // { label: 'Me', route: '/account', key: 'account', path:"user" }
    ];

    activePage :any


    ngOnInit() {
      const segments = window.location.pathname.split('/');
      this.activePage = segments.pop() || '';
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          const segments = event.urlAfterRedirects.split('/');
          this.activePage = segments.pop() || ''; // 'earnings'

        }

      });
    }


}
