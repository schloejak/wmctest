import {Component, OnInit, Signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Student} from '../response-types/api-responses';
import {ApiService} from '../api.service';
import { signal } from '@angular/core';
import {CommonModule} from '@angular/common';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-student',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student.component.html'
})
export class StudentComponent implements OnInit{
  detailStudentFormGroup: FormGroup;

  constructor(private route: ActivatedRoute, private readonly api: ApiService) {
    this.detailStudentFormGroup = new FormGroup({
      flag5FormControl: new FormControl(false),
      studentComments: new FormArray([])
    })
  }

  studentId: number | null = null;
  student = signal<Student | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.studentId = Number(params.get('id'));

      if (this.studentId){
         this.api.getStudent(this.studentId).subscribe(
           student => this.student.set(student)
         );
      }
    })

  }

  get studentComments(){
    return this.detailStudentFormGroup.get("studentComments") as FormArray
  }


  addComment() {
    this.studentComments.push(new FormGroup({
        ratingComment: new FormControl('')
      }
    ))
  }
}
