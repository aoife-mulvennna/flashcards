import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  error = signal('');
  isRegisterMode = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  submit() {
    this.error.set('');

    const request = this.isRegisterMode()
      ? this.authService.register(this.email, this.password)
      : this.authService.login(this.email, this.password);

    request.subscribe({
      next: () => this.router.navigateByUrl('/home'),
      error: () => this.error.set('Login failed. Check your email/password and try again.'),
    });
  }

  toggleMode() {
    this.isRegisterMode.update((value) => !value);
    this.error.set('');
  }
}
