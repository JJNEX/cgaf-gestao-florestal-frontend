import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { SectionCard } from '../../shared/components/section-card/section-card';
import { CommonModule } from '@angular/common';
import { AreaFlorestalService } from '../area-florestal/services/area-florestal.service';
import { RecursoService } from '../recursos/services/recurso.service';
import { EspecieService } from '../especies/services/especie.service';
import { signal } from '@angular/core';

interface DashboardCard {
  title: string;
  value: string;
  icon: string;
  trend: string;
  iconColor: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, PageHeader, SectionCard, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  readonly authService = inject(AuthService);

  formattedDate = this.formatDate(new Date());

  readonly areaService = inject(AreaFlorestalService);
  readonly recursoService = inject(RecursoService); 
  readonly especieService = inject(EspecieService);

  cards = signal<DashboardCard[]>([
    {
      title: 'Áreas Florestais', 
      value: '0',
      icon: 'landscape',
      trend: '', 
      iconColor: '#22c55e', 
      route: '/admin/area-florestal',
    },
    {
      title: 'Recursos',
      value: '0',
      icon: 'inventory_2',
      trend: '', 
      iconColor: '#3b82f6', 
      route: '/admin/recursos',
    },
    {
      title: 'Espécies',
      value: '0',
      icon: 'eco',
      trend: '',
      iconColor: '#f59e0b',
      route: '/admin/especies',
    },
    {
      title: 'Relatórios',
      value: '',
      icon: 'bar_chart',
      trend: '',
      iconColor: '#8b5cf6',
      route: '/admin/relatorios',
    },
  ]);

  updateCardValue(title: string, value: number) {
  const updated = this.cards().map(card =>
    card.title === title
      ? { ...card, value: value.toString() }
      : card
  );

  this.cards.set(updated);
}

  loadStats() {
  this.areaService.list({ page: 0, size: 1 }).subscribe({
    next: (res: any) => {
      this.updateCardValue('Áreas Florestais', res.totalElements);
    },
    error: (err: any) => console.error(err)
  });

  this.recursoService.list({ page: 0, size: 1 }).subscribe({
    next: (res: any) => {
      this.updateCardValue('Recursos', res.totalElements);
    },
    error: (err: any) => console.error(err)
  });

  this.especieService.list({ page: 0, size: 1 }).subscribe({
    next: (res: any) => {
      this.updateCardValue('Espécies', res.totalElements);
    },
    error: (err: any) => console.error(err)
  });
  
  
}

  
  ngOnInit(): void {
  
     this.loadStats();
  }

  private formatDate(date: Date): string {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${days[date.getDay()]}, ${date.getDate().toString().padStart(2, '0')} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  }

}
