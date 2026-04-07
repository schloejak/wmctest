import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {

  loginForm: FormGroup;
  error = false;

  constructor(private readonly auth: AuthService,
              private readonly router: Router,
              formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      // todo remove for prod
      name: ['WEIX', Validators.required],
      password: ['pw', Validators.required],
    })
  }

  login() {
    return this.auth
      .login(this.loginForm.controls['name'].value, this.loginForm.controls['password'].value)
      .subscribe({
        next: () => this.router.navigateByUrl('/overview'),
        error: () => this.error = true
      });
  }
}
