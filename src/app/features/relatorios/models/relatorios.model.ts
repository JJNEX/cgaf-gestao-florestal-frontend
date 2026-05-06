import { IsoDateString, Long } from '../../../shared/models/api.types';
import { BiomaPredominante, ConservacaoEspecie } from '../../../shared/models/cgaf.enums';

export interface RelatorioBiomaResponse {
  bioma: BiomaPredominante;
  totalAreas: Long;
  totalHectares: number;
}

export interface FichaTecnicaEspecieResponse {
  nomeCientifico: string;
  nomePopular: string;
  conservacao: ConservacaoEspecie;
  exigenciasClimaticasSolo: string;
  nativa: boolean;
}

export interface AlertaEstoqueResponse {
  codigoPatrimonial: string;
  descricao: string;
  quantidadeAtual: number;
  estoqueMinimo: number;
  unidadeMedida: string;
  responsavelGuarda: string;
}

export interface PrevisaoReposicaoResponse {
  codigoPatrimonial: string;
  descricao: string;
  dataAquisicao: IsoDateString;
  vidaUtilRestanteAnos: number;
  previsaoReposicao: IsoDateString;
}

export interface ProdutividadeColaboradorResponse {
  nomeColaborador: string;
  mudasPlantadasNoMes: Long;
  vistoriasRealizadasNoMes: Long;
  ocorrenciasRelatadasNoMes: Long;
}

