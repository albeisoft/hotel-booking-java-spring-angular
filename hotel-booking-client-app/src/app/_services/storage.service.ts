import { Injectable } from '@angular/core';

import { formatDate } from '@angular/common';

const USER_KEY = 'logged-user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }

  public isTokenExpired() {
    const user = this.getUser();
    let token = user['access_token'];

    if (typeof token !== 'undefined') {
      const expiry = JSON.parse(atob(token.split('.')[1])).exp;
      // token expiration convert from miliseconds to date time: formatDate(expiry * 1000, 'dd-MM-yyyy HH:mm:ss', 'en')
      // date now in miliseconds to date time: formatDate(Date.now(), 'dd-MM-yyyy HH:mm:ss', 'en')

      console.log(
        'token expire at # ' +
          formatDate(expiry * 1000, 'dd-MM-yyyy HH:mm:ss', 'en')
      );

      return expiry * 1000 < Date.now();
    }
    return false;
  }

  public getLoggedUserName() {
    const user = this.getUser();
    let token = user['access_token'];
    const userName = JSON.parse(atob(token.split('.')[1])).sub;

    return userName;
  }

  public getLoggedUserRoles() {
    const user = this.getUser();
    let token = user['access_token'];
    const userRoles = JSON.parse(atob(token.split('.')[1])).roles;

    return userRoles;
  }
}
