import {Component, Signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html'
})
export class AppComponent {

  user: Signal<string>;

  constructor(private readonly auth: AuthService) {
    this.user = auth.user;
  }

  logout() {
    this.auth.logout();
  }
}
