import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDepartment } from '../types/department';
import { ApiResponse } from '../types/ApiResponse';
import { environment } from '../../environments/environment';
import { IPaginationResponse, IPagingRequest } from '../types/Pagination';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly baseUrl = `${environment.apiUrl}/Department`;

  constructor(private http: HttpClient) {}

  /** Get all departments */
  getAll(): Observable<ApiResponse<IDepartment[]>> {
    return this.http.get<ApiResponse<IDepartment[]>>(this.baseUrl);
  }

   /** Get paginated departments with search filter */
   getAllPaging(model: IPagingRequest): Observable<ApiResponse<IPaginationResponse<IDepartment[]>>> {
    return this.http.post<ApiResponse<IPaginationResponse<IDepartment[]>>>(`${this.baseUrl}/paging`, model);
  }

  /** Get department by ID */
  get(id: number): Observable<ApiResponse<IDepartment>> {
    return this.http.get<ApiResponse<IDepartment>>(`${this.baseUrl}/${id}`);
  }

  /** Add or Update department */
  save(department: IDepartment): Observable<ApiResponse<IDepartment>> {
    return this.http.post<ApiResponse<IDepartment>>(this.baseUrl, department);
  }

  /** Add a new department */
  add(department: IDepartment): Observable<ApiResponse<IDepartment>> {
    return this.http.post<ApiResponse<IDepartment>>(this.baseUrl, department);
  }

  /** Update an existing department */
  update(department: IDepartment): Observable<ApiResponse<IDepartment>> {
    return this.http.put<ApiResponse<IDepartment>>(
      `${this.baseUrl}/${department.departmentIDP}`,
      department
    );
  }

  /** Delete a department */
  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }
}
