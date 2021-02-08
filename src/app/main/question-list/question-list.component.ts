import { AccountService } from '@app/_services/account.service';
import { QuestionService } from './../../_services/question.service';
import { Component, OnInit } from '@angular/core';
import { first, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {
  answeredQuestions = null;
  unansweredQuestions = null;
  loading = true;

  constructor(
    private questionService: QuestionService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.accountService.user
      .pipe(
        mergeMap((user) => {
          return this.questionService
          .getAll()
          .pipe(
            first(),
            map(questions => ({user, questions}))
          );
        })
      )
      .subscribe(({user, questions}) => {
        this.answeredQuestions = questions.filter(el => el.option1.answeredUsers.includes(user.id) || el.option2.answeredUsers.includes(user.id));
        this.unansweredQuestions = questions.filter(el => !el.option1.answeredUsers.includes(user.id) && !el.option2.answeredUsers.includes(user.id));
        this.unansweredQuestions.sort((a, b) => (new Date(a.createDate) > new Date(b.createDate)) ? -1 : 1);
        this.answeredQuestions.sort((a, b) => (new Date(a.createDate) > new Date(b.createDate)) ? -1 : 1);
        this.loading = false;
      });
  }

}
