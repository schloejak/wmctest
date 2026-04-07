import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {OverviewComponent} from './overview/overview.component';
import {ReservationComponent} from './reservation/reservation.component';
import {AuthGuard} from './auth.guard';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'book/:id', component: ReservationComponent, canActivate: [AuthGuard]},
  {path: '', component: OverviewComponent},
  {path: '**', redirectTo:'', pathMatch: "full"}
];
