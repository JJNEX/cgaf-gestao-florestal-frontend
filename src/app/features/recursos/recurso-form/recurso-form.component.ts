import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ToastService } from '../../../shared/services/toast.service';
import { CategoriaRecurso } from '../../../shared/models/cgaf.enums';
import { EquipamentoInsumoRequest } from '../models/recurso.model';
import { RecursoService } from '../services/recurso.service';

@Component({
  selector: 'app-recurso-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeader],
  templateUrl: './recurso-form.component.html',
  styleUrl: './recurso-form.component.css',
})
export class RecursoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(RecursoService);
  private readonly toast = inject(ToastService);

  readonly isEditMode = signal(false);
  readonly recursoId = signal<number | null>(null);
  readonly isSubmitting = signal(false);

  readonly categoriaOptions: CategoriaRecurso[] = ['VEICULO', 'FERRAMENTA_MANUAL', 'EPI', 'INSUMO_QUIMICO'];

  readonly form = this.fb.group({
    codigoPatrimonial: ['', Validators.required],
    descricao: ['', Validators.required],
    categoria: ['' as CategoriaRecurso, Validators.required],
    quantidadeEstoque: [0, [Validators.required, Validators.min(0)]],
    estoqueMinimo: [0, [Validators.required, Validators.min(0)]],
    unidadeMedida: ['', Validators.required],
    localizacaoAtual: ['', Validators.required],
    dataAquisicao: ['', Validators.required],
    vidaUtilEstimada: [0, [Validators.required, Validators.min(0)]],
    responsavelGuarda: ['', Validators.required],
  });

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    if (idStr) {
      const id = Number(idStr);
      if (!Number.isNaN(id)) {
        this.isEditMode.set(true);
        this.recursoId.set(id);
        this.load();
      }
    }
  }

  load(): void {
    const id = this.recursoId();
    if (id == null) return;
    this.service.getById(id).subscribe({
      next: (res) => {
        this.form.patchValue({
          codigoPatrimonial: res.codigoPatrimonial,
          descricao: res.descricao,
          categoria: res.categoria,
          quantidadeEstoque: res.quantidadeEstoque,
          estoqueMinimo: res.estoqueMinimo,
          unidadeMedida: res.unidadeMedida,
          localizacaoAtual: res.localizacaoAtual,
          dataAquisicao: res.dataAquisicao,
          vidaUtilEstimada: res.vidaUtilEstimada,
          responsavelGuarda: res.responsavelGuarda,
        });
      },
      error: () => this.toast.error('Erro ao carregar dados do recurso.'),
    });
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) return;
    this.isSubmitting.set(true);

    const payload = this.form.getRawValue() as EquipamentoInsumoRequest;
    const id = this.recursoId();

    const request$: Observable<unknown> =
      this.isEditMode() && id != null ? this.service.update(id, payload) : this.service.create(payload);
    request$.subscribe({
      next: () => {
        this.toast.success(this.isEditMode() ? 'Recurso atualizado com sucesso.' : 'Recurso cadastrado com sucesso.');
        this.goBack();
      },
      error: () => {
        this.toast.error(this.isEditMode() ? 'Erro ao atualizar recurso.' : 'Erro ao cadastrar recurso.');
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false),
    });
  }

  goBack(): void {
    this.location.back();
  }
}

