import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { Employee } from 'src/objects/Employee';
import { filter, map } from 'rxjs/operators';
@Injectable()
export class EmployeeService {
  private APIUrl = ' https://jsonplaceholder.typicode.com/users';
  private _employeeData = new Array<Employee>();
  private _activeEmployeeSubject = new BehaviorSubject<any>(null);
  private _deletedEmployeeSubject = new BehaviorSubject<any>(null);
  private _activeEmployeeSearchSubject = new BehaviorSubject<any>(null);
  private _deletedEmployeeSearchSubject = new BehaviorSubject<any>(null);

  private activeEmployeeSearchCriteria = {
    name: null,
    address: null,
    company: null,
  };
  private deletedEmployeeSearchCriteria = {
    name: null,
    address: null,
    company: null,
  };

  constructor(private http: HttpClient) {}
  public getEmployees(): void {
    this.http.get(this.APIUrl).subscribe((result: any[]) => {
      this._employeeData = result.map((elem) => ({
        id: elem.id,
        name: elem.name,
        address: `${elem.address.street},${elem.address.suite},${elem.address.city},${elem.address.zipcode}`,
        company: elem.company.name,
        deleted: false,
      }));
      this._activeEmployeeSubject.next(this._employeeData);
      this._activeEmployeeSearchSubject.next(this._employeeData);
    });
  }

  public getActiveEmployees(): Observable<Employee[]> {
    return this._activeEmployeeSubject.asObservable();
  }

  public getActiveSearchOptions(): Observable<Employee[]> {
    return this._activeEmployeeSearchSubject.asObservable();
  }

  public getDeletedSearchOptions(): Observable<Employee[]> {
    return this._deletedEmployeeSearchSubject.asObservable();
  }

  public getDeletedEmployees(): Observable<Employee[]> {
    return this._deletedEmployeeSubject.asObservable();
  }

  public restoreEmployee(employee: Employee) {
    const EmployeeToBeRestore = this._employeeData.find(
      (t) => t.id === employee.id
    );
    EmployeeToBeRestore.deleted = false;
    this._activeEmployeeSearchSubject.next(
      this._employeeData.filter((elem) => !elem.deleted)
    );
    this._deletedEmployeeSearchSubject.next(
      this._employeeData.filter((elem) => elem.deleted)
    );
    this.search(
      this._activeEmployeeSubject,
      false,
      this.activeEmployeeSearchCriteria
    );
    this.search(
      this._deletedEmployeeSubject,
      true,
      this.deletedEmployeeSearchCriteria
    );
  }

  public deleteEmployee(employee: Employee): void {
    const deletedEmployee = this._employeeData.find(
      (t) => t.id === employee.id
    );
    deletedEmployee.deleted = true;

    this._activeEmployeeSearchSubject.next(
      this._employeeData.filter((elem) => !elem.deleted)
    );
    this._deletedEmployeeSearchSubject.next(
      this._employeeData.filter((elem) => elem.deleted)
    );
    this.search(
      this._activeEmployeeSubject,
      false,
      this.activeEmployeeSearchCriteria
    );
    this.search(
      this._deletedEmployeeSubject,
      true,
      this.deletedEmployeeSearchCriteria
    );
  }

  public add(employee: any, id: number) {
    this._employeeData.push({
      id: id,
      name: employee.name,
      company: employee.company,
      address: `${employee.street},${employee.suite},${employee.city},${employee.zipcode}`,
      deleted: false,
    });
    this.search(
      this._activeEmployeeSubject,
      false,
      this.activeEmployeeSearchCriteria
    );
  }

  public update(employee: any) {
    this._employeeData.forEach((elem) => {
      if (elem.id === employee.id) {
        elem.name = employee.name;
        elem.company = employee.company;
        elem.address = `${employee.street},${employee.suite},${employee.city},${employee.zipcode}`;
      }
    });
  }

  private search(
    subject: BehaviorSubject<any>,
    isDeleted: boolean,
    searchCriteria: any
  ) {
    // of(this._employeeData.filter((elem) => elem.deleted === isDeleted))
    //   .pipe(
    //     map((data: any) => {
    //       let tempData = data;
    //       if (searchCriteria.name) {
    //         tempData = tempData.filter((elem) =>
    //           elem.name.includes(searchCriteria.name)
    //         );
    //       }
    //       if (searchCriteria.address) {
    //         tempData = tempData.filter((elem) =>
    //           elem.address.includes(searchCriteria.address)
    //         );
    //       }
    //       if (searchCriteria.company) {
    //         tempData = tempData.filter((elem) =>
    //           elem.company.includes(searchCriteria.company)
    //         );
    //       }
    //       return tempData;
    //     }),
    //     map((data) => console.log(data))
    //   )
    //   .subscribe((result) => subject.next(result));

    const tempData = this._employeeData.filter(
      (elem) => elem.deleted === isDeleted
    );

    const initialObs$ = of(
      !searchCriteria.name && !searchCriteria.address && !searchCriteria.company
        ? tempData
        : []
    );
    const firstObs$ = of(
      searchCriteria.name
        ? tempData.filter((elem) => elem.name.includes(searchCriteria.name))
        : []
    );
    const secondObs$ = of(
      searchCriteria.address
        ? tempData.filter((elem) =>
            elem.address.includes(searchCriteria.address)
          )
        : []
    );
    const thirdObs$ = of(
      searchCriteria.company
        ? tempData.filter((elem) =>
            elem.company.includes(searchCriteria.company)
          )
        : []
    );

    combineLatest([initialObs$,firstObs$, secondObs$, thirdObs$]).subscribe(
      ([initialResult, firstResult, secondResult, thirdResult]) => {
        const finalresult = [];
        if (initialResult && initialResult.length > 0)
          initialResult.forEach((elem) => finalresult.push(elem));
        if (firstResult && firstResult.length > 0)
          firstResult.forEach((elem) => finalresult.push(elem));
        if (secondResult && secondResult.length > 0)
          secondResult.forEach((elem) => finalresult.push(elem));
        if (thirdResult && thirdResult.length > 0)
          thirdResult.forEach((elem) => finalresult.push(elem));
        subject.next(finalresult);
      }
    );
  }
  public performActiveEmployeeSearch(field?: string, value?: string) {
    this.activeEmployeeSearchCriteria[field] = value;
    this.search(
      this._activeEmployeeSubject,
      false,
      this.activeEmployeeSearchCriteria
    );
  }

  public performDeletedEmployeeSearch(field?: string, value?: string) {
    this.deletedEmployeeSearchCriteria[field] = value;
    this.search(
      this._deletedEmployeeSubject,
      true,
      this.deletedEmployeeSearchCriteria
    );
  }
}
