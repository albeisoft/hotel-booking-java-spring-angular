import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { StorageService } from '../_services/storage.service';

import { RoomService } from '../_services/room.service';
import { Room } from '../models/room';

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

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  content: any;
  isLoggedIn = false;
  errorMessage = '';
  roomId = 0;

  dataSaved = false;
  form: any;
  all!: Observable<Room[]>;
  dataSource!: MatTableDataSource<Room>;

  selection = new SelectionModel<Room>(true, []);
  idUpdate = null;
  massage = null;

  allCategories!: Observable<Category[]>;
  categoryId = null;
  // access checkbox dynamic by variable boolIsView set form material ui mat-checkbox control [checked]="boolIsView"
  // or input checkbox [(ngModel)] = "boolIsView"
  // boolIsView = false;
  boolIsView = false;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = [
    'select',
    'name',
    'is_view',
    'floor',
    'no_places',
    'category_name',
    'edit',
    'delete',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formbulider: FormBuilder,
    private roomService: RoomService,
    private storageService: StorageService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.loadAll();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    this.form = this.formbulider.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      // Validators.pattern('[1-9][0-9]*') a number that start from 1
      category_id: [
        '',
        [Validators.required, Validators.pattern('[1-9][0-9]*')],
      ],
      //is_view: ['', [Validators.required]],
      is_view: [''],
      floor: ['', [Validators.required, Validators.min(1)]],
      no_places: ['', [Validators.required, Validators.min(1)]],
      note: [''],
    });

    // this.form.markAllAsTouched();

    // Fill Category Drop Down List - Form select menu
    this.fillCategoryDDL();
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
  checkboxLabel(row: Room): string {
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
        this.roomService.deleteRecords(numSelected).subscribe((result) => {
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
    this.roomService.getAll().subscribe((data) => {
      // create custom json array from data that is array object
      let array = [];
      for (let key in data) {
        let object: any = {};
        object['id'] = data[key][0];
        object['name'] = data[key][1];
        object['floor'] = data[key][2];
        object['is_view'] = data[key][3];
        object['no_places'] = data[key][4];
        object['category_name'] = data[key][5];
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
    const room = this.form.value;
    this.create(room);
    //this.form.markAllAsTouched();
    this.form.reset();
  }

  loadToEdit(roomId: string) {
    this.roomService.getById(roomId).subscribe((room) => {
      this.massage = null;
      this.dataSaved = false;
      this.idUpdate = room.id;
      this.form.controls['name'].setValue(room.name);
      this.form.controls['category_id'].setValue(room.category_id);
      this.form.controls['is_view'].setValue(room.is_view);
      this.form.controls['floor'].setValue(room.floor);
      this.form.controls['no_places'].setValue(room.no_places);
      this.form.controls['note'].setValue(room.note);
    });
  }

  create(room: Room) {
    if (this.idUpdate == null) {
      if (room.is_view != true) room.is_view = this.boolIsView;

      this.roomService.create(room).subscribe(() => {
        this.dataSaved = true;
        this.savedOk(1);
        this.loadAll();
        this.idUpdate = null;
        this.form.reset();
      });
    } else {
      room.id = this.idUpdate;
      this.roomService.update(room.id.toString(), room).subscribe(() => {
        this.dataSaved = true;
        this.savedOk(0);
        this.loadAll();
        this.idUpdate = null;
        this.form.reset();
      });
    }
  }

  delete(roomId: string) {
    if (confirm('Are you sure you want to delete this?')) {
      this.roomService.deleteById(roomId).subscribe(() => {
        this.dataSaved = true;
        this.savedOk(2);
        this.loadAll();
        this.idUpdate = null;
        this.form.reset();
      });
    }
  }

  fillCategoryDDL() {
    this.allCategories = this.roomService.getAllCategories();
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
