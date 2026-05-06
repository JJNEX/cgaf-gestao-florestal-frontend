import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ErrorCard } from '../../../shared/components/error-card/error-card';
import { RelatoriosService } from '../services/relatorios.service';
import { AlertaEstoqueResponse } from '../models/relatorios.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-estoque-alertas',
  standalone: true,
  imports: [CommonModule, PageHeader, SpinnerComponent, ErrorCard],
  templateUrl: './estoque-alertas.component.html',
  styleUrl: './estoque-alertas.component.css',
})
export class EstoqueAlertasComponent implements OnInit {
  private readonly service = inject(RelatoriosService);
  private readonly location = inject(Location);

  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly items = signal<AlertaEstoqueResponse[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.service.alertasEstoque().subscribe({
      next: (page) => {
        this.items.set(page.content ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar alertas de estoque.');
        this.isLoading.set(false);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}

