import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpServiceService} from "../../services/http-service.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
    http = inject(HttpServiceService);
    router = inject(Router);
    loginModel = new FormGroup({
      'username': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required),
    })

    onSubmit() {
      if (this.loginModel.valid) {
        const {username, password} = this.loginModel.value;

        if (username && password) {
          this.http.login(username, password).subscribe({
            next: () => this.router.navigate(['/expenses']),
          });
        }
      }
    }
}
