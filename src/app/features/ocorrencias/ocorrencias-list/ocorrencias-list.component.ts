import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ErrorCard } from '../../../shared/components/error-card/error-card';
import { OcorrenciaService } from '../services/ocorrencia.service';

@Component({
  selector: 'app-ocorrencias-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeader, SpinnerComponent, ErrorCard],
  templateUrl: './ocorrencias-list.component.html',
  styleUrl: './ocorrencias-list.component.css',
})
export class OcorrenciasListComponent implements OnInit {
  readonly service = inject(OcorrenciaService);
  readonly pageNumber = signal(0);
  readonly pageSize = signal(20);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.list({ page: this.pageNumber(), size: this.pageSize() }).subscribe();
  }

  prevPage(): void {
    if (this.service.page()?.first) return;
    this.pageNumber.update((v) => Math.max(0, v - 1));
    this.load();
  }

  nextPage(): void {
    if (this.service.page()?.last) return;
    this.pageNumber.update((v) => v + 1);
    this.load();
  }
}

