
export class Customer{
  id:number
  username:string
  name:string
  password:string
  role:string


  constructor(id: number, username: string, name: string, password: string, role: string) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.password = password;
    this.role = role;
  }
}
