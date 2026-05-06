import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DefaultResponse } from '../../../shared/models/default-response.model';
import { PageResponse } from '../../../shared/models/page-response.model';
import {
  AlocacaoRequest,
  AlocacaoResponse,
  AreaFlorestalRequest,
  AreaFlorestalResponse,
} from '../models/area-florestal.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AreaFlorestalService {
  private readonly http: HttpClient;
  private readonly apiUrl = `${environment.apiUrl}/area-florestal`;
  private readonly alocacaoUrl = `${environment.apiUrl}/admin/area-colaborador/alocacao`;

  readonly areas = signal<AreaFlorestalResponse[]>([]);
  readonly page = signal<PageResponse<AreaFlorestalResponse> | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly authService = inject(AuthService);

  constructor(http: HttpClient) {
    this.http = http;
  }

  list(params?: { status?: string; page?: number; size?: number }): Observable<PageResponse<AreaFlorestalResponse>> {
    this.isLoading.set(true);
    this.error.set(null);

    let httpParams = new HttpParams();
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.page != null) httpParams = httpParams.set('page', String(params.page));
    if (params?.size != null) httpParams = httpParams.set('size', String(params.size));

    return this.http.get<PageResponse<AreaFlorestalResponse>>(this.apiUrl, { params: httpParams }).pipe(
      tap((res) => {
        this.page.set(res);
        this.areas.set(res.content ?? []);
      }),
      catchError((err) => {
        this.error.set('Erro ao carregar áreas florestais.');
        return throwError(() => err);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  getById(id: number): Observable<AreaFlorestalResponse> {
    return this.http.get<AreaFlorestalResponse>(`${this.apiUrl}/${id}`);
  }

  create(payload: AreaFlorestalRequest): Observable<AreaFlorestalResponse> {
    return this.http.post<AreaFlorestalResponse>(this.apiUrl, payload);
  }

  update(id: number, payload: AreaFlorestalRequest): Observable<DefaultResponse<AreaFlorestalResponse>> {
    return this.http.put<DefaultResponse<AreaFlorestalResponse>>(`${this.apiUrl}/${id}`, payload);
  }

  remove(id: number): Observable<DefaultResponse<void>> {
    return this.http.delete<DefaultResponse<void>>(`${this.apiUrl}/${id}`);
  }

  criarAlocacao(payload: AlocacaoRequest): Observable<AlocacaoResponse> {
    return this.http.post<AlocacaoResponse>(this.alocacaoUrl, payload);
  }

  encerrarAlocacao(id: number, dataFim: string): Observable<DefaultResponse<void>> {
    const params = new HttpParams().set('dataFim', dataFim);
    return this.http.put<DefaultResponse<void>>(`${this.alocacaoUrl}/encerrar/${id}`, null, { params });
  }
}
