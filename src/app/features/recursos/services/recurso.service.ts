import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DefaultResponse } from '../../../shared/models/default-response.model';
import { PageResponse } from '../../../shared/models/page-response.model';
import { EquipamentoInsumoRequest, EquipamentoInsumoResponse } from '../models/recurso.model';

@Injectable({
  providedIn: 'root',
})
export class RecursoService {
  private readonly apiUrl = `${environment.apiUrl}/admin/recurso`;

  readonly recursos = signal<EquipamentoInsumoResponse[]>([]);
  readonly page = signal<PageResponse<EquipamentoInsumoResponse> | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private readonly http: HttpClient) {}

  list(params?: { page?: number; size?: number }): Observable<PageResponse<EquipamentoInsumoResponse>> {
    this.isLoading.set(true);
    this.error.set(null);

    let httpParams = new HttpParams();
    if (params?.page != null) httpParams = httpParams.set('page', String(params.page));
    if (params?.size != null) httpParams = httpParams.set('size', String(params.size));

    return this.http.get<PageResponse<EquipamentoInsumoResponse>>(this.apiUrl, { params: httpParams }).pipe(
      tap((res) => {
        this.page.set(res);
        this.recursos.set(res.content ?? []);
      }),
      catchError((err) => {
        this.error.set('Erro ao carregar recursos.');
        return throwError(() => err);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  getById(id: number): Observable<EquipamentoInsumoResponse> {
    return this.http.get<EquipamentoInsumoResponse>(`${this.apiUrl}/${id}`);
  }

  create(payload: EquipamentoInsumoRequest): Observable<EquipamentoInsumoResponse> {
    return this.http.post<EquipamentoInsumoResponse>(this.apiUrl, payload);
  }

  update(id: number, payload: EquipamentoInsumoRequest): Observable<DefaultResponse<EquipamentoInsumoResponse>> {
    return this.http.put<DefaultResponse<EquipamentoInsumoResponse>>(`${this.apiUrl}/${id}`, payload);
  }

  ajustarEstoque(id: number, quantidade: number): Observable<DefaultResponse<EquipamentoInsumoResponse>> {
    const params = new HttpParams().set('quantidade', String(quantidade));
    return this.http.patch<DefaultResponse<EquipamentoInsumoResponse>>(`${this.apiUrl}/${id}/estoque`, null, { params });
  }

  remove(id: number): Observable<DefaultResponse<void>> {
    return this.http.delete<DefaultResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
