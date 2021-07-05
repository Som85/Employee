import {
  EmbeddedTemplateAst,
  ThrowStmt,
  tokenReference,
} from '@angular/compiler';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnChanges,
  AfterViewInit,
} from '@angular/core';
import { ControlContainer, FormControl, NgForm } from '@angular/forms';
import { from, observable, Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  observeOn,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';

import { EmployeeService } from 'src/services/employee.service';

@Component({
  selector: 'auto-complete',
  exportAs: 'auto-complete',
  templateUrl: './autocomplete.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  encapsulation: ViewEncapsulation.None,
})
export class AutoCompleteComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() options: any;
  @Output() selectedObjectChange = new EventEmitter();  

  @Input() data: Observable<any>;
  @Input() selectedObject: any = null;
  myControl = new FormControl();  
  filteredOptions: Observable<any>;
  public ObjList: Observable<any>;  
  tempOptions: any;
  constructor() {}

  ngAfterViewInit() {
  }

  ngOnInit() {  
    this.data.subscribe((result) => {
      this.tempOptions = result; 
      this.filteredOptions = this.myControl.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map((inputValue) => this._filter(inputValue))
      );
    });    
  }
  private _filter(value: string): any[] {   
    if (!value) return this.tempOptions;
    return this.tempOptions.filter((elem: any) =>
      elem[this.options.field].toLowerCase().includes(value)
    );
  }
  ngOnChanges() {   
  }

  clearObject() {
    this.myControl.setValue('');    
    this.selectedObject = null;
    this.selectedObjectChange.emit( this.selectedObject);
  }

  ObjectSelected(selectedValue: any) {
    this.selectedObject = selectedValue.option.value;
    this.selectedObjectChange.emit(this.selectedObject);
  }
  GetObjectValue(obj: any, displayProp: string) {}
}
