import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private readonly http = inject(HttpClient);
  
  baseUrl = 'http://localhost:3000/api';
  
  private _loading = signal(false);
  private _error = signal<string>('');
  
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  get<T>(endpoint: string, params?: Record<string, string | number>): Observable<T> {
    this._loading.set(true);
    this._error.set('');
    
    const httpParams = params ? new HttpParams({ fromObject: params as any }) : undefined;
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params: httpParams }).pipe(
      tap(() => this._loading.set(false)),
      catchError(err => {
        this._loading.set(false);
        this._error.set(err.message || 'Request failed');
        return throwError(() => err);
      })
    );
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    this._loading.set(true);
    this._error.set('');
    
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body).pipe(
      tap(() => this._loading.set(false)),
      catchError(err => {
        this._loading.set(false);
        this._error.set(err.message || 'Request failed');
        return throwError(() => err);
      })
    );
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    this._loading.set(true);
    this._error.set('');
    
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body).pipe(
      tap(() => this._loading.set(false)),
      catchError(err => {
        this._loading.set(false);
        this._error.set(err.message || 'Request failed');
        return throwError(() => err);
      })
    );
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    this._loading.set(true);
    this._error.set('');
    
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body).pipe(
      tap(() => this._loading.set(false)),
      catchError(err => {
        this._loading.set(false);
        this._error.set(err.message || 'Request failed');
        return throwError(() => err);
      })
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    this._loading.set(true);
    this._error.set('');
    
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`).pipe(
      tap(() => this._loading.set(false)),
      catchError(err => {
        this._loading.set(false);
        this._error.set(err.message || 'Request failed');
        return throwError(() => err);
      })
    );
  }

  getWithResponse<T>(endpoint: string, params?: Record<string, string | number>): Observable<ApiResponse<T>> {
    this._loading.set(true);
    this._error.set('');
    
    const httpParams = params ? new HttpParams({ fromObject: params as any }) : undefined;
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, { params: httpParams }).pipe(
      tap(() => this._loading.set(false)),
      catchError(err => {
        this._loading.set(false);
        this._error.set(err.message || 'Request failed');
        return throwError(() => err);
      })
    );
  }

  postWithResponse<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    this._loading.set(true);
    this._error.set('');
    
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body).pipe(
      tap(() => this._loading.set(false)),
      catchError(err => {
        this._loading.set(false);
        this._error.set(err.message || 'Request failed');
        return throwError(() => err);
      })
    );
  }

  uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Observable<T> {
    this._loading.set(true);
    this._error.set('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }
    
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData).pipe(
      tap(() => this._loading.set(false)),
      catchError(err => {
        this._loading.set(false);
        this._error.set(err.message || 'Upload failed');
        return throwError(() => err);
      })
    );
  }

  downloadFile(endpoint: string): Observable<Blob> {
    this._loading.set(true);
    this._error.set('');
    
    return this.http.get(`${this.baseUrl}${endpoint}`, { 
      responseType: 'blob' 
    }).pipe(
      tap(() => this._loading.set(false)),
      catchError(err => {
        this._loading.set(false);
        this._error.set(err.message || 'Download failed');
        return throwError(() => err);
      })
    );
  }
  
  clearError(): void {
    this._error.set('');
  }
}
