import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ErrorCard } from '../../../shared/components/error-card/error-card';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { EspecieService } from '../services/especie.service';

@Component({
  selector: 'app-especies-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeader, SpinnerComponent, ErrorCard],
  templateUrl: './especies-list.component.html',
  styleUrl: './especies-list.component.css',
})
export class EspeciesListComponent implements OnInit {
  readonly service = inject(EspecieService);
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

