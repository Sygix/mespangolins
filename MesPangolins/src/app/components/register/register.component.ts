import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  errors!: any[];

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/), Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn) this.router.navigate(['home']);
  }

  register(): void{
    if (!this.registerForm.valid) return;
    this.authService.register(this.registerForm.value)
      .subscribe({
        next: (res) => {
          if (res.result) {
            this.registerForm.reset();
            this.router.navigate(['login']);
          }
        },
        error: error => {
          console.log(error);
          this.errors = error.error;
        }
      });
  }

}
