import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IDepartment } from '../../types/department';
import { DepartmentService } from '../../services/department.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ApiResponse } from '../../types/ApiResponse';
import { NgFor, NgIf } from '@angular/common';
import { IPaginationResponse, IPagingRequest } from '../../types/Pagination';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-department',
  imports: [ReactiveFormsModule, NgIf, NgFor, NgxDatatableModule, FormsModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css',
})

export class DepartmentComponent implements OnInit {
  departmentForm: FormGroup;
  departmentList: IDepartment[] = [];
  isEditMode: boolean = false;
  isFormVisible: boolean = false;

  // pagination variables
  departmentPagingList: IDepartment[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizes: number[] = [5, 10, 20, 50];
  searchValue = '';
  ColumnMode = ColumnMode;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService) {
    // Form group initialization with required fields
    this.departmentForm = this.fb.group({
      departmentIDP: [0],
      departmentName: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  // On initialization, load the departments
  ngOnInit(): void {
    this.loadDepartments();
    this.loadDepartmentsPaging();
  }

  // Load departments from the service
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


  loadDepartmentsPaging(): void {
    const request: IPagingRequest = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchValue: this.searchValue // You can bind this from input box
    };

    this.departmentService.getAllPaging(request).subscribe({
      next: (response: ApiResponse<IPaginationResponse<IDepartment[]>>) => {
        this.departmentPagingList = response.data?.data || [];
        this.totalRecords = response.data?.totalRecords || 0;
      },
      error: (error: any) => {
        console.error('Failed to load departments:', error);
      }
    });
  }


  onPage(event: any): void {
    this.currentPage = event.offset + 1;
    this.loadDepartmentsPaging();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadDepartmentsPaging();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadDepartmentsPaging();
  }

  // Method to handle the "Add New Department" action
  onAdd(): void {
    this.isEditMode = false;
    this.departmentForm.reset({
      departmentIDP: 0, // Reset ID for new department
      departmentName: '', // Clear department name for new department
    });
    this.isFormVisible = true; // Show form
  }

  // Method to handle the "Edit Department" action
  onEdit(department: IDepartment): void {
    this.isEditMode = true;
    this.departmentForm.setValue({
      departmentIDP: department.departmentIDP,
      departmentName: department.departmentName,
    });
    this.isFormVisible = true; // Show form
  }

  // Method to handle the "Delete Department" action
  onDelete(departmentId: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.delete(departmentId).subscribe({
        next: (response: ApiResponse<null>) => {
          if (response.success) {
            alert('Department deleted successfully!');
            this.loadDepartments(); // Reload department list after deletion
          } else {
            alert(response.message);
          }
        },
        error: (err) => {
          console.error('Error deleting department:', err);
          alert('Failed to delete department.');
        },
      });
    }
  }

  // Method to handle the form submission (Add or Edit department)
  onSubmit(): void {
    if (this.departmentForm.invalid) {
      return; // Exit if form is invalid
    }

    const departmentData: IDepartment = this.departmentForm.value;

    // Determine if we're adding or updating the department
    const saveOperation = this.isEditMode
      ? this.departmentService.update(departmentData) // Update department
      : this.departmentService.add(departmentData); // Add new department

    saveOperation.subscribe({
      next: (response: ApiResponse<IDepartment>) => {
        if (response.success) {
          this.loadDepartments(); // Reload the department list after save
          alert(
            this.isEditMode
              ? 'Department updated successfully!'
              : 'Department added successfully!'
          );
          this.onCancel(); // Reset form and table visibility
        } else {
          alert(response.message);
        }
      },
      error: (err) => {
        console.error('Error during save operation:', err);
        alert('An error occurred while saving the department.');
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
  this.departmentForm.reset({
    departmentIDP: 0,
    departmentName: '',
  });
}

  // Getter to access form controls (for convenience in HTML)
  get f() {
    return this.departmentForm.controls;
  }
}
