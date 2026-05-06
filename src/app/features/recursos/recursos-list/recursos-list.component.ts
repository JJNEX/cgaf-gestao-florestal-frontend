import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ErrorCard } from '../../../shared/components/error-card/error-card';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { RecursoService } from '../services/recurso.service';

@Component({
  selector: 'app-recursos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeader, SpinnerComponent, ErrorCard],
  templateUrl: './recursos-list.component.html',
  styleUrl: './recursos-list.component.css',
})
export class RecursosListComponent implements OnInit {
  readonly service = inject(RecursoService);
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

