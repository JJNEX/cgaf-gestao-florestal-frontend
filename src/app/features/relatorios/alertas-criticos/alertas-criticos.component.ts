import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ErrorCard } from '../../../shared/components/error-card/error-card';
import { RelatoriosService } from '../services/relatorios.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-alertas-criticos',
  standalone: true,
  imports: [CommonModule, PageHeader, SpinnerComponent, ErrorCard],
  templateUrl: './alertas-criticos.component.html',
  styleUrl: './alertas-criticos.component.css',
})
export class AlertasCriticosComponent implements OnInit {
  private readonly service = inject(RelatoriosService);
  private readonly location = inject(Location);

  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly total = signal<number | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.total.set(null);

    this.service.alertasCriticos().subscribe({
      next: (res) => {
        this.total.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar alertas críticos.');
        this.isLoading.set(false);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}

