import { IsoDateString, Long, Uuid } from '../../../shared/models/api.types';
import { BiomaPredominante, TipoFloresta } from '../../../shared/models/cgaf.enums';

export interface AlocacaoResponse {
  id: Long;
  idColaborador: Uuid;
  nomeColaborador: string;
  dataInicio: IsoDateString;
  dataFim: IsoDateString | null;
}

export interface AreaFlorestalRequest {
  nome: string;
  latitude: number;
  longitude: number;
  municipio: string;
  estado: string;
  tamanhoHectares: number;
  status: string;
  tipoFloresta: TipoFloresta;
  biomaPredominante: BiomaPredominante;
}

export interface AreaFlorestalResponse {
  id: Long;
  nome: string;
  latitude: number;
  longitude: number;
  municipio: string;
  estado: string;
  tamanhoHectares: number;
  tipoFloresta: TipoFloresta;
  biomaPredominante: BiomaPredominante;
  status: string;
  alocacoes: AlocacaoResponse[];
}

export interface AlocacaoRequest {
  idColaborador: Uuid;
  idAreaFlorestal: Long;
  dataInicio: IsoDateString;
}

export interface AreaFlorestalSelectOption {
  id: Long;
  nome: string;
}

