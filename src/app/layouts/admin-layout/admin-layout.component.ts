import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavItem, SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  @ViewChild('sidebar') sidebar!: SidebarComponent;
  readonly sidebarCollapsed = signal(false);
  readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Áreas Florestais', route: '/admin/area-florestal', icon: 'landscape' },
    { label: 'Colaboradores', route: '/admin/colaboradores', icon: 'people' },
    { label: 'Recursos', route: '/admin/recursos', icon: 'inventory_2' },
    { label: 'Espécies', route: '/admin/especies', icon: 'eco' },
    { label: 'Relatórios', route: '/admin/relatorios', icon: 'bar_chart' },
  ];

  onSidebarToggle(collapsed: boolean): void {
    this.sidebarCollapsed.set(collapsed);
  }
}
