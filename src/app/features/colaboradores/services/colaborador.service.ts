import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ColaboradorRequest, ColaboradorResponse } from '../models/colaborador.model';
import { PageResponse } from '../../../shared/models/page-response.model';
import { DefaultResponse } from '../../../shared/models/default-response.model';

@Injectable({
  providedIn: 'root',
})
export class ColaboradorService {
  private readonly apiUrl = `${environment.apiUrl}/admin/colaborador`;

  readonly colaboradores = signal<ColaboradorResponse[]>([]);
  readonly page = signal<PageResponse<ColaboradorResponse> | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private readonly http: HttpClient) {}

  list(params?: { page?: number; size?: number }): Observable<PageResponse<ColaboradorResponse>> {
    this.isLoading.set(true);
    this.error.set(null);

    let httpParams = new HttpParams();
    if (params?.page != null) httpParams = httpParams.set('page', String(params.page));
    if (params?.size != null) httpParams = httpParams.set('size', String(params.size));

    return this.http.get<PageResponse<ColaboradorResponse>>(this.apiUrl, { params: httpParams }).pipe(
      tap((response) => {
        this.page.set(response);
        this.colaboradores.set(response.content ?? []);
      }),
      catchError((err) => {
        this.error.set('Erro ao carregar colaboradores.');
        return throwError(() => err);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  getById(id: string): Observable<ColaboradorResponse> {
    return this.http.get<ColaboradorResponse>(`${this.apiUrl}/${id}`);
  }

  create(colaborador: ColaboradorRequest): Observable<ColaboradorResponse> {
    return this.http.post<ColaboradorResponse>(this.apiUrl, colaborador);
  }

  update(id: string, colaborador: ColaboradorRequest): Observable<DefaultResponse<ColaboradorResponse>> {
    return this.http.put<DefaultResponse<ColaboradorResponse>>(`${this.apiUrl}/${id}`, colaborador);
  }

  remove(id: string): Observable<DefaultResponse<void>> {
    return this.http.delete<DefaultResponse<void>>(`${this.apiUrl}/${id}`);
  }

  listAtivo(params?: { page?: number; size?: number }): Observable<PageResponse<ColaboradorResponse>> {
    this.isLoading.set(true);
    this.error.set(null);

    let httpParams = new HttpParams();
    if (params?.page != null) httpParams = httpParams.set('page', String(params.page));
    if (params?.size != null) httpParams = httpParams.set('size', String(params.size));

    return this.http.get<PageResponse<ColaboradorResponse>>(`${this.apiUrl}/ativo`, { params: httpParams }).pipe(
      tap((response) => {
        this.page.set(response);
        this.colaboradores.set(response.content ?? []);
      }),
      catchError((err) => {
        this.error.set('Erro ao carregar colaboradores ativos.');
        return throwError(() => err);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }
}
