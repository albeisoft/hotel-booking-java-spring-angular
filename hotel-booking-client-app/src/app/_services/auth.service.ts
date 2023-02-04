import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

const AUTH_API = `${environment.apiUrl}`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

const httpOptions2 = {
  headers: new HttpHeaders().set(
    'Content-Type',
    'application/x-www-form-urlencoded'
  ),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  login(userName: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('userName', userName)
      .set('password', password);
    return this.http.post(AUTH_API + 'login', params, httpOptions2);
  }

  /*
  login(userName: string, password: string): Observable<any> {
    return this.http.post(
      //      AUTH_API + 'login',
      AUTH_API,
      {
        userName,
        password,
      },
      httpOptions
    );
  }
*/

  register(userName: string, password: string, name: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'user/save',
      {
        userName,
        password,
        name,
      },
      httpOptions
    );
  }

  addRoleToUser(userName: string, userRoleName: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'role/addroletouser',
      {
        userName,
        userRoleName,
      },
      httpOptions
    );
  }

  tokenRefresh() {
    return this.http.post(AUTH_API + 'token/refresh', {}, httpOptions2);
  }
}
