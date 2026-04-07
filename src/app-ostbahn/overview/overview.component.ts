import {Component, OnInit, signal} from '@angular/core';
import {HttpService} from '../http.service';
import {Connection} from '../domains/connection';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-overview',
  imports: [
    RouterLink
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent implements OnInit{
  logined = signal(false)
  connections = signal<Connection[]>([])
  constructor(private http:HttpService, private auth:AuthService, private router: Router) {
    this.logined.set(auth.isLoggedIn())
  }

  ngOnInit() {
        this.http.getAllConnections().subscribe(cs => {
          this.connections.set(cs)
        })
    }

  logout(){
    this.auth.logout();
    this.router.navigate(['login'])
    this.logined.set(false)
  }

  login() {
    this.router.navigate(['login'])
    this.logined.set(true)
  }



}
