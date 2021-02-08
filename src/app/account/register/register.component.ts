import { first } from 'rxjs/operators';
import { ToastService, toastTypes } from './../../_services/toast.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get firstName(): FormControl {
    return this.form.get('firstName') as FormControl;
  }
  get lastName(): FormControl {
    return this.form.get('lastName') as FormControl;
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
      .register(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastService.showToast({
            status: toastTypes.SUCCESS,
            title: 'Success',
            message: 'You logined'
          });
          this.router.navigate(['../login'], { relativeTo: this.route });
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
