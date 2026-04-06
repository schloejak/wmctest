import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendService } from './backend.service';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-backend-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container">
      <h2>Backend Service Demo</h2>
      <p class="subtitle">Using Signals for reactive state management</p>
      
      <div class="actions">
        <button (click)="getUsers()">Get Users</button>
        <button (click)="createUser()">Create User</button>
        <button (click)="updateUser()">Update User</button>
        <button (click)="deleteUser()">Delete User</button>
      </div>
      
      @if (backendService.loading()) {
        <div class="loading">Loading...</div>
      }
      
      @if (backendService.error()) {
        <div class="error">
          {{ backendService.error() }}
          <button (click)="backendService.clearError()">✕</button>
        </div>
      }
      
      @if (response()) {
        <div class="response">
          <h3>Response:</h3>
          <pre>{{ response() | json }}</pre>
        </div>
      }
      
      <div class="info">
        <h3>Features:</h3>
        <ul>
          <li>✅ Global loading state with Signal</li>
          <li>✅ Global error state with Signal</li>
          <li>✅ Automatic loading/error management</li>
          <li>✅ Type-safe API calls</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .subtitle {
      color: #666;
      margin-bottom: 2rem;
    }
    
    .actions {
      display: flex;
      gap: 1rem;
      margin: 2rem 0;
      flex-wrap: wrap;
    }
    
    button {
      padding: 0.75rem 1.5rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:hover {
      background: #0056b3;
    }
    
    .loading, .error, .response, .info {
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 4px;
    }
    
    .loading {
      background: #e3f2fd;
      color: #1976d2;
      font-weight: 500;
    }
    
    .error {
      background: #ffebee;
      color: #c62828;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .error button {
      background: transparent;
      color: #c62828;
      padding: 0.25rem 0.5rem;
      font-size: 1.2rem;
    }
    
    .response {
      background: #f5f5f5;
      border: 1px solid #ddd;
    }
    
    .info {
      background: #e8f5e9;
      border-left: 4px solid #4caf50;
    }
    
    .info ul {
      margin: 0.5rem 0 0;
      padding-left: 1.5rem;
    }
    
    .info li {
      margin: 0.5rem 0;
    }
    
    pre {
      overflow-x: auto;
      margin: 0.5rem 0 0;
    }
  `]
})
export class BackendDemoComponent {
  backendService = inject(BackendService);
  response = signal<any>(null);

  getUsers() {
    this.response.set(null);
    
    this.backendService.get<User[]>('/users').subscribe({
      next: (users) => this.response.set(users)
    });
  }

  createUser() {
    this.response.set(null);
    
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    this.backendService.post<User>('/users', newUser).subscribe({
      next: (user) => this.response.set(user)
    });
  }

  updateUser() {
    this.response.set(null);
    
    const updatedUser = {
      name: 'Jane Doe',
      email: 'jane@example.com'
    };
    
    this.backendService.put<User>('/users/1', updatedUser).subscribe({
      next: (user) => this.response.set(user)
    });
  }

  deleteUser() {
    this.response.set(null);
    
    this.backendService.delete<void>('/users/1').subscribe({
      next: () => this.response.set({ message: 'User deleted successfully' })
    });
  }
}
