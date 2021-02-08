import { AccountService } from './_services/account.service';
import { Component, OnInit } from '@angular/core';
import { ModelUser } from './_models/user.model';
import { PrimeNGConfig } from 'primeng/api';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  user?: ModelUser;
  items: MenuItem[];
  isAdmin = false;

  constructor(
    private accountService: AccountService,
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.accountService.user.subscribe(user => {
      this.user = user;
      if (user && user.id === 1) {
        this.isAdmin = true;
      }
      this.items = [
        {
          label: 'Home',
          icon: 'pi pi-fw pi-home',
          routerLink: ['/'],
          routerLinkActiveOptions: { exact: true },
        },
        {
          label: 'Users',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/users'],
          routerLinkActiveOptions: { exact: true },
          visible: this.isAdmin
        },
      ];
    });
  }

  logout(): void {
    this.accountService.logout();
    this.isAdmin = false;
  }
}
