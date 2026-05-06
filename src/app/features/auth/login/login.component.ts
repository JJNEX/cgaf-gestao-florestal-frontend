import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  readonly authService = inject(AuthService);

  email = '';
  senha = '';
  showPassword = signal(false);
  currentYear = new Date().getFullYear();

  onSubmit(): void {
    if (!this.email || !this.senha) return;
    this.authService.login({ email: this.email, senha: this.senha }).subscribe();
  }
}
