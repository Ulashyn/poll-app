import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';

const usersKey = 'CggmtkKorz';
const questionsKey = 'xaw4USkf9b';
let users = JSON.parse(localStorage.getItem(usersKey)) || [];
const questions = JSON.parse(localStorage.getItem(questionsKey)) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return handleRoute();

    function handleRoute(): Observable<any> {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users/register') && method === 'POST':
          return register();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        case url.match(/\/users\/\d+$/) && method === 'PUT':
          return updateUser();
        case url.match(/\/users\/\d+$/) && method === 'DELETE':
          return deleteUser();
        case url.endsWith('/questions/add') && method === 'POST':
          return addQuestion();
        case url.endsWith('/questions') && method === 'GET':
          return getQuestions();
        case url.match(/\/questions\/\d+$/) && method === 'GET':
          return getQuestionById();
        case url.match(/\/questions\/\d+$/) && method === 'PUT':
          return updateQuestion();
        default:
          return next.handle(request);
      }
    }

    function authenticate(): Observable<any> {
      const { username, password } = body;
      const user = users.find(
        (x) => x.username === username && x.password === password
      );
      if (!user) {
        return error('Username or password is incorrect');
      }
      return ok({
        ...basicDetails(user),
        token: 'fake-jwt-token',
      });
    }

    function register(): Observable<any> {
      const user = body;
      if (users.find((x) => x.username === user.username)) {
        return error('Username "' + user.username + '" is already taken');
      }
      user.id = users.length ? Math.max(...users.map((x) => x.id)) + 1 : 1;
      users.push(user);
      localStorage.setItem(usersKey, JSON.stringify(users));
      return ok();
    }

    function getUsers(): Observable<any> {
      if (!isLoggedIn()) {
        return unauthorized();
      }
      return ok(users.map((x) => basicDetails(x)));
    }

    function getUserById(): Observable<any> {
      if (!isLoggedIn()) {
        return unauthorized();
      }
      const user = users.find((x) => x.id === idFromUrl());
      return ok(basicDetails(user));
    }

    function updateUser(): Observable<any> {
      if (!isLoggedIn()) {
        return unauthorized();
      }
      const params = body;
      const user = users.find((x) => x.id === idFromUrl());
      if (!params.password) {
        delete params.password;
      }
      Object.assign(user, params);
      localStorage.setItem(usersKey, JSON.stringify(users));
      return ok();
    }

    function deleteUser(): Observable<any> {
      if (!isLoggedIn()) {
        return unauthorized();
      }
      users = users.filter((x) => x.id !== idFromUrl());
      localStorage.setItem(usersKey, JSON.stringify(users));
      return ok();
    }

    function ok(queryBody?): Observable<any> {
      return of(new HttpResponse({ status: 200, body: queryBody })).pipe(delay(500));
    }

    function error(message): Observable<any> {
      return throwError({ error: { message } }).pipe(
        materialize(),
        delay(500),
        dematerialize()
      );
    }

    function unauthorized(): Observable<any> {
      return throwError({
        status: 401,
        error: { message: 'Unauthorized' },
      }).pipe(materialize(), delay(500), dematerialize());
    }

    function basicDetails(user): any {
      const { id, username, firstName, lastName } = user;
      return { id, username, firstName, lastName };
    }

    function isLoggedIn(): boolean {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }

    function idFromUrl(): number {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1], 10);
    }

    function addQuestion(): Observable<any> {
      const question = body;
      question.id = questions.length ? Math.max(...questions.map((x) => x.id)) + 1 : 1;
      questions.push(question);
      localStorage.setItem(questionsKey, JSON.stringify(questions));
      return ok();
    }

    function updateQuestion(): Observable<any> {
      console.log('fdasdf');
      
      if (!isLoggedIn()) {
        return unauthorized();
      }
      const params = body;
      console.log('sadsd',params);
      
      const question = questions.find((x) => x.id === idFromUrl());
      Object.assign(question, params);
      localStorage.setItem(questionsKey, JSON.stringify(questions));
      return ok();
    }

    function getQuestions(): Observable<any> {
      if (!isLoggedIn()) {
        return unauthorized();
      }
      return ok(questions);
    }

    function getQuestionById(): Observable<any> {
      if (!isLoggedIn()) {
        return unauthorized();
      }
      const question = questions.find((x) => x.id === idFromUrl());
      return ok(question);
    }
  }
}

export let fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
