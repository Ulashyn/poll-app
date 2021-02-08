import { PageNotFoundComponent } from './../page-not-found/page-not-found.component';
import { AnswerQuestionComponent } from './../answer-question/answer-question.component';
import { AddEditQuestionComponent } from './../add-edit-question/add-edit-question.component';
import { AdminGuard } from './../../_helpers/admin.guard';
import { QuestionListComponent } from './../question-list/question-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditComponent } from '../add-edit/add-edit.component';
import { LayoutComponent } from '../layout/layout.component';
import { ListComponent } from '../list/list.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: QuestionListComponent },
      { path: 'users', component: ListComponent, canActivate: [AdminGuard] },
      { path: 'users/add-user', component: AddEditComponent },
      { path: 'users/edit-user/:id', component: AddEditComponent },
      { path: 'question/add', component: AddEditQuestionComponent },
      { path: 'question/edit/:id', component: AddEditQuestionComponent },
      { path: 'question/:id', component: AnswerQuestionComponent },
      { path: '**', component: PageNotFoundComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
