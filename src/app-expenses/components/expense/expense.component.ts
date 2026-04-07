import {Component, inject, OnInit, signal} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {HttpServiceService} from "../../services/http-service.service";
import {Expense} from "../../types/Expense";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-expense',
  imports: [
    FormsModule
  ],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css',
})
export class ExpenseComponent implements OnInit {

  authService = inject(AuthService)
  http = inject(HttpServiceService)
  expenses = signal<Expense[]>([])
  editingExpense = signal<Expense | null>(null)
  editingExpenseId = signal<number | null>(null)
  private nextClientId = 0;
  router = inject(Router);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
        this.http.getAllExpenses().subscribe(
          value => {
            this.expenses.set(
              value.map(expense => ({
                ...expense,
                clientId: this.nextClientId++,
              }))
            )
          }
        )
    } else {
      this.router.navigate(["/login"])
    }
  }

  startEdit(expense: Expense) {
    this.editingExpenseId.set(expense.clientId ?? null)
    this.editingExpense.set({ ...expense })
  }

  saveEdit() {
    const expenseId = this.editingExpenseId()
    const expense = this.editingExpense()

    if (expenseId === null || !expense) {
      return
    }

    this.expenses.update(currentExpenses =>
      currentExpenses.map(currentExpense =>
        currentExpense.clientId === expenseId ? { ...currentExpense, ...expense, clientId: expenseId } : currentExpense
      )
    )

    this.cancelEdit()
  }

  deleteExpense(expense: Expense) {
    const expenseId = expense.clientId

    if (expenseId === undefined) {
      return
    }

    const confirmed = window.confirm(`Möchtest du ${expense.type} wirklich löschen?`)

    if (!confirmed) {
      return
    }

    this.expenses.update(currentExpenses => currentExpenses.filter(currentExpense => currentExpense.clientId !== expenseId))

    if (this.editingExpenseId() === expenseId) {
      this.cancelEdit()
    }
  }

  cancelEdit() {
    this.editingExpenseId.set(null)
    this.editingExpense.set(null)
  }

  isFoodType(type: string | undefined) {
    if (type?.toLowerCase() == 'food') {
      return 'green'
    }
    else return 'blue'
  }

}
