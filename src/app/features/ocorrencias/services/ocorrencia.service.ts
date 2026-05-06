import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PageResponse } from '../../../shared/models/page-response.model';
import { OcorrenciaRequest, OcorrenciaResponse } from '../models/ocorrencia.model';

@Injectable({
  providedIn: 'root',
})
export class OcorrenciaService {
  private readonly apiUrl = `${environment.apiUrl}/colaborador/ocorrencia`;

  readonly ocorrencias = signal<OcorrenciaResponse[]>([]);
  readonly page = signal<PageResponse<OcorrenciaResponse> | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private readonly http: HttpClient) {}

  list(params?: { page?: number; size?: number }): Observable<PageResponse<OcorrenciaResponse>> {
    this.isLoading.set(true);
    this.error.set(null);

    let httpParams = new HttpParams();
    if (params?.page != null) httpParams = httpParams.set('page', String(params.page));
    if (params?.size != null) httpParams = httpParams.set('size', String(params.size));

    return this.http.get<PageResponse<OcorrenciaResponse>>(this.apiUrl, { params: httpParams }).pipe(
      tap((res) => {
        this.page.set(res);
        this.ocorrencias.set(res.content ?? []);
      }),
      catchError((err) => {
        this.error.set('Erro ao carregar ocorrências.');
        return throwError(() => err);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  create(payload: OcorrenciaRequest): Observable<OcorrenciaResponse> {
    return this.http.post<OcorrenciaResponse>(this.apiUrl, payload);
  }

  getByProtocolo(protocolo: string): Observable<OcorrenciaResponse> {
    return this.http.get<OcorrenciaResponse>(`${this.apiUrl}/${protocolo}`);
  }
}
