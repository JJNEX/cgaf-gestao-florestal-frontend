import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { PlantioRequest } from '../models/plantio.model';
import { PlantioService } from '../services/plantio.service';
import { EspecieService } from '../../especies/services/especie.service';
import { AreaFlorestalService } from '../../area-florestal/services/area-florestal.service';

@Component({
  selector: 'app-plantio-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeader],
  templateUrl: './plantio-form.component.html',
  styleUrl: './plantio-form.component.css',
})
export class PlantioFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly location = inject(Location);
  private readonly service = inject(PlantioService);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);
  private readonly areaService = inject(AreaFlorestalService);
  private readonly especieService = inject(EspecieService);

  readonly isSubmitting = signal(false);
  readonly isLoadingAreas = signal(false);
  readonly areaFlorestalOptions = signal<{ id: number; nome: string }[]>([])
  readonly isLoadingEspecies = signal(false);
  readonly especieOptions = signal<{ id: number; nome: string }[]>([]);

  readonly form = this.fb.group({
    dataHora: ['', Validators.required],
    areaFlorestalId: [null as unknown as number, Validators.required],
    especieId: [null as unknown as number, Validators.required],
    quantidadeMudas: [0, [Validators.required, Validators.min(0)]],
    latitudeTalhao: [0, Validators.required],
    longitudeTalhao: [0, Validators.required],
    temperatura: [0, Validators.required],
    umidade: [0, Validators.required],
    chuva: [false, Validators.required],
    metodoPlantio: ['', Validators.required],
    observacoes: [''],
    colaboradorId: [{ value: '', disabled: true }, Validators.required],
  });

  async ngOnInit(): Promise<void> {
    const userId = this.auth.currentUser()?.id ?? '';
    this.form.patchValue({ colaboradorId: userId });
    await this.loadAreaFlorestalOptions();
    await this.loadEspecieOptions();
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) return;
    this.isSubmitting.set(true);

    const raw = this.form.getRawValue();
    const payload: PlantioRequest = {
      dataHora: raw.dataHora!,
      areaFlorestalId: Number(raw.areaFlorestalId),
      especieId: Number(raw.especieId),
      quantidadeMudas: Number(raw.quantidadeMudas),
      latitudeTalhao: Number(raw.latitudeTalhao),
      longitudeTalhao: Number(raw.longitudeTalhao),
      temperatura: Number(raw.temperatura),
      umidade: Number(raw.umidade),
      chuva: !!raw.chuva,
      metodoPlantio: raw.metodoPlantio!,
      observacoes: raw.observacoes ?? '',
      colaboradorId: this.auth.currentUser()!.id,
    };

    this.service.create(payload).subscribe({
      next: () => {
        this.toast.success('Plantio registrado com sucesso.');
        this.goBack();
      },
      error: () => {
        this.toast.error('Erro ao registrar plantio.');
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false),
    });
  }

  goBack(): void {
    this.location.back();
  }

  async loadAreaFlorestalOptions(): Promise<void> {
    this.isLoadingAreas.set(true);
    return new Promise((resolve, reject) => {
      this.areaService.list().subscribe({
        next: (res) => {
          const options = res.content?.map((a) => ({ id: a.id, nome: a.nome })) ?? [];
          this.areaFlorestalOptions.set(options);
          this.isLoadingAreas.set(false);
          resolve();
        },
        error: () => {
          this.toast.error('Erro ao carregar áreas florestais.');
          reject();
        },
      });
    });
  }

  async loadEspecieOptions(): Promise<void> {
    this.isLoadingEspecies.set(true);
    return new Promise((resolve, reject) => {
      this.especieService.list().subscribe({
        next: (res) => {
          const options = res.content?.map((e) => ({ id: e.id, nome: e.familia + ' - ' + e.nomePopular })) ?? [];
          this.especieOptions.set(options);
          this.isLoadingEspecies.set(false);
          resolve();
        },
        error: () => {
          this.toast.error('Erro ao carregar espécies.');
          reject();
        },
      });
    });
  }
}

