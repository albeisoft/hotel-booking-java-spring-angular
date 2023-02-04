import { OnInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { StorageService } from '../_services/storage.service';

import { ClientService } from '../_services/client.service';
import { Client } from '../models/client';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit {
  content: any;
  isLoggedIn = false;
  errorMessage = '';
  clientId = 0;

  dataSaved = false;
  form: any;
  all!: Observable<Client[]>;
  dataSource!: MatTableDataSource<Client>;
  //dataSource!: MatTableDataSource<any>;

  selection = new SelectionModel<Client>(true, []);
  idUpdate = null;
  massage = null;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = [
    'select',
    'name',
    'telephone',
    'email',
    'address',
    'identification',
    'edit',
    'delete',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formbulider: FormBuilder,
    private clientService: ClientService,
    private storageService: StorageService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.loadAll();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    this.form = this.formbulider.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern('[a-zA-Z ]*'),
        ],
      ],
      telephone: [
        '',
        [Validators.required, Validators.pattern('[0-9]{10,15}')],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,14}$'),
        ],
      ],
      address: ['', [Validators.required, Validators.minLength(10)]],
      identification: [
        '',
        [Validators.required, Validators.pattern('[1-9][0-9]{14}')],
      ],
    });
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
  checkboxLabel(row: Client): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
  }

  deleteData() {
    //debugger;
    const numSelected = this.selection.selected;
    if (numSelected.length > 0) {
      if (confirm('Are you sure to delete items?')) {
        this.clientService
          .deleteRecords(numSelected)
          .subscribe((result: any) => {
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
    this.clientService.getAll().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onFormSubmit() {
    this.dataSaved = false;
    const client = this.form.value;
    this.create(client);
    this.form.reset();
  }

  loadToEdit(clientId: string) {
    this.clientService.getById(clientId).subscribe((client) => {
      this.massage = null;
      this.dataSaved = false;
      this.idUpdate = client.id;
      this.form.controls['name'].setValue(client.name);
      this.form.controls['telephone'].setValue(client.telephone);
      this.form.controls['address'].setValue(client.address);
      this.form.controls['email'].setValue(client.email);
      this.form.controls['identification'].setValue(client.identification);
    });
  }

  create(client: Client) {
    if (this.idUpdate == null) {
      // Insert
      this.clientService.create(client).subscribe(() => {
        this.dataSaved = true;
        this.savedOk(1);
        this.loadAll();
        this.idUpdate = null;
        this.form.reset();
      });
    } else {
      // Update
      client.id = this.idUpdate;
      this.clientService.update(client.id.toString(), client).subscribe(() => {
        this.dataSaved = true;
        this.savedOk(0);
        this.loadAll();
        this.idUpdate = null;
        this.form.reset();
      });
    }
  }

  delete(clientId: string) {
    if (confirm('Are you sure you want to delete this?')) {
      this.clientService.deleteById(clientId).subscribe(() => {
        this.dataSaved = true;
        this.savedOk(2);
        this.loadAll();
        this.idUpdate = null;
        this.form.reset();
      });
    }
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
