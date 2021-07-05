import { EmbeddedTemplateAst, ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { EmployeeService } from 'src/services/employee.service';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  title = 'Employee';
  @Input() metaData: any;
  @Input() header: string;
  @Input() data:Observable<any>;
  rowData:[];
  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onRestore = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  //@Output() onAdd = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.data.subscribe(result=> { this.rowData = result;})
  }
  edit(employee: any) {
    this.onEdit.emit(employee);
  }
  restore(employee: any) {
    this.onRestore.emit(employee);
  }
  delete(employee: any) {
    this.onDelete.emit(employee);
  }
  // add() {
  //   this.onAdd.emit(null);
  // }
  clearObject(){}
}
