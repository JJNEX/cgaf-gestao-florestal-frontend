import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DefaultResponse } from '../../../shared/models/default-response.model';
import { PageResponse } from '../../../shared/models/page-response.model';
import {
  AlertaEstoqueResponse,
  FichaTecnicaEspecieResponse,
  PrevisaoReposicaoResponse,
  ProdutividadeColaboradorResponse,
  RelatorioBiomaResponse,
} from '../models/relatorios.model';

@Injectable({
  providedIn: 'root',
})
export class RelatoriosService {
  private readonly baseUrl = `${environment.apiUrl}/admin/relatorio`;

  constructor(private readonly http: HttpClient) {}

  porBioma(): Observable<PageResponse<RelatorioBiomaResponse>> {
    return this.http.get<PageResponse<RelatorioBiomaResponse>>(`${this.baseUrl}/por-bioma`);
  }

  fichasTecnicas(): Observable<PageResponse<FichaTecnicaEspecieResponse>> {
    return this.http.get<PageResponse<FichaTecnicaEspecieResponse>>(`${this.baseUrl}/especies/fichas-tecnicas`);
  }

  alertasEstoque(): Observable<PageResponse<AlertaEstoqueResponse>> {
    return this.http.get<PageResponse<AlertaEstoqueResponse>>(`${this.baseUrl}/estoque/alertas`);
  }

  previsaoReposicao(): Observable<PageResponse<PrevisaoReposicaoResponse>> {
    return this.http.get<PageResponse<PrevisaoReposicaoResponse>>(`${this.baseUrl}/estoque/previsao`);
  }

  produtividade(colaboradorId: string): Observable<ProdutividadeColaboradorResponse> {
    return this.http.get<ProdutividadeColaboradorResponse>(`${this.baseUrl}/produtividade/${colaboradorId}`);
  }

  alertasCriticos(): Observable<DefaultResponse<number>> {
    return this.http.get<DefaultResponse<number>>(`${this.baseUrl}/alertas/criticos`);
  }
}

