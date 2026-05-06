import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ErrorCard } from '../../../shared/components/error-card/error-card';
import { RelatoriosService } from '../services/relatorios.service';
import { ProdutividadeColaboradorResponse } from '../models/relatorios.model';
import { Location } from '@angular/common';
import { ColaboradorOptions } from '../../colaboradores/models/colaborador.model';
import { ColaboradorService } from '../../colaboradores/services/colaborador.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-produtividade',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeader, SpinnerComponent, ErrorCard],
  templateUrl: './produtividade.component.html',
  styleUrl: './produtividade.component.css',
})
export class ProdutividadeComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(RelatoriosService);
  private readonly location = inject(Location);
  private readonly toast = inject(ToastService);
  private readonly colaboradorService = inject(ColaboradorService);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly data = signal<ProdutividadeColaboradorResponse | null>(null);
  readonly isLoadingColaboradores = signal(true);
  readonly colaboradoresOptions = signal<ColaboradorOptions[]>([]);

  readonly form = this.fb.group({
    colaboradorId: ['', Validators.required],
  });

  async ngOnInit(): Promise<void> {
    await this.loadingColaboradores();
  }

  buscar(): void {
    if (this.form.invalid) return;
    const colaboradorId = this.form.getRawValue().colaboradorId!.trim();
    if (!colaboradorId) return;

    this.isLoading.set(true);
    this.error.set(null);
    this.data.set(null);

    this.service.produtividade(colaboradorId).subscribe({
      next: (res) => {
        this.data.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar produtividade do colaborador.');
        this.isLoading.set(false);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }

  async loadingColaboradores(): Promise<void> {
    this.isLoadingColaboradores.set(true);
    this.colaboradorService.listAtivo().subscribe({
      next: (res) => {
        const options = res.content?.map((c) => ({ id: c.id, nome: c.nome })) ?? [];
        this.colaboradoresOptions.set(options);
        this.isLoadingColaboradores.set(false);
      },
      error: () => {
        this.toast.error('Erro ao carregar colaboradores.');
        this.isLoadingColaboradores.set(false);
      },
    });
  }
}

