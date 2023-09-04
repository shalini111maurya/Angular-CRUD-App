import { Component, OnInit ,Inject} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-add-edit-form',
  templateUrl: './add-edit-form.component.html',
  styleUrls: ['./add-edit-form.component.css']
})
export class AddEditFormComponent implements OnInit{

  empForm: FormGroup; 

  education: string[]=[
    'Metric',
    'Intermediate',
    'Diploma',
    'Graduation',
    'Post Graduation'
  ]
  constructor(private _fb:FormBuilder, private empService:EmployeeService, 
    private _dialogRef :MatDialogRef<AddEditFormComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService){

    this.empForm = this._fb.group({
      firstName:'',
      lastName:'',
      dob:'',
      email:'',
      gender:'',
      experience:'',
      education:'',
      address:'',
      mobNumber:''
    })

  }
  ngOnInit(): void {
   this.empForm.patchValue(this.data)
  }

formSubmission(){
  if (this.empForm.valid) {
    if (this.data) {
      this.empService
        .updateEmployee(this.data.id, this.empForm.value)
        .subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Employee detail updated!','done');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
    } else {
      this.empService.addEmployee(this.empForm.value).subscribe({
        next: (val: any) => {
          this._coreService.openSnackBar('Employee added successfully','done');
          this._dialogRef.close(true);
        },
        error: (err: any) => {
          console.error(err);
        },
      });
    }
  }
}
}
