import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ErrorCard } from '../../../shared/components/error-card/error-card';
import { ToastService } from '../../../shared/services/toast.service';
import { EspecieService } from '../services/especie.service';
import { EspecieResponse } from '../models/especie.model';

@Component({
  selector: 'app-especie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeader, SpinnerComponent, ErrorCard],
  templateUrl: './especie-detail.component.html',
  styleUrl: './especie-detail.component.css',
})
export class EspecieDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly toast = inject(ToastService);
  readonly service = inject(EspecieService);

  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly especie = signal<EspecieResponse | null>(null);

  ngOnInit(): void {
    this.load();
  }

  private get especieId(): number | null {
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = idStr ? Number(idStr) : NaN;
    return Number.isNaN(id) ? null : id;
  }

  load(): void {
    const id = this.especieId;
    if (id == null) {
      this.error.set('ID inválido.');
      this.isLoading.set(false);
      return;
    }
    this.isLoading.set(true);
    this.error.set(null);
    this.service.getById(id).subscribe({
      next: (res) => {
        this.especie.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar detalhes da espécie.');
        this.isLoading.set(false);
      },
    });
  }

  remover(): void {
    const e = this.especie();
    if (!e) return;
    if (!confirm('Deseja realmente excluir esta espécie?')) return;
    this.service.remove(e.id).subscribe({
      next: () => {
        this.toast.success('Espécie removida com sucesso.');
        this.goBack();
      },
      error: () => this.toast.error('Erro ao remover espécie.'),
    });
  }

  goBack(): void {
    this.location.back();
  }
}

