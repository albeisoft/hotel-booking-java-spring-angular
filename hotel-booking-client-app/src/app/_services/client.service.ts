import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';

import { Client } from '../models/client';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  currentUserStorage: any;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  getAll(): Observable<any> {
    this.currentUserStorage = this.storageService.getUser();
    let accessToken = this.currentUserStorage['access_token'];
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      //Authorization: 'Bearer ' + accessToken,
    });

    return this.http.get(API_URL + 'client/all', { headers: headers });
  }

  getById(id: string): Observable<any> {
    this.currentUserStorage = this.storageService.getUser();
    let accessToken = this.currentUserStorage['access_token'];
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      //Authorization: 'Bearer ' + accessToken,
    });

    return this.http.get(API_URL + 'client/find/' + id, { headers: headers });
  }

  create(client: Client): Observable<Client> {
    this.currentUserStorage = this.storageService.getUser();
    let accessToken = this.currentUserStorage['access_token'];
    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set(
        'Authorization',
        `Bearer ${accessToken}`
        //'Authorization','Bearer ' + accessToken
      ),
    };

    return this.http.post<Client>(API_URL + 'client/add', client, httpOptions);
  }

  update(id: string, client: Client): Observable<Client> {
    this.currentUserStorage = this.storageService.getUser();
    let accessToken = this.currentUserStorage['access_token'];
    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set(
        'Authorization',
        `Bearer ${accessToken}`
        //'Authorization','Bearer ' + accessToken
      ),
    };

    return this.http.put<Client>(
      //API_URL + 'client/update/' + id,
      API_URL + 'client/update',
      client,
      httpOptions
    );
  }

  deleteById(id: string): Observable<number> {
    this.currentUserStorage = this.storageService.getUser();
    let accessToken = this.currentUserStorage['access_token'];
    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set(
        'Authorization',
        `Bearer ${accessToken}`
        //'Authorization','Bearer ' + accessToken
      ),
    };

    return this.http.delete<number>(
      API_URL + 'client/delete/' + id,
      httpOptions
    );
  }

  deleteRecords(selectedRecordsToDelete: Client[]): Observable<string> {
    this.currentUserStorage = this.storageService.getUser();
    let accessToken = this.currentUserStorage['access_token'];
    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set(
        'Authorization',
        `Bearer ${accessToken}`
        //'Authorization','Bearer ' + accessToken
      ),
    };

    return this.http.post<string>(
      API_URL + 'client/deleterecords',
      selectedRecordsToDelete,
      httpOptions
    );
  }
}
