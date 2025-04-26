import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { DepartmentComponent } from './pages/department/department.component';

export const routes: Routes = [
  {path:"", component:HomeComponent},
  {path:"department", component:DepartmentComponent},
  {path:"employee", component:EmployeeComponent},
];
