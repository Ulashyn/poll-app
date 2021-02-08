import { ModelUser } from '@app/_models/user.model';
import { first } from 'rxjs/operators';
import { QuestionService } from './../../_services/question.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService, toastTypes } from '@app/_services/toast.service';
import { AccountService } from '@app/_services/account.service';
import { pollAnswerEnum } from '@app/_models/poll.model';

@Component({
  selector: 'app-add-edit-question',
  templateUrl: './add-edit-question.component.html',
  styleUrls: ['./add-edit-question.component.scss']
})
export class AddEditQuestionComponent implements OnInit {
  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  loadingIcon = 'pi pi-check';
  cardTitle = 'Edit poll';
  user?: ModelUser;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private accountService: AccountService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.isAddMode = !this.id;
    if (this.isAddMode) {
      this.cardTitle = 'Add poll';
    }

    this.accountService.user.subscribe(user => {
      this.user = user;
      this.form = this.formBuilder.group({
        creatorId: [user.id],
        createDate: [new Date()],
        option1: this.formBuilder.group({
          id: [pollAnswerEnum.ACCEPT],
          text: [''],
          answeredUsers: [[]]
        }),
        option2: this.formBuilder.group({
          id: [pollAnswerEnum.REJECT],
          text: [''],
          answeredUsers: [[]]
        }),
      });
    });

    if (!this.isAddMode) {
      this.questionService
        .getById(this.id)
        .pipe(first())
        .subscribe((x) => this.form.patchValue(x));
    }
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.loadingIcon = 'pi pi-spin pi-spinner';
    if (this.isAddMode) {
      this.createPoll();
    } else {
      this.updatePoll();
    }
  }

  private createPoll(): void {
    this.questionService
      .addQuestion(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastService.showToast({
            status: toastTypes.SUCCESS,
            title: 'Success',
            message: 'Poll added successfully'
          });
          this.router.navigate(['/'], { relativeTo: this.route });
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

  private updatePoll(): void {
    this.questionService
      .update(this.id, this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastService.showToast({
            status: toastTypes.SUCCESS,
            title: 'Success',
            message: 'Update successful'
          });
          this.router.navigate(['/'], { relativeTo: this.route });
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
