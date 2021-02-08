import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import { ToastService } from '@app/_services/toast.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  loginIcon = 'pi pi-sign-in';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get username(): FormControl {
    return this.form.get('username') as FormControl;
  }
  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.loginIcon = 'pi pi-spin pi-spinner';
    this.accountService
      .login(this.username.value, this.password.value)
      .pipe(first())
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: (errorMessage) => {
          this.toastService.showToast({
            title: 'Error',
            message: errorMessage
          });
          this.loading = false;
          this.loginIcon = 'pi pi-sign-in';
        },
      });
  }
}
