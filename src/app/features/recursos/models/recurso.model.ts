import { IsoDateString, IsoDateTimeString, Long } from '../../../shared/models/api.types';
import { CategoriaRecurso } from '../../../shared/models/cgaf.enums';

export interface EquipamentoInsumoRequest {
  codigoPatrimonial: string;
  descricao: string;
  categoria: CategoriaRecurso;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  unidadeMedida: string;
  localizacaoAtual: string;
  dataAquisicao: IsoDateString;
  vidaUtilEstimada: number;
  responsavelGuarda: string;
}

export interface EquipamentoInsumoResponse {
  id: Long;
  codigoPatrimonial: string;
  descricao: string;
  categoria: CategoriaRecurso;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  unidadeMedida: string;
  localizacaoAtual: string;
  dataAquisicao: IsoDateString;
  vidaUtilEstimada: number;
  responsavelGuarda: string;
  ativo: boolean;
  dataCriacao: IsoDateTimeString;
}

