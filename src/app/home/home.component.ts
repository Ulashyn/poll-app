import { Component } from '@angular/core';
import { ModelUser } from '@app/_models/user.model';
import { AccountService } from '@app/_services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user: ModelUser;

  constructor(private accountService: AccountService) {
    this.user = this.accountService.userValue;
  }

}
