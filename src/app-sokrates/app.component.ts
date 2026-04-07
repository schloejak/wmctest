import {Component, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
}
