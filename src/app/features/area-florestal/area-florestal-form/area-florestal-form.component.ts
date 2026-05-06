import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { AreaFlorestalService } from '../services/area-florestal.service';
import { AreaFlorestalRequest } from '../models/area-florestal.model';
import { BiomaPredominante, TipoFloresta } from '../../../shared/models/cgaf.enums';

@Component({
  selector: 'app-area-florestal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeader],
  templateUrl: './area-florestal-form.component.html',
  styleUrl: './area-florestal-form.component.css',
})
export class AreaFlorestalFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(AreaFlorestalService);
  private readonly toast = inject(ToastService);

  readonly isEditMode = signal(false);
  readonly areaId = signal<number | null>(null);
  readonly isSubmitting = signal(false);

  readonly tipoFlorestaOptions: TipoFloresta[] = ['NATIVA', 'PLANTADA', 'MISTA'];
  readonly biomaOptions: BiomaPredominante[] = [
    'AMAZONIA',
    'CERRADO',
    'MATA_ATLANTICA',
    'CAATINGA',
    'PAMPA',
    'PANTANAL',
  ];

  // Deve buscar da API, mas como não tem endpoint, deixei hardcoded
  readonly statusOptions: string[] = ['Ativa', 'Em Recuperação', 'Embargada', 'Reservada', 'Inativa'];

  readonly form = this.fb.group({
    nome: ['', Validators.required],
    latitude: [0, Validators.required],
    longitude: [0, Validators.required],
    municipio: ['', Validators.required],
    estado: ['', Validators.required],
    tamanhoHectares: [0, [Validators.required, Validators.min(0)]],
    status: ['Ativa', Validators.required],
    tipoFloresta: ['' as TipoFloresta, Validators.required],
    biomaPredominante: ['' as BiomaPredominante, Validators.required],
  });

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    if (idStr) {
      const id = Number(idStr);
      if (!Number.isNaN(id)) {
        this.isEditMode.set(true);
        this.areaId.set(id);
        this.load();
      }
    }
  }

  load(): void {
    const id = this.areaId();
    if (id == null) return;
    this.service.getById(id).subscribe({
      next: (area) => {
        this.form.patchValue({
          nome: area.nome,
          latitude: area.latitude,
          longitude: area.longitude,
          municipio: area.municipio,
          estado: area.estado,
          tamanhoHectares: area.tamanhoHectares,
          status: area.status,
          tipoFloresta: area.tipoFloresta,
          biomaPredominante: area.biomaPredominante,
        });
      },
      error: () => {
        this.toast.error('Erro ao carregar dados da área.');
      },
    });
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) return;
    this.isSubmitting.set(true);

    const payload = this.form.getRawValue() as AreaFlorestalRequest;
    const id = this.areaId();

    if (this.isEditMode() && id != null) {
      this.service.update(id, payload).subscribe({
        next: () => {
          this.toast.success('Área atualizada com sucesso.');
          this.goBack();
        },
        error: () => {
          this.toast.error('Erro ao atualizar área.');
          this.isSubmitting.set(false);
        },
        complete: () => this.isSubmitting.set(false),
      });
      return;
    }

    this.service.create(payload).subscribe({
      next: () => {
        this.toast.success('Área cadastrada com sucesso.');
        this.goBack();
      },
      error: () => {
        this.toast.error('Erro ao cadastrar área.');
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false),
    });
  }

  goBack(): void {
    this.location.back();
  }
}

