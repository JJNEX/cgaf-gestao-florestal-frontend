import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ErrorCard } from '../../../shared/components/error-card/error-card';
import { ToastService } from '../../../shared/services/toast.service';
import { AreaFlorestalService } from '../services/area-florestal.service';
import { AlocacaoRequest, AreaFlorestalResponse } from '../models/area-florestal.model';
import { ColaboradorService } from '../../colaboradores/services/colaborador.service';
import { ColaboradorOptions } from '../../colaboradores/models/colaborador.model';

@Component({
  selector: 'app-area-florestal-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, PageHeader, SpinnerComponent, ErrorCard],
  templateUrl: './area-florestal-detail.component.html',
  styleUrl: './area-florestal-detail.component.css',
})
export class AreaFlorestalDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  readonly service = inject(AreaFlorestalService);
  readonly colaboradorService = inject(ColaboradorService);

  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly area = signal<AreaFlorestalResponse | null>(null);
  readonly alocacaoSubmitting = signal(false);
  readonly isLoadingColaboradores = signal(false);
  readonly colaboradoresOptions = signal<ColaboradorOptions[]>([]);
  dataFimMap: Record<number, string> = {};

  readonly form = this.fb.group({
    idColaborador: ['', Validators.required],
    dataInicio: [
      new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' }), 
      Validators.required
    ],
  });

  async ngOnInit(): Promise<void> {
    this.load();
    await this.loadingColaboradores();
  }

  private get areaId(): number | null {
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = idStr ? Number(idStr) : NaN;
    return Number.isNaN(id) ? null : id;
  }

  load(): void {
    const id = this.areaId;
    if (id == null) {
      this.error.set('ID inválido.');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.service.getById(id).subscribe({
      next: (res) => {
        this.area.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar detalhes da área.');
        this.isLoading.set(false);
      },
    });
  }

  criarAlocacao(): void {
    const area = this.area();
    if (!area) return;
    if (this.form.invalid || this.alocacaoSubmitting()) return;

    this.alocacaoSubmitting.set(true);

    const payload: AlocacaoRequest = {
      idAreaFlorestal: area.id,
      idColaborador: this.form.getRawValue().idColaborador!,
      dataInicio: this.form.getRawValue().dataInicio!,
    };

    this.service.criarAlocacao(payload).subscribe({
      next: () => {
        this.toast.success('Alocação criada com sucesso.');
        this.form.reset();
        this.load();
      },
      error: (res) => {
        if(res.error.message) {
          this.toast.error(res.error.message);
        } else {
          this.toast.error('Erro ao criar alocação.');
        }
        this.alocacaoSubmitting.set(false);
      },
      complete: () => this.alocacaoSubmitting.set(false),
    });
  }


  encerrarAlocacao(alocacaoId: number, dataFim?: string): void {
  const dataLimpa = dataFim?.trim()?.split('T')[0];

  if (!dataLimpa) {
    this.toast.error('Selecione uma data de fim.');
    return;
  }

  this.service.encerrarAlocacao(alocacaoId, dataLimpa).subscribe({
    next: () => {
      this.toast.success('Alocação encerrada com sucesso.');
      this.load();
    },
    error: (err) => {
      console.log(err.error);
      this.toast.error('Erro ao encerrar alocação.');
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

