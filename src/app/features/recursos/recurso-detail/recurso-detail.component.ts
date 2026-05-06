import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ErrorCard } from '../../../shared/components/error-card/error-card';
import { ToastService } from '../../../shared/services/toast.service';
import { RecursoService } from '../services/recurso.service';
import { EquipamentoInsumoResponse } from '../models/recurso.model';

@Component({
  selector: 'app-recurso-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, PageHeader, SpinnerComponent, ErrorCard],
  templateUrl: './recurso-detail.component.html',
  styleUrl: './recurso-detail.component.css',
})
export class RecursoDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  readonly service = inject(RecursoService);

  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly recurso = signal<EquipamentoInsumoResponse | null>(null);
  readonly isAdjusting = signal(false);

  readonly estoqueForm = this.fb.group({
    quantidade: [null, [Validators.required, Validators.pattern(/^-?\d+$/)]],
  });

  ngOnInit(): void {
    this.load();
  }

  private get recursoId(): number | null {
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = idStr ? Number(idStr) : NaN;
    return Number.isNaN(id) ? null : id;
  }

  load(): void {
    const id = this.recursoId;
    if (id == null) {
      this.error.set('ID inválido.');
      this.isLoading.set(false);
      return;
    }
    this.isLoading.set(true);
    this.error.set(null);
    this.service.getById(id).subscribe({
      next: (res) => {
        this.recurso.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar detalhes do recurso.');
        this.isLoading.set(false);
      },
    });
  }

  ajustarEstoque(): void {
    const recurso = this.recurso();
    if (!recurso) return;
    if (this.estoqueForm.invalid || this.isAdjusting()) return;

    const quantidade = Number(this.estoqueForm.getRawValue().quantidade);
    this.isAdjusting.set(true);

    this.service.ajustarEstoque(recurso.id, quantidade).subscribe({
      next: () => {
        this.toast.success('Estoque atualizado com sucesso.');
        this.estoqueForm.reset({ quantidade: null });
        this.load();
      },
      error: () => {
        this.toast.error('Erro ao atualizar estoque.');
        this.isAdjusting.set(false);
      },
      complete: () => this.isAdjusting.set(false),
    });
  }

  goBack(): void {
    this.location.back();
  }
}

