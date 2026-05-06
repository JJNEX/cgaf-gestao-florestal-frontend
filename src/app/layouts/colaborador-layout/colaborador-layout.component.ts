import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavItem, SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';

@Component({
  selector: 'app-colaborador-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './colaborador-layout.component.html',
  styleUrl: './colaborador-layout.component.css',
})
export class ColaboradorLayoutComponent {
  @ViewChild('sidebar') sidebar!: SidebarComponent;
  readonly sidebarCollapsed = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/colaborador/dashboard', icon: 'dashboard' },
    { label: 'Inventário', route: '/colaborador/inventario', icon: 'fact_check' },
    { label: 'Ocorrências', route: '/colaborador/ocorrencias', icon: 'report' },
    { label: 'Plantios', route: '/colaborador/plantios', icon: 'grass' },
  ];

  onSidebarToggle(collapsed: boolean): void {
    this.sidebarCollapsed.set(collapsed);
  }
}

