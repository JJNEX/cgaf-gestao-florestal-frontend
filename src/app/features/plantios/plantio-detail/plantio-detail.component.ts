import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ErrorCard } from '../../../shared/components/error-card/error-card';
import { PlantioService } from '../services/plantio.service';
import { PlantioResponse } from '../models/plantio.model';

@Component({
  selector: 'app-plantio-detail',
  standalone: true,
  imports: [CommonModule, PageHeader, SpinnerComponent, ErrorCard],
  templateUrl: './plantio-detail.component.html',
  styleUrls: ['./plantio-detail.component.css']
})
export class PlantioDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly service = inject(PlantioService);

  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly plantio = signal<PlantioResponse | null>(null);

  ngOnInit(): void {
    this.load();
  }

  private get plantioId(): number | null {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? parseInt(id, 10) : null;
  }

  load(): void {
    const id = this.plantioId;
    if (!id) {
      this.error.set('ID inválido.');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.service.getById(id).subscribe({
      next: (res) => {
        this.plantio.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar dados do plantio.');
        this.isLoading.set(false);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
