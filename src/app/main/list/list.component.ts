import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services/account.service';
import { ConfirmationService } from 'primeng/api';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  users = null;
  loading = true;

  constructor(
    private accountService: AccountService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAll()
      .pipe(first())
      .subscribe((users) => {
        this.users = users;
        this.loading = false;
      });
  }

  deleteUser(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete user?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.accountService
          .delete(id)
          .pipe(first())
          .subscribe(() => {
            this.users = this.users.filter((x) => x.id !== id);
            this.loading = false;
          });
      }
    });
  }
}
