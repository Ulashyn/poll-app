import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import { ToastService, toastTypes } from '@app/_services/toast.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss'],
})
export class AddEditComponent implements OnInit {
  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  loadingIcon = 'pi pi-check';
  cardTitle = 'Edit user';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.isAddMode = !this.id;
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
      this.cardTitle = 'Add user';
    }

    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', passwordValidators],
    });

    if (!this.isAddMode) {
      this.accountService
        .getById(this.id)
        .pipe(first())
        .subscribe((x) => this.form.patchValue(x));
    }
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
    this.loadingIcon = 'pi pi-spin pi-spinner';
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private createUser(): void {
    this.accountService
      .register(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastService.showToast({
            status: toastTypes.SUCCESS,
            title: 'Success',
            message: 'User added successfully'
          });
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.toastService.showToast({
            title: error.name,
            message: error.message
          });
          this.loading = false;
          this.loadingIcon = 'pi pi-check';
        },
      });
  }

  private updateUser(): void {
    this.accountService
      .update(this.id, this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastService.showToast({
            status: toastTypes.SUCCESS,
            title: 'Success',
            message: 'Update successful'
          });
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: (errorMessage) => {
          this.toastService.showToast({
            title: 'Error',
            message: errorMessage
          });
          this.loading = false;
          this.loadingIcon = 'pi pi-check';
        },
      });
  }
}
