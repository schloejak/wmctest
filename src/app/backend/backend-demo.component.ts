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
      
      <div class="actions">
        <button (click)="getUsers()">Get Users</button>
        <button (click)="createUser()">Create User</button>
        <button (click)="updateUser()">Update User</button>
        <button (click)="deleteUser()">Delete User</button>
      </div>
      
      @if (loading()) {
        <div class="loading">Loading...</div>
      }
      
      @if (error()) {
        <div class="error">{{ error() }}</div>
      }
      
      @if (response()) {
        <div class="response">
          <h3>Response:</h3>
          <pre>{{ response() | json }}</pre>
        </div>
      }
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
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
    
    .loading, .error, .response {
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 4px;
    }
    
    .loading {
      background: #e3f2fd;
      color: #1976d2;
    }
    
    .error {
      background: #ffebee;
      color: #c62828;
    }
    
    .response {
      background: #f5f5f5;
      border: 1px solid #ddd;
    }
    
    pre {
      overflow-x: auto;
      margin: 0.5rem 0 0;
    }
  `]
})
export class BackendDemoComponent {
  private backendService = inject(BackendService);
  
  loading = signal(false);
  error = signal('');
  response = signal<any>(null);

  getUsers() {
    this.loading.set(true);
    this.error.set('');
    
    this.backendService.get<User[]>('/users').subscribe({
      next: (users) => {
        this.loading.set(false);
        this.response.set(users);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Failed to fetch users');
      }
    });
  }

  createUser() {
    this.loading.set(true);
    this.error.set('');
    
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    this.backendService.post<User>('/users', newUser).subscribe({
      next: (user) => {
        this.loading.set(false);
        this.response.set(user);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Failed to create user');
      }
    });
  }

  updateUser() {
    this.loading.set(true);
    this.error.set('');
    
    const updatedUser = {
      name: 'Jane Doe',
      email: 'jane@example.com'
    };
    
    this.backendService.put<User>('/users/1', updatedUser).subscribe({
      next: (user) => {
        this.loading.set(false);
        this.response.set(user);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Failed to update user');
      }
    });
  }

  deleteUser() {
    this.loading.set(true);
    this.error.set('');
    
    this.backendService.delete<void>('/users/1').subscribe({
      next: () => {
        this.loading.set(false);
        this.response.set({ message: 'User deleted successfully' });
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Failed to delete user');
      }
    });
  }
}
