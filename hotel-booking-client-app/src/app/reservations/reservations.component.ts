import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { StorageService } from '../_services/storage.service';

import { ReservationService } from '../_services/reservation.service';
import { Reservation } from '../models/reservation';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

import * as moment from 'moment';

interface Room {
  id: number;
  name: string;
}

interface Client {
  id: number;
  name: string;
}

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
})
export class ReservationsComponent implements OnInit {
  content: any;
  isLoggedIn = false;
  errorMessage = '';

  dataSaved = false;
  form: any;
  all!: Observable<Reservation[]>;
  dataSource!: MatTableDataSource<Reservation>;

  selection = new SelectionModel<Reservation>(true, []);
  idUpdate = null;
  massage = null;

  allClients!: Observable<Client[]>;
  allRooms!: Observable<Room[]>;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = [
    'select',
    'client_name',
    'room_name',
    'date',
    'no_days',
    'no_persons',
    'edit',
    'delete',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  moment: any = moment;

  constructor(
    private formbulider: FormBuilder,
    private reservationService: ReservationService,
    private storageService: StorageService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.loadAll();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    // Moment add '2' days to the current datetime
    // console.log(moment().add(2, 'd').format());

    this.form = this.formbulider.group({
      // Validators.pattern('[1-9][0-9]*') a number that start from 1
      client_id: ['', [Validators.required, Validators.pattern('[1-9][0-9]*')]],
      room_id: ['', [Validators.required, Validators.pattern('[1-9][0-9]*')]],
      date: ['', [Validators.required]],
      no_days: ['', [Validators.required, Validators.min(1)]],
      no_persons: ['', [Validators.required, Validators.min(1)]],
    });

    // Fill Client Drop Down List - Form select menu
    this.fillClientDDL();
    // Fill Room Drop Down List - Form select menu
    this.fillRoomDDL();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = !!this.dataSource && this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((r) => this.selection.select(r));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row: Reservation): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
  }

  deleteData() {
    const numSelected = this.selection.selected;
    if (numSelected.length > 0) {
      if (confirm('Are you sure to delete items?')) {
        this.reservationService
          .deleteRecords(numSelected)
          .subscribe((result) => {
            this.savedOk(2);
            this.loadAll();
          });
      }
    } else {
      alert('Select at least one row.');
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadAll() {
    this.reservationService.getAll().subscribe((data) => {
      // create custom json array from data that is array object
      let array = [];
      for (let key in data) {
        let object: any = {};
        object['id'] = data[key][0];
        object['client_name'] = data[key][1];
        object['room_name'] = data[key][2];
        object['date'] = data[key][3];
        object['no_days'] = data[key][4];
        object['no_persons'] = data[key][5];
        array.push(object);
      }
      data = array;

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onFormSubmit() {
    this.dataSaved = false;
    const reservation = this.form.value;
    this.create(reservation);
    //this.form.markAllAsTouched();
    this.form.reset();
  }

  loadToEdit(reservationId: string) {
    this.reservationService.getById(reservationId).subscribe((reservation) => {
      this.massage = null;
      this.dataSaved = false;
      this.idUpdate = reservation.id;
      this.form.controls['client_id'].setValue(reservation.client_id);
      this.form.controls['room_id'].setValue(reservation.room_id);
      this.form.controls['date'].setValue(reservation.date);
      this.form.controls['no_days'].setValue(reservation.no_days);
      this.form.controls['no_persons'].setValue(reservation.no_persons);
    });
  }

  create(reservation: Reservation) {
    if (this.idUpdate == null) {
      this.reservationService.create(reservation).subscribe(() => {
        this.dataSaved = true;
        this.savedOk(1);
        this.loadAll();
        this.idUpdate = null;
        this.form.reset();
      });
    } else {
      reservation.id = this.idUpdate;
      this.reservationService
        .update(reservation.id.toString(), reservation)
        .subscribe(() => {
          this.dataSaved = true;
          this.savedOk(0);
          this.loadAll();
          this.idUpdate = null;
          this.form.reset();
        });
    }
  }

  delete(reservationId: string) {
    if (confirm('Are you sure you want to delete this?')) {
      this.reservationService.deleteById(reservationId).subscribe(() => {
        this.dataSaved = true;
        this.savedOk(2);
        this.loadAll();
        this.idUpdate = null;
        this.form.reset();
      });
    }
  }

  fillClientDDL() {
    this.allClients = this.reservationService.getAllClients();
  }

  fillRoomDDL() {
    this.allRooms = this.reservationService.getAllRooms();
  }

  resetForm() {
    this.form.reset();
    this.massage = null;
    this.dataSaved = false;
    this.loadAll();
  }

  savedOk(isUpdate: any) {
    if (isUpdate == 0) {
      this._snackBar.open('Record updated!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else if (isUpdate == 1) {
      this._snackBar.open('Record saved!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else if (isUpdate == 2) {
      this._snackBar.open('Record deleted!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });

      //-- after multiple deletion select all and unselect all remained records to clear deleted records
      this.masterToggle(); //-- select all
      this.masterToggle(); //-- for clear all
    }
  }
}
