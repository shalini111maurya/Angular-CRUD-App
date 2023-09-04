import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditFormComponent } from './add-edit-form/add-edit-form.component';
import { EmployeeService } from './services/employee.service';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort'
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { CoreService } from './core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  displayedColumns: string[] = [
    'id',
    'firstName', 
    'lastName', 
    'email',
    'education',
    'experience',
    'dob',
    'gender',
    'address',
    'mobNumber',
    'action'
  ];
  dataSource  = new MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  employeeData : []|undefined

  constructor(private _dialogue: MatDialog, private empData:EmployeeService, private _coreService:CoreService){
  }
  ngOnInit(): void {
   this.getEmployee();
  }


  openEmpForm(){
    const dialogRef = this._dialogue.open(AddEditFormComponent);
    dialogRef.afterClosed().subscribe((result=>{
      if(result){
        this.getEmployee();
      }
    }))
  }

  getEmployee(){
  this.empData.getEmployee().subscribe({
    next: (res) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    },
    error: console.log,
  });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openEditForm(data:any){
    const dialogRef = this._dialogue.open(AddEditFormComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployee();
        }
      },
    });

  }
  deleteEmployee(id:any){
    this.empData.deleteEmployee(id).subscribe((result=>{
      // alert('data deleted sucessfully')
      this._coreService.openSnackBar('data deleted sucessfully','done')
      this.getEmployee();
    }))
  }
}


