import {Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Grade, Student, Subject, Warning} from './response-types/api-responses';
import {environment} from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.baseUrl;

  private readonly _subjects: WritableSignal<Subject[]> = signal([]);
  readonly subjects = this._subjects.asReadonly();

  constructor(private readonly http: HttpClient) {
  }

  getAllStudents() {
    return this.http
      .get<Student[]>(`${this.baseUrl}/students`);
  }

  saveGrade(grade: Grade) {
    return this.http
      .post<Grade>(`${this.baseUrl}/grades`, grade);
  }

  loadSubjects() {
    this.http
      .get<Subject[]>(`${this.baseUrl}/subjects`)
      .subscribe(subjects => this._subjects.set(subjects));
  }

  getStudent(id: number) {
    return this.http
      .get<Student>(`${this.baseUrl}/students/${id}`);
  }

  saveWarning(warning: Warning) {
    return this.http
      .post<Warning>(`${this.baseUrl}/warnings`, warning);
  }
}
