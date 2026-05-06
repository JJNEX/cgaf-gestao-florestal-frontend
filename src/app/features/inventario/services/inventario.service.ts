import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PageResponse } from '../../../shared/models/page-response.model';
import { InventarioRequest, InventarioResponse } from '../models/inventario.model';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private readonly apiUrl = `${environment.apiUrl}/colaborador/inventario`;

  readonly inventarios = signal<InventarioResponse[]>([]);
  readonly page = signal<PageResponse<InventarioResponse> | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private readonly http: HttpClient) {}

  list(params?: { page?: number; size?: number }): Observable<PageResponse<InventarioResponse>> {
    this.isLoading.set(true);
    this.error.set(null);

    let httpParams = new HttpParams();
    if (params?.page != null) httpParams = httpParams.set('page', String(params.page));
    if (params?.size != null) httpParams = httpParams.set('size', String(params.size));

    return this.http.get<PageResponse<InventarioResponse>>(this.apiUrl, { params: httpParams }).pipe(
      tap((res) => {
        this.page.set(res);
        this.inventarios.set(res.content ?? []);
      }),
      catchError((err) => {
        this.error.set('Erro ao carregar inventários.');
        return throwError(() => err);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  create(payload: InventarioRequest): Observable<InventarioResponse> {
    return this.http.post<InventarioResponse>(this.apiUrl, payload);
  }

  getById(id: number): Observable<InventarioResponse> {
    return this.http.get<InventarioResponse>(`${this.apiUrl}/${id}`);
  }
}
