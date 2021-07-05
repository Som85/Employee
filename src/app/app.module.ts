import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeListComponent } from './Components/employee/employee-list.component';
import { EmployeeService } from 'src/services/employee.service';
import { HttpClientModule } from '@angular/common/http';
import { ListComponent } from './Components/List/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeAddEditComponent } from './Components/employee/employee.addedit.component'; 
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AutoCompleteComponent } from './Components/autocomplete/autocomplete.component';

@NgModule({
  declarations: [AppComponent, EmployeeListComponent,  ListComponent,EmployeeAddEditComponent,AutoCompleteComponent],
  entryComponents:[EmployeeAddEditComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
   
    AppRoutingModule,

      HttpClientModule,
      
      ReactiveFormsModule,
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule,
      MatAutocompleteModule ,
      MatIconModule,
      MatButtonModule
      
      
    
    
  
  ],
  providers: [EmployeeService],
  bootstrap: [AppComponent]
})
export class AppModule {}
