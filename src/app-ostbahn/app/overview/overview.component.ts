import {Component, signal} from '@angular/core';
import {Student} from '../response-types/api-responses';
import {ApiService} from '../api.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-overview',
  imports: [
    RouterLink
  ],
  templateUrl: './overview.component.html',
})
export class OverviewComponent {

  students = signal<Student[]>([]);

  constructor(private readonly api: ApiService) {
    api.getAllStudents()
      .subscribe(students => {
        this.students.set(students);
      });
  }
}
