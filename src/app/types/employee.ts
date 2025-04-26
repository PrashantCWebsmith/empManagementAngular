import { IDepartment } from "./department";

export interface IEmployee {
  employeeIDP: number;
  employeeName: string;
  email: string;
  phone: string;
  jobTitle: string;
  gender: Gender | null;
  joiningDate: string;
  lastWorkingDate: string;
  dateOfBirth: string;
  departmentIDF?: number | null;
  department?: IDepartment;
}

export enum Gender{
  Male = 1,
  Female = 2
}
