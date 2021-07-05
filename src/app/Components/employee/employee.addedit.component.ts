import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'employee-list',
  templateUrl: './employee.addedit.component.html',
})
export class EmployeeAddEditComponent implements OnInit {
  employeeForm: FormGroup;
  splittedAddress: any[];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.splittedAddress = data.address.split(',');
      this.employeeForm = fb.group({
        name: [data.name, Validators.required],
        street: [this.splittedAddress[0], Validators.required],
        suite: [this.splittedAddress[1], Validators.required],
        city: [this.splittedAddress[2], Validators.required],
        zipcode: [this.splittedAddress[3], Validators.required],
        company: [data.company, Validators.required],
      });
    } else {
      this.employeeForm = fb.group({
        name: [null, Validators.required],
        street: [null, Validators.required],
        suite: [null, Validators.required],
        city: [null, Validators.required],
        zipcode: [null, Validators.required],
        company: [null, Validators.required],
      });
    }
  }

  ngOnInit() {}

  onFormSubmit(f) {
  
    this.dialogRef.close(f);
  
  }
  close() {
    this.dialogRef.close();
  }
}
