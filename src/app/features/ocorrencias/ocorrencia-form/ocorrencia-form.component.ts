import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { TipoOcorrencia, UrgenciaOcorrencia } from '../../../shared/models/cgaf.enums';
import { OcorrenciaRequest } from '../models/ocorrencia.model';
import { OcorrenciaService } from '../services/ocorrencia.service';
import { AreaFlorestalService } from '../../area-florestal/services/area-florestal.service';
import { AreaFlorestalSelectOption } from '../../area-florestal/models/area-florestal.model';
import * as pako from 'pako';

@Component({
  selector: 'app-ocorrencia-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeader],
  templateUrl: './ocorrencia-form.component.html',
  styleUrl: './ocorrencia-form.component.css',
})
export class OcorrenciaFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly location = inject(Location);
  private readonly service = inject(OcorrenciaService);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);
  private readonly areaService = inject(AreaFlorestalService);

  readonly isSubmitting = signal(false);
  readonly isLoadingAreas = signal(false);
  readonly tipoOptions: TipoOcorrencia[] = [
    'INCENDIO',
    'DESMATAMENTO_ILEGAL',
    'EROSAO',
    'ESPECIES_INVASORAS',
    'PRAGAS_DOENCAS',
    'ACIDENTE_ANIMAL',
    'ACIDENTE_EQUIPE',
    'INFRACAO_AMBIENTAL',
  ];
  readonly urgenciaOptions: UrgenciaOcorrencia[] = ['BAIXO', 'MEDIO', 'ALTO', 'CRITICO'];
  readonly areaFlorestalOptions = signal<AreaFlorestalSelectOption[]>([]);

  readonly form = this.fb.group({
    tipo: ['' as TipoOcorrencia, Validators.required],
    urgencia: ['' as UrgenciaOcorrencia, Validators.required],
    descricao: ['', Validators.required],
    areaFlorestalId: ['' as unknown as number, Validators.required],
    latitude: [0, Validators.required],
    longitude: [0, Validators.required],
    fotos: [[] as string[]],
    colaboradorId: [{ value: '', disabled: true }, Validators.required],
  });

  async ngOnInit(): Promise<void> {
    const userId = this.auth.currentUser()?.id ?? '';
    this.form.patchValue({ colaboradorId: userId });
    await this.loadingAreasFlorestais();
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) return;
    this.isSubmitting.set(true);

    const raw = this.form.getRawValue();
    const payload: OcorrenciaRequest = {
      tipo: raw.tipo!,
      urgencia: raw.urgencia!,
      descricao: raw.descricao!,
      areaFlorestalId: Number(raw.areaFlorestalId),
      latitude: Number(raw.latitude),
      longitude: Number(raw.longitude),
      fotos: raw.fotos!,
      colaboradorId: this.auth.currentUser()!.id,
    };

    this.service.create(payload).subscribe({
      next: (res) => {
        this.toast.success(`Ocorrência registrada. Protocolo: ${res.protocolo}`);
        this.goBack();
      },
      error: () => {
        this.toast.error('Erro ao registrar ocorrência.');
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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const files = Array.from(input.files);
    const fotos: string[] = new Array(files.length);

    files.forEach((file, index) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const result = reader.result as ArrayBuffer;
          const compressed = pako.gzip(new Uint8Array(result));
          const base64 = this.uint8ToBase64(compressed);

          fotos[index] = base64;

          const concluidas = fotos.filter(f => !!f).length;
          if (concluidas === files.length) {
            this.form.patchValue({ fotos: [...fotos] });
            this.form.get('fotos')?.updateValueAndValidity();
          }
        } catch (error) {
          console.error('Erro ao processar arquivo:', file.name, error);
        }
      };

      reader.onerror = () => {
        console.error('Erro ao ler arquivo:', file.name);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  private uint8ToBase64(bytes: Uint8Array): string {
    let binary = '';
    const chunkSize = 8192;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  }
}

