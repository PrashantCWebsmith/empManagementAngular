import { Component, OnInit } from '@angular/core';
import { IEmployee } from '../../types/employee';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { ApiResponse } from '../../types/ApiResponse';
import { NgFor, NgIf } from '@angular/common';
import { IDepartment } from '../../types/department';
import { DepartmentService } from '../../services/department.service';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-employee',
  imports: [ReactiveFormsModule, NgIf, NgFor, TableComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employeeList: IEmployee[] = [];
  departmentList: IDepartment[] = [];

  //reuse table component
  showCols = [
    { label: '#', key: 'employeeIDP' },
    { label: 'Name', key: 'employeeName' },
    { label: 'Email', key: 'email' },
    { label: 'Phone', key: 'phone' },
    { label: 'Actions', key: 'actions' }
  ];


  private defaultEmployee: IEmployee = {
    employeeIDP: 0,
    employeeName: '',
    email: '',
    phone: '',
    jobTitle: '',
    gender: null,
    joiningDate: '',
    lastWorkingDate: '',
    dateOfBirth: '',
    departmentIDF: null
  };

  isEditMode: boolean = false;
  isFormVisible: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      employeeIDP: [0], // Default value when adding new employee
      employeeName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Assuming 10 digits for phone
      jobTitle: ['', [Validators.required, Validators.minLength(3)]],
      gender: [null, [Validators.required]],
      joiningDate: ['', Validators.required],
      lastWorkingDate: [''],
      dateOfBirth: ['', Validators.required],
      departmentIDF: [null], // Optional: Validate department if necessary
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDepartments();
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (response: ApiResponse<IEmployee[]>) => {
        if (response.success) {
          this.employeeList = response.data || [];
        } else {
          alert(response.message);
        }
      },
      error: (err) => {
        console.error('Failed to load employees:', err);
        alert('Error loading employees. Please try again.');
      },
    });
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (response: ApiResponse<IDepartment[]>) => {
        if (response.success) {
          this.departmentList = response.data || [];
        } else {
          alert(response.message);
        }
      },
      error: (err) => {
        console.error('Failed to load departments:', err);
        alert('Error loading departments. Please try again.');
      },
    });
  }

  onAdd(): void {
    this.isEditMode = false;
    this.employeeForm.reset({ ...this.defaultEmployee });
    this.isFormVisible = true;
  }

  onEdit(employee: IEmployee) {
    this.isEditMode = true;
    this.employeeForm.setValue({ ...employee });
    this.isFormVisible = true;
  }

  // Method to handle the "Delete Department" action
  onDelete(employeeId: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.delete(employeeId).subscribe({
        next: (response: ApiResponse<null>) => {
          if (response.success) {
            alert('Employee deleted successfully!');
            this.loadEmployees(); // Reload employee list after deletion
          } else {
            alert(response.message);
          }
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
          alert('Failed to delete department.');
        },
      });
    }
  }

  // Method to handle the form submission (Add or Edit employee)
onSubmit(): void {
  if (this.employeeForm.invalid) {
    return; // Exit if form is invalid
  }

  const employeeData: IEmployee = this.employeeForm.value;

  const saveOperation = this.isEditMode
    ? this.employeeService.update(employeeData) // Update employee
    : this.employeeService.add(employeeData);   // Add new employee

  saveOperation.subscribe({
    next: (response: ApiResponse<IEmployee>) => {
      if (response.success) {
        this.loadEmployees(); // Reload the employee list after save
        alert(
          this.isEditMode
            ? 'Employee updated successfully!'
            : 'Employee added successfully!'
        );
        this.onCancel(); // Reset form and hide it
      } else {
        alert(response.message);
      }
    },
    error: (err) => {
      console.error('Error during save operation:', err);
      alert('An error occurred while saving the employee.');
    },
  });
}

// Method to cancel the form action and reset it
onCancel(): void {
  this.resetForm();
  this.isFormVisible = false;
}

 // Reset form to default state
 resetForm(): void {
  this.isEditMode = false;
  this.employeeForm.reset({
   ...this.defaultEmployee
  });
}
  // Getter to access form controls (for convenience in HTML)
  get f() {
    return this.employeeForm.controls;
  }
}
