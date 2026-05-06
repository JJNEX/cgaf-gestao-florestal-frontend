import { Component, inject, OnInit, signal } from '@angular/core';
import { ColaboradorService } from '../services/colaborador.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ErrorCard } from '../../../shared/components/error-card/error-card';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-colaboradores-list',
  standalone: true,
  imports: [SpinnerComponent, ErrorCard, PageHeader, CommonModule, RouterLink],
  templateUrl: './colaboradores-list.component.html',
  styleUrl: './colaboradores-list.component.css',
})
export class ColaboradoresListComponent implements OnInit {
  readonly colaboradorService = inject(ColaboradorService);

  readonly pageNumber = signal(0);
  readonly pageSize = signal(20);

  ngOnInit(): void {
    this.loadColaboradores();
  }

  loadColaboradores(): void {
    this.colaboradorService.list({ page: this.pageNumber(), size: this.pageSize() }).subscribe();
  }

  prevPage(): void {
    if (this.colaboradorService.page()?.first) return;
    this.pageNumber.update((v) => Math.max(0, v - 1));
    this.loadColaboradores();
  }

  nextPage(): void {
    if (this.colaboradorService.page()?.last) return;
    this.pageNumber.update((v) => v + 1);
    this.loadColaboradores();
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) return parts[0][0] + parts[parts.length - 1][0];
    return name.substring(0, 2).toUpperCase();
  }
}
