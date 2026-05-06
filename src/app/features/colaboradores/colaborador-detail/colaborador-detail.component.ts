import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ErrorCard } from '../../../shared/components/error-card/error-card';
import { ColaboradorService } from '../services/colaborador.service';
import { ColaboradorResponse } from '../models/colaborador.model';

@Component({
  selector: 'app-colaborador-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeader, SpinnerComponent, ErrorCard],
  templateUrl: './colaborador-detail.component.html',
  styleUrl: './colaborador-detail.component.css',
})
export class ColaboradorDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly service = inject(ColaboradorService);

  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly colaborador = signal<ColaboradorResponse | null>(null);

  ngOnInit(): void {
    this.load();
  }

  private get colaboradorId(): string | null {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? id.trim() : null;
  }

  load(): void {
    const id = this.colaboradorId;
    if (!id) {
      this.error.set('ID inválido.');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.service.getById(id).subscribe({
      next: (res) => {
        this.colaborador.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar dados do colaborador.');
        this.isLoading.set(false);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}

