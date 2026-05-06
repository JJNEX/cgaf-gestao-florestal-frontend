import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PageResponse } from '../../../shared/models/page-response.model';
import { PlantioRequest, PlantioResponse } from '../models/plantio.model';

@Injectable({
  providedIn: 'root',
})
export class PlantioService {
  private readonly apiUrl = `${environment.apiUrl}/colaborador/plantio`;

  readonly plantios = signal<PlantioResponse[]>([]);
  readonly page = signal<PageResponse<PlantioResponse> | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private readonly http: HttpClient) {}

  list(params?: { page?: number; size?: number }): Observable<PageResponse<PlantioResponse>> {
    this.isLoading.set(true);
    this.error.set(null);

    let httpParams = new HttpParams();
    if (params?.page != null) httpParams = httpParams.set('page', String(params.page));
    if (params?.size != null) httpParams = httpParams.set('size', String(params.size));

    return this.http.get<PageResponse<PlantioResponse>>(this.apiUrl, { params: httpParams }).pipe(
      tap((res) => {
        this.page.set(res);
        this.plantios.set(res.content ?? []);
      }),
      catchError((err) => {
        this.error.set('Erro ao carregar plantios.');
        return throwError(() => err);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  create(payload: PlantioRequest): Observable<PlantioResponse> {
    return this.http.post<PlantioResponse>(this.apiUrl, payload);
  }

  getById(id: number): Observable<PlantioResponse> {
    return this.http.get<PlantioResponse>(`${this.apiUrl}/${id}`);
  }
}
