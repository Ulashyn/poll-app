import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountService: AccountService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this.accountService.userValue;
    if (user.id === 1) {
      return true;
    }

    this.router.navigate(['/'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
