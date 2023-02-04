import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';

import { Reservation } from '../models/reservation';
import { Client } from '../models/client';
import { Room } from '../models/room';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
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

    return this.http.get(API_URL + 'reservation/allcustom', {
      headers: headers,
    });
  }

  getAllClients(): Observable<Client[]> {
    this.currentUserStorage = this.storageService.getUser();
    let accessToken = this.currentUserStorage['access_token'];
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      //Authorization: 'Bearer ' + accessToken,
    });

    return this.http.get<Client[]>(API_URL + 'client/all', {
      headers: headers,
    });
  }

  getAllRooms(): Observable<Room[]> {
    this.currentUserStorage = this.storageService.getUser();
    let accessToken = this.currentUserStorage['access_token'];
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      //Authorization: 'Bearer ' + accessToken,
    });

    return this.http.get<Room[]>(API_URL + 'room/all', {
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

    return this.http.get(API_URL + 'reservation/find/' + id, {
      headers: headers,
    });
  }

  create(reservation: Reservation): Observable<Reservation> {
    this.currentUserStorage = this.storageService.getUser();
    let accessToken = this.currentUserStorage['access_token'];
    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set(
        'Authorization',
        `Bearer ${accessToken}`
        //'Authorization','Bearer ' + accessToken
      ),
    };

    return this.http.post<Reservation>(
      API_URL + 'reservation/add',
      reservation,
      httpOptions
    );
  }

  update(id: string, reservation: Reservation): Observable<Reservation> {
    this.currentUserStorage = this.storageService.getUser();
    let accessToken = this.currentUserStorage['access_token'];
    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set(
        'Authorization',
        `Bearer ${accessToken}`
        //'Authorization','Bearer ' + accessToken
      ),
    };

    return this.http.put<Reservation>(
      //API_URL + 'reservation/update/' + id,
      API_URL + 'reservation/update',
      reservation,
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
      API_URL + 'reservation/delete/' + id,
      httpOptions
    );
  }

  deleteRecords(selectedRecordsToDelete: Reservation[]): Observable<string> {
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
      API_URL + 'reservation/deleterecords',
      selectedRecordsToDelete,
      httpOptions
    );
  }
}
