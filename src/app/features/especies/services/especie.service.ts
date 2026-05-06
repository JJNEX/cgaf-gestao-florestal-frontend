import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DefaultResponse } from '../../../shared/models/default-response.model';
import { PageResponse } from '../../../shared/models/page-response.model';
import { EspecieRequest, EspecieResponse } from '../models/especie.model';

@Injectable({
  providedIn: 'root',
})
export class EspecieService {
  private readonly apiUrl = `${environment.apiUrl}/especie`;

  readonly especies = signal<EspecieResponse[]>([]);
  readonly page = signal<PageResponse<EspecieResponse> | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private readonly http: HttpClient) {}

  list(params?: { page?: number; size?: number }): Observable<PageResponse<EspecieResponse>> {
    this.isLoading.set(true);
    this.error.set(null);

    let httpParams = new HttpParams();
    if (params?.page != null) httpParams = httpParams.set('page', String(params.page));
    if (params?.size != null) httpParams = httpParams.set('size', String(params.size));

    return this.http.get<PageResponse<EspecieResponse>>(this.apiUrl, { params: httpParams }).pipe(
      tap((res) => {
        this.page.set(res);
        this.especies.set(res.content ?? []);
      }),
      catchError((err) => {
        this.error.set('Erro ao carregar espécies.');
        return throwError(() => err);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  getById(id: number): Observable<EspecieResponse> {
    return this.http.get<EspecieResponse>(`${this.apiUrl}/${id}`);
  }

  create(payload: EspecieRequest): Observable<EspecieResponse> {
    return this.http.post<EspecieResponse>(this.apiUrl, payload);
  }

  update(id: number, payload: EspecieRequest): Observable<DefaultResponse<EspecieResponse>> {
    return this.http.put<DefaultResponse<EspecieResponse>>(`${this.apiUrl}/${id}`, payload);
  }

  remove(id: number): Observable<DefaultResponse<void>> {
    return this.http.delete<DefaultResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
