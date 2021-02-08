import { ModelPoll, pollAnswerEnum } from '@app/_models/poll.model';
import { ModelUser } from '@app/_models/user.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import { QuestionService } from '@app/_services/question.service';
import { ToastService, toastTypes } from '@app/_services/toast.service';
import { first, map, mergeMap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-answer-question',
  templateUrl: './answer-question.component.html',
  styleUrls: ['./answer-question.component.scss']
})
export class AnswerQuestionComponent implements OnInit {
  id: string;
  loading = true;
  loadingIcon = 'pi pi-check';
  selectedValue: string;
  question: ModelPoll;
  user: ModelUser;
  users: ModelUser[];
  creator: ModelUser;
  isAnsvered = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private questionService: QuestionService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.questionService.getById(this.id)
      .pipe(
        mergeMap((question) => {
          return this.accountService
          .getById(question.creatorId)
          .pipe(
            first(),
            map(creator => ({creator, question}))
          );
        }),
        mergeMap((question) => {
          return this.accountService.user
          .pipe(
            first(),
            map(user => ({user, ...question}))
          );
        }),
        catchError(e => {
          this.router.navigate(['../'], { relativeTo: this.route });
          return EMPTY;
        })
      )
      .subscribe(({user, creator, question}) => {
        this.loading = false;
        this.user = user;
        this.creator = creator;
        this.question = question;
        this.checkAnswered(user, question);
      });
    this.accountService.getAll()
    .subscribe(users => {
      this.users = users;
    });
  }

  checkAnswered(user, question): void {
    if ((question.option1.answeredUsers && question.option1.answeredUsers.includes(user.id)) || (question.option2.answeredUsers && question.option2.answeredUsers.includes(user.id))) {
      this.isAnsvered = true;
    } else {
      this.isAnsvered = false;
    }
  }

  vote(): void {
    console.log(this.selectedValue);

    if (Number(this.selectedValue) === pollAnswerEnum.ACCEPT) {
      this.question.option1.answeredUsers.push(this.user.id);
    } else {
      this.question.option2.answeredUsers.push(this.user.id);
    }

    console.log(this.question);

    this.loading = true;
    this.loadingIcon = 'pi pi-spin pi-spinner';
    this.questionService.update(this.id, this.question)
    .pipe(first())
      .subscribe({
        next: () => {
          this.toastService.showToast({
            status: toastTypes.SUCCESS,
            title: 'Success',
            message: 'Vote successful'
          });
          this.router.navigate(['../'], { relativeTo: this.route });
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

  answeredPercent(answeredUsers): number {
    return Math.round(answeredUsers / this.users?.length * 100);
  }

}
