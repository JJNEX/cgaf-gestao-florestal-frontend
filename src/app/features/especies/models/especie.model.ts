import { IsoDateTimeString, Long } from '../../../shared/models/api.types';
import { ConservacaoEspecie, PorteEspecie } from '../../../shared/models/cgaf.enums';

export interface EspecieRequest {
  nomeCientifico: string;
  nomePopular: string;
  familia: string;
  porte: PorteEspecie;
  conservacao: ConservacaoEspecie;
  cicloVidaAnos: number;
  exigenciasClimaticasSolo: string;
  nativa: boolean;
}

export interface EspecieResponse extends EspecieRequest {
  id: Long;
  ativo: boolean;
  dataCriacao: IsoDateTimeString;
}

export interface EspecieSelectOption {
  id: Long;
  nome: string;
}

