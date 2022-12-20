import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MesPangolins';

  constructor(public authService: AuthService, private router: Router) { }
  
  logout() {
    this.authService.doLogout();
    this.router.navigate(['login'])
  }
}
