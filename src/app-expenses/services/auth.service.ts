import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private is_authenticated = "";

  constructor() {
    const savedUser = localStorage.getItem("userName");
    if (savedUser) {
      this.is_authenticated = savedUser;
    }
  }

  isAuthenticated(){
    return this.is_authenticated != "";
  }

  setAuthenticated(newState: string){
    this.is_authenticated = newState;
  }

  getUserName(){
    return this.is_authenticated
  }

  getToken(){
    return localStorage.getItem('secretAuthToken');
  }
}
