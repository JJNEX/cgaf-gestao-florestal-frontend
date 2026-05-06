import { Component, HostListener, inject, output } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
  imports: [RouterLink],
})
export class TopbarComponent {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly menuToggle = output<void>();

  isDropdownOpen = false;
  
  get profileRoute(): string {
    const user = this.authService.currentUser();
    if (!user) return '/login';
    if (user.perfil === 'ADMIN') return `/admin/usuarios/${user.id}/editar`;
    return '/colaborador/perfil';
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
