# BackendService - Vollständige Anleitung

## Übersicht

Das `BackendService` ist ein minimalistisches, generisches HTTP-Service für die Backend-Kommunikation. Es nutzt automatisch den `authInterceptor` für JWT-Token-Authentifizierung.

## Features

- ✅ **Generic HTTP Methods**: GET, POST, PUT, PATCH, DELETE
- ✅ **TypeScript Generics**: Type-safe API calls
- ✅ **Automatische JWT-Authentifizierung**: Via authInterceptor
- ✅ **Query Parameters**: Einfache Parameter-Übergabe
- ✅ **File Upload/Download**: Built-in Support
- ✅ **ApiResponse Interface**: Standardisierte Responses
- ✅ **Minimalistisch**: ~70 Zeilen Code

## Installation

```bash
npm install @yourusername/angular-auth-template
```

## Setup

Das Service ist bereits als `providedIn: 'root'` konfiguriert - keine weitere Konfiguration nötig!

```typescript
import { Component, inject } from '@angular/core';
import { BackendService } from '@yourusername/angular-auth-template';

@Component({
  selector: 'app-my-component'
})
export class MyComponent {
  backendService = inject(BackendService);

  ngOnInit() {
    // Optional: Base URL setzen
    this.backendService.baseUrl = 'https://api.example.com';
  }
}
```

## API Methoden

### GET Request

```typescript
get<T>(endpoint: string, params?: Record<string, string | number>): Observable<T>
```

**Beispiele:**

```typescript
// Einfacher GET
backendService.get<User[]>('/users').subscribe(users => {
  console.log(users);
});

// Mit Query Parameters
backendService.get<User[]>('/users', { 
  page: 1, 
  limit: 10,
  sort: 'name'
}).subscribe(users => {
  console.log(users);
});

// Mit Type Safety
interface Product {
  id: number;
  name: string;
  price: number;
}

backendService.get<Product[]>('/products').subscribe(products => {
  products.forEach(p => console.log(p.name)); // Type-safe!
});
```

### POST Request

```typescript
post<T>(endpoint: string, body: any): Observable<T>
```

**Beispiele:**

```typescript
// User erstellen
const newUser = {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin'
};

backendService.post<User>('/users', newUser).subscribe(user => {
  console.log('Created user:', user.id);
});

// Login (falls kein AuthService verwendet wird)
backendService.post<{ token: string }>('/auth/login', {
  username: 'john',
  password: 'secret'
}).subscribe(response => {
  localStorage.setItem('token', response.token);
});
```

### PUT Request

```typescript
put<T>(endpoint: string, body: any): Observable<T>
```

**Beispiele:**

```typescript
// Komplettes Update
const updatedUser = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  role: 'user'
};

backendService.put<User>('/users/123', updatedUser).subscribe(user => {
  console.log('Updated:', user);
});
```

### PATCH Request

```typescript
patch<T>(endpoint: string, body: any): Observable<T>
```

**Beispiele:**

```typescript
// Partielles Update
backendService.patch<User>('/users/123', { 
  email: 'newemail@example.com' 
}).subscribe(user => {
  console.log('Email updated');
});
```

### DELETE Request

```typescript
delete<T>(endpoint: string): Observable<T>
```

**Beispiele:**

```typescript
// User löschen
backendService.delete<void>('/users/123').subscribe(() => {
  console.log('User deleted');
});

// Mit Response
backendService.delete<{ message: string }>('/users/123').subscribe(res => {
  console.log(res.message);
});
```

## Erweiterte Features

### ApiResponse Interface

Für standardisierte API-Responses:

```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
```

**Verwendung:**

```typescript
backendService.getWithResponse<User[]>('/users').subscribe(response => {
  if (response.success) {
    const users = response.data;
    const message = response.message;
    console.log(message, users);
  }
});

backendService.postWithResponse<User>('/users', newUser).subscribe(response => {
  if (response.success) {
    console.log(response.message); // "User created successfully"
    console.log(response.data);    // User object
  }
});
```

**Backend Response Format:**

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    { "id": 1, "name": "John" },
    { "id": 2, "name": "Jane" }
  ]
}
```

### File Upload

```typescript
uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Observable<T>
```

**Beispiele:**

```typescript
// Einfacher Upload
const file = event.target.files[0];
backendService.uploadFile('/upload', file).subscribe(response => {
  console.log('Upload complete:', response);
});

// Mit zusätzlichen Daten
backendService.uploadFile('/upload', file, {
  category: 'profile',
  userId: 123
}).subscribe(response => {
  console.log('Uploaded:', response);
});

// Mit Fortschritt (erweitert)
const formData = new FormData();
formData.append('file', file);
this.http.post('/upload', formData, {
  reportProgress: true,
  observe: 'events'
}).subscribe(event => {
  if (event.type === HttpEventType.UploadProgress) {
    const progress = Math.round(100 * event.loaded / event.total!);
    console.log('Progress:', progress);
  }
});
```

**HTML:**

```html
<input type="file" (change)="onFileSelected($event)">

<script>
onFileSelected(event: any) {
  const file = event.target.files[0];
  this.backendService.uploadFile('/upload', file).subscribe();
}
</script>
```

### File Download

```typescript
downloadFile(endpoint: string): Observable<Blob>
```

**Beispiele:**

```typescript
// CSV Download
backendService.downloadFile('/export/users').subscribe(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
});

// PDF Download
backendService.downloadFile('/reports/monthly.pdf').subscribe(blob => {
  const url = window.URL.createObjectURL(blob);
  window.open(url);
});

// Mit Helper-Funktion
downloadFile(endpoint: string, filename: string) {
  this.backendService.downloadFile(endpoint).subscribe(blob => {
    saveAs(blob, filename); // Nutze file-saver library
  });
}
```

## Praktische Beispiele

### CRUD Service

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { BackendService } from '@yourusername/angular-auth-template';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private backend = inject(BackendService);
  products = signal<Product[]>([]);
  loading = signal(false);

  loadProducts() {
    this.loading.set(true);
    this.backend.get<Product[]>('/products').subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  createProduct(product: Omit<Product, 'id'>) {
    return this.backend.post<Product>('/products', product);
  }

  updateProduct(id: number, updates: Partial<Product>) {
    return this.backend.patch<Product>(`/products/${id}`, updates);
  }

  deleteProduct(id: number) {
    return this.backend.delete<void>(`/products/${id}`);
  }

  searchProducts(query: string) {
    return this.backend.get<Product[]>('/products', { search: query });
  }
}
```

### Komponente mit CRUD

```typescript
import { Component, inject, signal } from '@angular/core';
import { ProductService, Product } from './product.service';

@Component({
  selector: 'app-products',
  template: `
    <div>
      <button (click)="loadProducts()">Load Products</button>
      <button (click)="addProduct()">Add Product</button>
      
      @if (productService.loading()) {
        <div>Loading...</div>
      }
      
      @for (product of productService.products(); track product.id) {
        <div class="product">
          <h3>{{ product.name }}</h3>
          <p>Price: {{ product.price | currency }}</p>
          <p>Stock: {{ product.stock }}</p>
          <button (click)="updateStock(product)">Update Stock</button>
          <button (click)="deleteProduct(product.id)">Delete</button>
        </div>
      }
    </div>
  `
})
export class ProductsComponent {
  productService = inject(ProductService);

  loadProducts() {
    this.productService.loadProducts();
  }

  addProduct() {
    const newProduct = {
      name: 'New Product',
      price: 99.99,
      stock: 10
    };
    
    this.productService.createProduct(newProduct).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error('Error:', err)
    });
  }

  updateStock(product: Product) {
    this.productService.updateProduct(product.id, { 
      stock: product.stock + 1 
    }).subscribe({
      next: () => this.loadProducts()
    });
  }

  deleteProduct(id: number) {
    if (confirm('Delete product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts()
      });
    }
  }
}
```

### Pagination

```typescript
class ProductListComponent {
  backendService = inject(BackendService);
  products = signal<Product[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);

  loadPage(page: number) {
    this.backendService.get<{
      data: Product[];
      page: number;
      totalPages: number;
    }>('/products', { 
      page: page, 
      limit: 20 
    }).subscribe(response => {
      this.products.set(response.data);
      this.currentPage.set(response.page);
      this.totalPages.set(response.totalPages);
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.loadPage(this.currentPage() + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.loadPage(this.currentPage() - 1);
    }
  }
}
```

### Error Handling

```typescript
class MyComponent {
  backendService = inject(BackendService);
  error = signal<string>('');

  loadData() {
    this.error.set('');
    
    this.backendService.get<User[]>('/users').subscribe({
      next: (users) => {
        console.log('Success:', users);
      },
      error: (err) => {
        if (err.status === 401) {
          this.error.set('Unauthorized - please login');
        } else if (err.status === 404) {
          this.error.set('Users not found');
        } else if (err.status === 500) {
          this.error.set('Server error - please try again');
        } else {
          this.error.set(err.message || 'Unknown error');
        }
      }
    });
  }
}
```

## Konfiguration

### Base URL setzen

**Global (empfohlen):**

```typescript
// app.config.ts
import { APP_INITIALIZER } from '@angular/core';
import { BackendService } from '@yourusername/angular-auth-template';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (backendService: BackendService) => () => {
        backendService.baseUrl = 'https://api.example.com';
      },
      deps: [BackendService],
      multi: true
    }
  ]
};
```

**Per Komponente:**

```typescript
ngOnInit() {
  this.backendService.baseUrl = 'https://api.example.com';
}
```

**Via Environment:**

```typescript
// environment.ts
export const environment = {
  apiUrl: 'https://api.example.com'
};

// In Component
ngOnInit() {
  this.backendService.baseUrl = environment.apiUrl;
}
```

## Best Practices

1. **Type Safety nutzen**
   ```typescript
   // Gut
   backendService.get<User[]>('/users')
   
   // Schlecht
   backendService.get('/users')
   ```

2. **Error Handling**
   ```typescript
   backendService.get<User[]>('/users').subscribe({
     next: (users) => { /* success */ },
     error: (err) => { /* handle error */ }
   });
   ```

3. **Service Wrapper erstellen**
   ```typescript
   // Eigener Service für saubere API-Calls
   @Injectable({ providedIn: 'root' })
   export class UserService {
     private backend = inject(BackendService);
     
     getUsers() {
       return this.backend.get<User[]>('/users');
     }
   }
   ```

4. **Loading States**
   ```typescript
   loading = signal(false);
   
   loadData() {
     this.loading.set(true);
     this.backendService.get('/data').subscribe({
       next: () => this.loading.set(false),
       error: () => this.loading.set(false)
     });
   }
   ```

## Zusammenfassung

Das BackendService bietet:
- ✅ Einfache HTTP-Calls mit automatischer JWT-Authentifizierung
- ✅ Type-Safe API mit TypeScript Generics
- ✅ File Upload/Download Support
- ✅ Query Parameter Handling
- ✅ Minimalistisch und leicht erweiterbar

**Perfekt für:** Schnelle API-Integration in Angular-Apps mit JWT-Authentifizierung!
