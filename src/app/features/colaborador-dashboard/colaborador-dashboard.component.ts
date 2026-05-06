import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { SectionCard } from '../../shared/components/section-card/section-card';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { InventarioService } from '../inventario/services/inventario.service';
import { PlantioService } from '../plantios/services/plantio.service';
import { OcorrenciaService } from '../ocorrencias/services/ocorrencia.service';

interface DashboardCard {
  title: string;
  value: string;
  icon: string;
  iconColor: string;
  route: string;
}

@Component({
  selector: 'app-colaborador-dashboard',
  standalone: true,
  imports: [RouterLink, PageHeader, SectionCard, CommonModule],
  templateUrl: './colaborador-dashboard.component.html',
  styleUrl: './colaborador-dashboard.component.css',
})
export class ColaboradorDashboardComponent implements OnInit {
  readonly authService = inject(AuthService);

  readonly InventarioService = inject(InventarioService);
  readonly ocorrenciaService = inject(OcorrenciaService); // Substitua com o serviço real de ocorrências
  readonly plantioService = inject(PlantioService); // Substitua com o serviço real de plantios

  formattedDate = this.formatDate(new Date());

  cards = signal<DashboardCard[]>([
    {
      title: 'Inventário',
      value: '',
      icon: 'fact_check',
      iconColor: '#22c55e',
      route: '/colaborador/inventario',
    },
    {
      title: 'Ocorrências',
      value: '',
      icon: 'report',
      iconColor: '#f59e0b',
      route: '/colaborador/ocorrencias',
    },
    {
      title: 'Plantios',
      value: '',
      icon: 'grass',
      iconColor: '#3b82f6',
      route: '/colaborador/plantios',
    },
  ]);

  ngOnInit(): void {
    this.loadStats();
  }

  updateCardValues(title: string, value: number) {
      const updated = this.cards().map(card =>
      card.title === title
        ? { ...card, value: value.toString() }
        : card
    );

    this.cards.set(updated);
  }

  loadStats() {
    this.InventarioService.list({ page: 0, size: 1 }).subscribe({
      next: (response) => {
        this.updateCardValues('Inventário', response.totalElements);
      },
      error: (err) => {
        console.error('Erro ao carregar inventário:', err);
      },
    });

    this.ocorrenciaService.list({ page: 0, size: 1 }).subscribe({
      next: (response) => {
        this.updateCardValues('Ocorrências', response.totalElements);
      },
      error: (err) => {
        console.error('Erro ao carregar ocorrências:', err);
      },
    });

    this.plantioService.list({ page: 0, size: 1 }).subscribe({
      next: (response) => {
        this.updateCardValues('Plantios', response.totalElements);
      },
      error: (err) => {
        console.error('Erro ao carregar plantios:', err);
      },
    });
  }

  private formatDate(date: Date): string {
    const days = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ];
    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    return `${days[date.getDay()]}, ${date
      .getDate()
      .toString()
      .padStart(2, '0')} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  }
}

