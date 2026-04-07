import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {Observable, tap} from "rxjs";
import {Expense} from "../types/Expense";

@Injectable({
  providedIn: 'root',
})
export class HttpServiceService {
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);
  private baseURL = "http://localhost:8080/api";

  login(username: string, password: string){
    return this.http
      .post<{ token: string }>(`${this.baseURL}/token`,
        { username: username, password: password })
      .pipe(
        tap(response => {
          localStorage.setItem('secretAuthToken', response.token);
          localStorage.setItem("userName", username)
          this.authService.setAuthenticated(username);
        })
      );
  }

  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.baseURL}/expenses`);
  }

  updateExpense(expenseId: number, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.baseURL}/expenses/${expenseId}`, expense);
  }

  deleteExpense(expenseId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/expenses/${expenseId}`);
  }

  logout(){
    localStorage.removeItem('secretAuthToken');
    this.authService.setAuthenticated("");
    this.router.navigate(['/login']);
  }

}
