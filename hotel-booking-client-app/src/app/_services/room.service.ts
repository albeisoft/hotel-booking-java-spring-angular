import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';

import { Room } from '../models/room';
import { Category } from '../models/category';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class RoomService {
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

    return this.http.get(API_URL + 'room/allcustom', { headers: headers });
  }

  getAllCategories(): Observable<Category[]> {
    this.currentUserStorage = this.storageService.getUser();
    let accessToken = this.currentUserStorage['access_token'];
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      //Authorization: 'Bearer ' + accessToken,
    });

    return this.http.get<Category[]>(API_URL + 'category/all', {
      headers: headers,
    });
  }

  getById(id: string): Observable<any> {
    this.currentUserStorage = this.storageService.getUser();
    let accessToken = this.currentUserStorage['access_token'];
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      //Authorization: 'Bearer ' + accessToken,
    });

    return this.http.get(API_URL + 'room/find/' + id, { headers: headers });
  }

  create(room: Room): Observable<Room> {
    this.currentUserStorage = this.storageService.getUser();
    let accessToken = this.currentUserStorage['access_token'];
    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set(
        'Authorization',
        `Bearer ${accessToken}`
        //'Authorization','Bearer ' + accessToken
      ),
    };

    return this.http.post<Room>(API_URL + 'room/add', room, httpOptions);
  }

  update(id: string, room: Room): Observable<Room> {
    this.currentUserStorage = this.storageService.getUser();
    let accessToken = this.currentUserStorage['access_token'];
    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set(
        'Authorization',
        `Bearer ${accessToken}`
        //'Authorization','Bearer ' + accessToken
      ),
    };

    return this.http.put<Room>(
      //API_URL + 'room/update/' + id,
      API_URL + 'room/update',
      room,
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

    return this.http.delete<number>(API_URL + 'room/delete/' + id, httpOptions);
  }

  deleteRecords(selectedRecordsToDelete: Room[]): Observable<string> {
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
      API_URL + 'room/deleterecords',
      selectedRecordsToDelete,
      httpOptions
    );
  }
}
