import { NgFor, NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-table',
  imports: [MatTableModule, NgIf, NgFor, NgForOf],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
@Input() data: any[] = [];
@Input() displayedColumns: { label: string; key: string }[] = [];

@Output() edit = new EventEmitter<any>();
@Output() delete = new EventEmitter<any>();

onEdit(row: any) {
  this.edit.emit(row);
}

onDelete(row: any) {
  this.delete.emit(row);
}


get columnKeys(): string[] {
  return this.displayedColumns.map(col => col.key);
}

}
