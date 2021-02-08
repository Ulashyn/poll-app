import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModelUser } from '../_models/user.model';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private userSubject: BehaviorSubject<ModelUser>;
  public user: Observable<ModelUser>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<ModelUser>(
      JSON.parse(localStorage.getItem('user'))
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): ModelUser {
    return this.userSubject.value;
  }

  login(username, password): Observable<any> {
    return this.http
      .post<ModelUser>(`${environment.apiUrl}/users/authenticate`, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  register(user: ModelUser): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }

  getAll(): Observable<any> {
    return this.http.get<ModelUser[]>(`${environment.apiUrl}/users`);
  }

  getById(id: string): Observable<any> {
    return this.http.get<ModelUser>(`${environment.apiUrl}/users/${id}`);
  }

  update(id, params): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/${id}`, params).pipe(
      map((x) => {
        if (id === this.userValue.id) {
          const user = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
        }
        return x;
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/users/${id}`).pipe(
      map((x) => {
        if (id === this.userValue.id) {
          this.logout();
        }
        return x;
      })
    );
  }
}
