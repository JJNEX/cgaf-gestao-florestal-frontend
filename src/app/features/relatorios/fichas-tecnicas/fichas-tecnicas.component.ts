import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ErrorCard } from '../../../shared/components/error-card/error-card';
import { RelatoriosService } from '../services/relatorios.service';
import { FichaTecnicaEspecieResponse } from '../models/relatorios.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-fichas-tecnicas',
  standalone: true,
  imports: [CommonModule, PageHeader, SpinnerComponent, ErrorCard],
  templateUrl: './fichas-tecnicas.component.html',
  styleUrl: './fichas-tecnicas.component.css',
})
export class FichasTecnicasComponent implements OnInit {
  private readonly service = inject(RelatoriosService);
  private readonly location = inject(Location);

  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly items = signal<FichaTecnicaEspecieResponse[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.service.fichasTecnicas().subscribe({
      next: (page) => {
        this.items.set(page.content ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar fichas técnicas.');
        this.isLoading.set(false);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}

