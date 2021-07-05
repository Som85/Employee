import { EmbeddedTemplateAst, ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { EmployeeService } from 'src/services/employee.service';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { EmployeeAddEditComponent } from './employee.addedit.component';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
} from 'rxjs/operators';
import { Observable, Subject, of, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Employee } from 'src/objects/Employee';

@Component({
  selector: 'employee-list',
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
  employeeListMetaData = { 
    edit: true,
    delete: true,
    restore: false,
    columns: [
      {
        field: 'name',
        label: 'Name',
      },
      {
        field: 'address',
        label: 'Address',
      },
      {
        field: 'company',
        label: 'Company',
      },
      {
        field: 'actions',
        label: 'Actions',
      },
    ],
  };

  deletedEmployeeListMetaData = {
    header: 'Deleted Employee List',   
    edit: false,
    delete: false,
    restore: true,
    columns: [
      {
        field: 'name',
        label: 'Name',
      },
      {
        field: 'address',
        label: 'Address',
      },
      {
        field: 'company',
        label: 'Company',
      },
      {
        field: 'actions',
        label: 'Actions',
      },
    ],
  };   

  nextId: number;

  constructor(
    private employeeService: EmployeeService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.employeeService.getEmployees();
 
  }

  edit(employee: Employee) {   
    const employeeToBeEdited = employee;
    let dialogRef = this.dialog.open(EmployeeAddEditComponent, {
      width: '50vw',
      data: employee,
    });    
    dialogRef.afterClosed().subscribe((result: any) => {    
      this.employeeService.update({
        ...result,
        ...{ id: employeeToBeEdited.id },
      });
    });
  }
  delete(employee: Employee) {   
    this.employeeService.deleteEmployee(employee);
  }

  restore(employee: Employee) {   
    this.employeeService.restoreEmployee(employee);
  }

  add() {
    let dialogRef = this.dialog.open(EmployeeAddEditComponent, {
      width: '50vw',
      data: null,
    });
    dialogRef.afterClosed().subscribe((result: any) => {   
      this.employeeService.add(result, this.nextId);
      this.nextId += 1;
    });
  }
 
  getActiveEmployees(): Observable<any> {
    return this.employeeService.getActiveEmployees();   
  }
  getDeletedEmployees(): Observable<any> {   
    return this.employeeService.getDeletedEmployees();
  }

  filterActiveEmployees(field:string, selectedValue: string) {  
    this.employeeService.performActiveEmployeeSearch(field, selectedValue);
  }

  filterDeletedEmployees(field:string, selectedValue: string) {  
    this.employeeService.performDeletedEmployeeSearch(field, selectedValue);
  }  
  getActiveEmplpoyeesSearchOptions()
  {
    return this.employeeService.getActiveSearchOptions();
  }

  getDeletedEmplpoyeesSearchOptions()
  {
    return this.employeeService.getDeletedSearchOptions();
  }
}
