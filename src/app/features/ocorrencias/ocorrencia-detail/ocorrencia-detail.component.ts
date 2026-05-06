import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ErrorCard } from '../../../shared/components/error-card/error-card';
import { OcorrenciaService } from '../services/ocorrencia.service';
import { OcorrenciaResponse } from '../models/ocorrencia.model';
import Pako from 'pako';

@Component({
  selector: 'app-ocorrencia-detail',
  standalone: true,
  imports: [CommonModule, PageHeader, SpinnerComponent, ErrorCard],
  templateUrl: './ocorrencia-detail.component.html',
  styleUrl: './ocorrencia-detail.component.css',
})
export class OcorrenciaDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly service = inject(OcorrenciaService);

  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly ocorrencia = signal<OcorrenciaResponse | null>(null);

  fotosRenderizadas: string[] = [];

  ngOnInit(): void {
    this.load();
  }

  private get protocolo(): string | null {
    const p = this.route.snapshot.paramMap.get('protocolo');
    return p ? p.trim() : null;
  }

  load(): void {
    const protocolo = this.protocolo;
    if (!protocolo) {
      this.error.set('Protocolo inválido.');
      this.isLoading.set(false);
      return;
    }
    this.isLoading.set(true);
    this.error.set(null);
    this.service.getByProtocolo(protocolo).subscribe({
      next: (res) => {
        this.ocorrencia.set(res);
        this.carregarFotos();
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar detalhes da ocorrência.');
        this.isLoading.set(false);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }

  carregarFotos(): void {
    const fotos = this.ocorrencia()?.fotos ?? [];

    this.fotosRenderizadas = fotos
      .map((fotoCompactada) => this.base64GzipToImageUrl(fotoCompactada))
      .filter((url): url is string => !!url);
  }

  private base64GzipToImageUrl(base64: string): string | null {
    try {
      /* base64 -> bytes compactados */
      const compressedBytes = this.base64ToUint8Array(base64);

      /* descompacta gzip -> bytes originais da imagem */
      const imageBytes = Pako.ungzip(compressedBytes);

      /* monta Blob da imagem */
      const blob = new Blob([imageBytes], { type: 'image/jpeg' });

      /* gera URL para usar no <img src> */
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Erro ao descompactar/renderizar foto:', error);
      return null;
    }
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  }
}

