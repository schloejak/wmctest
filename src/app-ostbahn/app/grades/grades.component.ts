import {Component, computed, OnInit, signal, Signal} from '@angular/core';
import {Grade, Student} from '../response-types/api-responses';
import {ApiService} from '../api.service';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-grades',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './grades.component.html'
})
export class GradesComponent{

  students: Student[] = [];
  subjects: Signal<string[]>;
  gradeForm: FormGroup;

  constructor(private readonly api: ApiService, formBuilder: FormBuilder,
              private readonly auth: AuthService) {
    this.subjects = computed(() => api.subjects().map(s => s.name));
    this.gradeForm = formBuilder.group({
      subject: formBuilder.control(this.subjects()[0]),
      grades: formBuilder.array([])
    });
    api.getAllStudents()
      .subscribe(students => {
        this.students = students;
        const firstSubject = this.subjects()[0];
        if (firstSubject) {
          this.subject.setValue(firstSubject);
        }
        this.initializeGrades(formBuilder);
      });
    this.subject.valueChanges.subscribe(() => {
      this.grades.clear();
      this.initializeGrades(formBuilder);
    });
  }

  get grades(): FormArray {
    return this.gradeForm.get('grades') as FormArray;
  }

  get subject(): FormControl {
    return this.gradeForm.get('subject') as FormControl;
  }

  initializeGrades(formBuilder: FormBuilder) {
    this.grades.clear();
    this.students.forEach((student) => {
      let value = '-';
      if (student.grades !== null){
        const existingGrade = student.grades.find(g => g.subject === this.subject.value)
        if (existingGrade) {
          value = String(existingGrade.value);
        }
      }
      this.grades.push(formBuilder.control(value));
    });
  }

  grade() {
    const givenGrades = this.grades.value;
    for (let i = 0; i < givenGrades.length; i++) {
      if (givenGrades[i] === '-')
        continue;
      const grade: Grade = {
        studentId: this.students[i].id,
        subject: this.subject.value,
        teacher: this.auth.user(),
        value: givenGrades[i]
      };
      this.api.saveGrade(grade).subscribe(() => {
        this.students[i].grades.push(grade);
      });
    }
  }
}
