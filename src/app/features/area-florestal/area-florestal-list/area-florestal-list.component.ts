import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AreaFlorestalService } from '../services/area-florestal.service';
import { ErrorCard } from '../../../shared/components/error-card/error-card';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-area-florestal-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeader, SpinnerComponent, ErrorCard],
  templateUrl: './area-florestal-list.component.html',
  styleUrl: './area-florestal-list.component.css',
})
export class AreaFlorestalListComponent implements OnInit {
  readonly service = inject(AreaFlorestalService);

  readonly statusFilter = signal<string>('');
  readonly pageNumber = signal(0);
  readonly pageSize = signal(20);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const status = this.statusFilter().trim();
    this.service
      .list({
        status: status ? status : undefined,
        page: this.pageNumber(),
        size: this.pageSize(),
      })
      .subscribe();
  }

  applyFilter(): void {
    this.pageNumber.set(0);
    this.load();
  }

  onStatusInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    this.statusFilter.set(value);
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
