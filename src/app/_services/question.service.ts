import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ModelPoll } from '@app/_models/poll.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private router: Router, private http: HttpClient) { }

  addQuestion(question: ModelPoll): Observable<any> {
    return this.http.post(`${environment.apiUrl}/questions/add`, question);
  }

  update(id, params): Observable<any> {
    return this.http.put(`${environment.apiUrl}/questions/${id}`, params);
  }

  getAll(): Observable<any> {
    return this.http.get<ModelPoll[]>(`${environment.apiUrl}/questions`);
  }

  getById(id: string): Observable<any> {
    return this.http.get<ModelPoll>(`${environment.apiUrl}/questions/${id}`);
  }

}
