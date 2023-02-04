import { OnInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { StorageService } from '../_services/storage.service';

import { CategoryService } from '../_services/category.service';
import { Category } from '../models/category';

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

/*
export interface Category {
  id: number;
  name: string;
  price: number;
}
*/

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  content: any;
  isLoggedIn = false;
  errorMessage = '';
  categoryId = 0;

  dataSaved = false;
  categoryForm: any;
  allCategories!: Observable<Category[]>;
  dataSource!: MatTableDataSource<Category>;
  //dataSource!: MatTableDataSource<any>;
  //dataSourceEmpty = [];

  selection = new SelectionModel<Category>(true, []);
  categoryIdUpdate = null;
  massage = null;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = ['select', 'name', 'price', 'edit', 'delete'];

  // query results available in ngOnInit
  //@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  // or query results available in ngAfterViewInit
  //@ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  //@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  //@ViewChild(MatSort, { static: true }) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formbulider: FormBuilder,
    private categoryService: CategoryService,
    private storageService: StorageService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.loadAllCategories();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    this.categoryForm = this.formbulider.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required, Validators.min(10)]],
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
  checkboxLabel(row: Category): string {
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
        this.categoryService
          .deleteRecords(numSelected)
          .subscribe((result: any) => {
            this.savedOk(2);
            this.loadAllCategories();
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

  loadAllCategories() {
    this.categoryService.getAllCategories().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onFormSubmit() {
    this.dataSaved = false;
    const category = this.categoryForm.value;
    this.createCategory(category);
    this.categoryForm.reset();
  }

  loadCategoryToEdit(categoryId: string) {
    this.categoryService.getCategoryById(categoryId).subscribe((category) => {
      this.massage = null;
      this.dataSaved = false;
      this.categoryIdUpdate = category.id;
      this.categoryForm.controls['name'].setValue(category.name);
      this.categoryForm.controls['price'].setValue(category.price);
    });
  }

  createCategory(category: Category) {
    if (this.categoryIdUpdate == null) {
      // Insert
      this.categoryService.createCategory(category).subscribe({
        next: (data) => {
          this.errorMessage = '';
          this.dataSaved = true;
          this.savedOk(1);
          this.loadAllCategories();
          this.categoryIdUpdate = null;
          this.categoryForm.reset();
        },
        error: (err: any) => {
          //console.log('err # ' + JSON.stringify(err));
          //console.log('err.error # ' + JSON.stringify(err.error));
          if (err.error) {
            try {
              const res = JSON.parse(err.error);
              this.errorMessage = res.message;
            } catch {
              //this.errorMessage = `Error with status #: ${err.status} - ${err.statusText}`;
              // get server error for Name from errors[0] (that is error for 1st form input field)
              this.errorMessage = `Error: ${err.error.errors[0].defaultMessage}`;
            }
          } else {
            this.errorMessage = `Error with status: ${err.status}`;
          }
        },
        complete: () => {
          // this.message = 'complete';
        },
      });

      /*
      this.categoryService.createCategory(category).subscribe(() => {
        this.dataSaved = true;
        this.savedOk(1);
        this.loadAllCategories();
        this.categoryIdUpdate = null;
        this.categoryForm.reset();
      });
      */
    } else {
      // Update
      category.id = this.categoryIdUpdate;
      this.categoryService
        .updateCategory(category.id.toString(), category)
        .subscribe(() => {
          this.dataSaved = true;
          this.savedOk(0);
          this.loadAllCategories();
          this.categoryIdUpdate = null;
          this.categoryForm.reset();
        });
    }
  }

  deleteCategory(categoryId: string) {
    if (confirm('Are you sure you want to delete this?')) {
      this.categoryService.deleteCategoryById(categoryId).subscribe(() => {
        this.dataSaved = true;
        this.savedOk(2);
        this.loadAllCategories();
        this.categoryIdUpdate = null;
        this.categoryForm.reset();
      });
    }
  }

  resetForm() {
    //this.categoryForm.markAllAsTouched();
    this.categoryForm.reset();
    this.massage = null;
    this.dataSaved = false;
    this.loadAllCategories();
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
