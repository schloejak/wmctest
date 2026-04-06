import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <div class="home-content">
        <h1>Welcome!</h1>
        
        @if (authService.user(); as username) {
          <p>You are logged in as: <strong>{{ username }}</strong></p>
        }
        
        <button (click)="logout()">Logout</button>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
    }
    
    .home-content {
      background: white;
      padding: 3rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    h1 {
      margin: 0 0 1rem;
    }
    
    p {
      margin: 0 0 2rem;
      color: #666;
    }
    
    button {
      padding: 0.75rem 2rem;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }
    
    button:hover {
      background: #c82333;
    }
  `]
})
export class HomeComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
