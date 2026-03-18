import { Component, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('Flashcards');
  protected readonly isAuthPage = signal(false);

  constructor(
    protected authService: AuthService,
    private router: Router
  ) {
    this.isAuthPage.set(this.router.url === '/');

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isAuthPage.set(this.router.url === '/');
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
