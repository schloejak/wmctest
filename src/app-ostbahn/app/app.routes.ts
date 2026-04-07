import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {OverviewComponent} from './overview/overview.component';
import {GradesComponent} from './grades/grades.component';
import {AuthGuard} from './auth.guard';
import {StudentComponent} from './student/student.component';
import {WarningsComponent} from './warnings/warnings.component';

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'overview', component: OverviewComponent, canActivate: [AuthGuard]},
  {path: 'students/:id', component: StudentComponent, canActivate: [AuthGuard]},
  {path: 'grades', component: GradesComponent, canActivate: [AuthGuard]},
  {path: 'warnings', component: WarningsComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: 'overview'},
];
