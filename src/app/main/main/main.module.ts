import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MainRoutingModule } from './main-routing.module';
import { AddEditComponent } from '../add-edit/add-edit.component';
import { LayoutComponent } from '../layout/layout.component';
import { ListComponent } from '../list/list.component';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { QuestionListComponent } from '../question-list/question-list.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AddEditQuestionComponent } from '../add-edit-question/add-edit-question.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { AnswerQuestionComponent } from '../answer-question/answer-question.component';
import { FieldsetModule } from 'primeng/fieldset';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AddEditComponent,
    LayoutComponent,
    ListComponent,
    QuestionListComponent,
    AddEditQuestionComponent,
    AnswerQuestionComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    TableModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ConfirmDialogModule,
    RadioButtonModule,
    InputTextareaModule,
    TabViewModule,
    FormsModule,
    FieldsetModule
  ],
  providers: [ConfirmationService]
})
export class MainModule { }
