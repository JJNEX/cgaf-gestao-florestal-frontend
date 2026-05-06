import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ToastService } from '../../../shared/services/toast.service';
import { ConservacaoEspecie, PorteEspecie } from '../../../shared/models/cgaf.enums';
import { EspecieRequest } from '../models/especie.model';
import { EspecieService } from '../services/especie.service';

@Component({
  selector: 'app-especie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeader],
  templateUrl: './especie-form.component.html',
  styleUrl: './especie-form.component.css',
})
export class EspecieFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(EspecieService);
  private readonly toast = inject(ToastService);

  readonly isEditMode = signal(false);
  readonly especieId = signal<number | null>(null);
  readonly isSubmitting = signal(false);

  readonly porteOptions: PorteEspecie[] = ['ARBOREO', 'ARBUSTIVO', 'HERBACEO'];
  readonly conservacaoOptions: ConservacaoEspecie[] = ['AMEACADA', 'VULNERAVEL', 'POUCO_PREOCUPANTE'];

  readonly form = this.fb.group({
    nomeCientifico: ['', Validators.required],
    nomePopular: ['', Validators.required],
    familia: ['', Validators.required],
    porte: ['' as PorteEspecie, Validators.required],
    conservacao: ['' as ConservacaoEspecie, Validators.required],
    cicloVidaAnos: [0, [Validators.required, Validators.min(0)]],
    exigenciasClimaticasSolo: ['', Validators.required],
    nativa: [false, Validators.required],
  });

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    if (idStr) {
      const id = Number(idStr);
      if (!Number.isNaN(id)) {
        this.isEditMode.set(true);
        this.especieId.set(id);
        this.load();
      }
    }
  }

  load(): void {
    const id = this.especieId();
    if (id == null) return;
    this.service.getById(id).subscribe({
      next: (res) => {
        this.form.patchValue({
          nomeCientifico: res.nomeCientifico,
          nomePopular: res.nomePopular,
          familia: res.familia,
          porte: res.porte,
          conservacao: res.conservacao,
          cicloVidaAnos: res.cicloVidaAnos,
          exigenciasClimaticasSolo: res.exigenciasClimaticasSolo,
          nativa: res.nativa,
        });
      },
      error: () => this.toast.error('Erro ao carregar dados da espécie.'),
    });
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) return;
    this.isSubmitting.set(true);

    const payload = this.form.getRawValue() as EspecieRequest;
    const id = this.especieId();

    if (this.isEditMode() && id != null) {
      this.service.update(id, payload).subscribe({
        next: () => {
          this.toast.success('Espécie atualizada com sucesso.');
          this.goBack();
        },
        error: () => {
          this.toast.error('Erro ao atualizar espécie.');
          this.isSubmitting.set(false);
        },
        complete: () => this.isSubmitting.set(false),
      });
      return;
    }

    this.service.create(payload).subscribe({
      next: () => {
        this.toast.success('Espécie cadastrada com sucesso.');
        this.goBack();
      },
      error: () => {
        this.toast.error('Erro ao cadastrar espécie.');
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false),
    });
  }

  goBack(): void {
    this.location.back();
  }
}

