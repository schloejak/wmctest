import {Component, signal} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  errorMessage = signal('')
  loginForm: FormGroup;
  constructor(private auth:AuthService, private router: Router, private fb: FormBuilder) {
    this.loginForm = new FormGroup({
      username: new FormControl('demo@demo.com', Validators.required),
      password: new FormControl('demo', Validators.required)
    })
  }


  login() {
    this.auth.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
      next: () => {this.router.navigate(['/overview'])},
      error: () => {this.errorMessage.set("Fehlerhafte Logindaten")}
      }
    )
  }
}
