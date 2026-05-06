import { Component, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  readonly collapsed = signal(false);
  readonly mobileOpen = signal(false);
  readonly sidebarToggled = output<boolean>();

  readonly homeRoute = input<string>('/');
  readonly brandText = input<string>('CGAF');
  readonly footerText = input<string>('Gestão Florestal v1.0');
  readonly navItems = input<NavItem[]>([]);

  toggleCollapse(): void {
    this.collapsed.update((v) => !v);
    this.sidebarToggled.emit(this.collapsed());
  }

  openMobile(): void {
    this.mobileOpen.set(true);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }
}

