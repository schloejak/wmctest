export class Expense {
  id?: number
  clientId?: number
  type: string
  amount: number
  expenseDate: string
  description: string


  constructor(type: string, amount: number, expenseDate: string, description: string, id?: number, clientId?: number) {
    this.id = id;
    this.clientId = clientId;
    this.type = type;
    this.amount = amount;
    this.expenseDate = expenseDate;
    this.description = description;
  }
}
