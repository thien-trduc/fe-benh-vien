import { LoginService } from './login/login.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    // this.loginService.logout();
    // this.router.navigate([`/login`]);
  }
  isCollapsed = false;
  logout() {
    console.log(`logout`)
    this.loginService.logout();
    this.router.navigate([`/login`]);
  }
  isLogin() {
    return localStorage.getItem('currentUser') ? true : false;
  }
}
