import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error!: String;

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn) this.router.navigate(['home']);
  }

  login() {
    if (!this.loginForm.valid) return;
    this.authService.login(this.loginForm.value)
      .subscribe({
        next: (res) => {
          localStorage.setItem('access_token', res.token);
          this.router.navigate(['home'])
        },
        error: error => {
          this.error = error.error.message;
        }
      });
  }
}
