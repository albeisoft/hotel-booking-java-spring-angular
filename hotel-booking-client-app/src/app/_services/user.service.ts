import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUserStorage: any;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  getUsers(): Observable<any> {
    this.currentUserStorage = this.storageService.getUser();
    let accessToken = this.currentUserStorage['access_token'];

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      //Authorization: 'Bearer ' + accessToken,
    });

    return this.http.get(API_URL + 'users', { headers: headers });
  }
}
