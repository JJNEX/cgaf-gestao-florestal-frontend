import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { EstadoGeralInventario } from '../../../shared/models/cgaf.enums';
import { InventarioRequest } from '../models/inventario.model';
import { InventarioService } from '../services/inventario.service';
import { AreaFlorestalService } from '../../area-florestal/services/area-florestal.service';
import { AreaFlorestalSelectOption } from '../../area-florestal/models/area-florestal.model';
import { EspecieSelectOption } from '../../especies/models/especie.model';
import { EspecieService } from '../../especies/services/especie.service';

@Component({
  selector: 'app-inventario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeader],
  templateUrl: './inventario-form.component.html',
  styleUrl: './inventario-form.component.css',
})
export class InventarioFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly location = inject(Location);
  private readonly service = inject(InventarioService);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);
  private readonly areaService = inject(AreaFlorestalService);
  private readonly especieService = inject(EspecieService);

  readonly isSubmitting = signal(false);
  readonly estadoOptions: EstadoGeralInventario[] = ['OTIMO', 'BOM', 'REGULAR', 'CRITICO'];
  readonly isLoadingAreas = signal(false);
  readonly areaFlorestalOptions = signal<AreaFlorestalSelectOption[]>([]);
  readonly especieOptions = signal<EspecieSelectOption[]>([]);
  readonly isLoadingEspecies = signal(false);

  readonly form = this.fb.group({
    numeroParcela: ['', Validators.required],
    areaFlorestalId: ['' as unknown as number, Validators.required],
    especieId: ['' as unknown as number, Validators.required],
    quantidadeIndividuos: [0, [Validators.required, Validators.min(0)]],
    dapMedio: [0, [Validators.required, Validators.min(0)]],
    alturaMedia: [0, [Validators.required, Validators.min(0)]],
    presencaPragasDoencas: [false, Validators.required],
    estadoGeral: ['' as EstadoGeralInventario, Validators.required],
    dataVistoria: ['', Validators.required],
    colaboradorId: [{ value: '', disabled: true }, Validators.required],
  });

  async ngOnInit(): Promise<void> {
    const userId = this.auth.currentUser()?.id ?? '';
    this.form.patchValue({ colaboradorId: userId });
    await this.loadingAreasFlorestais();
    await this.loadingEspecies();
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) return;
    this.isSubmitting.set(true);

    const raw = this.form.getRawValue();
    const payload: InventarioRequest = {
      numeroParcela: raw.numeroParcela!,
      areaFlorestalId: Number(raw.areaFlorestalId),
      especieId: Number(raw.especieId),
      quantidadeIndividuos: Number(raw.quantidadeIndividuos),
      dapMedio: Number(raw.dapMedio),
      alturaMedia: Number(raw.alturaMedia),
      presencaPragasDoencas: !!raw.presencaPragasDoencas,
      estadoGeral: raw.estadoGeral!,
      dataVistoria: raw.dataVistoria!,
      colaboradorId: this.auth.currentUser()!.id,
    };

    this.service.create(payload).subscribe({
      next: () => {
        this.toast.success('Inventário registrado com sucesso.');
        this.goBack();
      },
      error: () => {
        this.toast.error('Erro ao registrar inventário.');
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false),
    });
  }

  goBack(): void {
    this.location.back();
  }

  async loadingAreasFlorestais(): Promise<void> {
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

  async loadingEspecies(): Promise<void> {
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

