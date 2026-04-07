import {Component, inject} from '@angular/core';
import {LoginComponent} from "./components/login/login.component";
import {Router, RouterOutlet} from "@angular/router";
import {AuthService} from "./services/auth.service";
import {HttpServiceService} from "./services/http-service.service";

@Component({
    selector: 'app-root',
  imports: [
    RouterOutlet
  ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  auth = inject(AuthService)
  router = inject(Router);
  http = inject(HttpServiceService)
  login(){
    this.router.navigate(['/login']);
  }

  logout(){
    this.http.logout()
  }
}
