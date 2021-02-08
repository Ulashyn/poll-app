import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminGuard } from './_helpers/admin.guard';
import { AuthGuard } from './_helpers/auth.guard';

const accountModule = () => import('./account/account/account.module').then(x => x.AccountModule);
const mainModule = () => import('./main/main/main.module').then(x => x.MainModule);

const routes: Routes = [
  // { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', loadChildren: mainModule, canActivate: [AuthGuard] },
  { path: 'account', loadChildren: accountModule },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
