import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEmployee } from '../types/employee';
import { ApiResponse } from '../types/ApiResponse';
import { IPaginationResponse, IPagingRequest } from '../types/Pagination';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
 private readonly baseUrl = `${environment.apiUrl}/employee`;

 constructor(private http: HttpClient) {}

 /** Get all employees */
 getAll(): Observable<ApiResponse<IEmployee[]>> {
  return this.http.get<ApiResponse<IEmployee[]>>(this.baseUrl);
}

 /** Get paginated employees with search filter */
 getAllPaging(model: IPagingRequest): Observable<ApiResponse<IPaginationResponse<IEmployee[]>>> {
  return this.http.post<ApiResponse<IPaginationResponse<IEmployee[]>>>(`${this.baseUrl}/paging`, model);
}

/** Get employee by ID */
get(id: number): Observable<ApiResponse<IEmployee>> {
  return this.http.get<ApiResponse<IEmployee>>(`${this.baseUrl}/${id}`);
}

/** Add or Update employee */
save(employee: IEmployee): Observable<ApiResponse<IEmployee>> {
  return this.http.post<ApiResponse<IEmployee>>(this.baseUrl, employee);
}

/** Add a new employee */
add(employee: IEmployee): Observable<ApiResponse<IEmployee>> {
  return this.http.post<ApiResponse<IEmployee>>(this.baseUrl, employee);
}

/** Update an existing employee */
update(employee: IEmployee): Observable<ApiResponse<IEmployee>> {
  return this.http.put<ApiResponse<IEmployee>>(
    `${this.baseUrl}/${employee.employeeIDP}`,
    employee
  );
}

/** Delete a employee */
delete(id: number): Observable<ApiResponse<null>> {
  return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
}

}
