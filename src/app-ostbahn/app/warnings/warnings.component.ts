import {Component, OnInit, Signal, signal} from '@angular/core';
import {ApiService} from '../api.service';
import {Student, Subject, Warning} from '../response-types/api-responses';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-warnings',
  imports: [
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './warnings.component.html',
  styleUrl: './warnings.component.css',
})
export class WarningsComponent implements OnInit{
  latestWarnings = signal<Map<number, Map<string, Warning>>>(new Map());
  selectedStudentIds = new Set<number>();
  warningForm: FormGroup;
  now = Date.now();
  subjects: Signal<Subject[]> = signal([]);
  constructor(private readonly api: ApiService, private formBuilder: FormBuilder, private readonly auth: AuthService
  ) {
    this.warningForm = this.formBuilder.group({
      subject: [null]
    });
  }
  students= signal<Student[] | null>(null)


  ngOnInit(): void {
    this.reloadStudents();
    this.subjects = this.api.subjects;
    }

  send() {
    const students = this.students();
    const selectedSubject = this.warningForm.value.subject;

    if (students === null){
      return
    }


    const selectedStudents = students.filter(s =>
      this.selectedStudentIds.has(s.id)
    );

    selectedStudents.forEach(student => {
      const warning: Warning = {
        studentId: student.id,
        teacher: this.auth.user(),
        subject: selectedSubject.name,
        time: new Date()
      }
      this.api.saveWarning(warning).subscribe(() => {
        this.reloadStudents();
      });
    });
  }

  reloadStudents() {
    this.api.getAllStudents().subscribe(students => {
      this.students.set(students);
      const result = new Map<number, Map<string, Warning>>();

      students.forEach(student => {
        const subjectMap = new Map<string, Warning>();
        student.warnings?.forEach(warning => {
          const existing = subjectMap.get(warning.subject);
          if (!existing || new Date(warning.time) > new Date(existing.time)) {
            subjectMap.set(warning.subject, warning);
          }
        });
        result.set(student.id, subjectMap);
      });

      this.latestWarnings.set(result);
    });
  }

  protected readonly Date = Date;

  isSelected(id: number) {
    return this.selectedStudentIds.has(id)
  }

  toggle(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.now = Date.now();
      this.selectedStudentIds.add(id);
    } else {
      this.selectedStudentIds.delete(id);
    }
  }
}
