import { IsoDateTimeString, Long, Uuid } from '../../../shared/models/api.types';
import { TipoOcorrencia, UrgenciaOcorrencia } from '../../../shared/models/cgaf.enums';

export interface OcorrenciaRequest {
  tipo: TipoOcorrencia;
  latitude: number;
  longitude: number;
  fotos: string[];
  urgencia: UrgenciaOcorrencia;
  descricao: string;
  areaFlorestalId: Long;
  colaboradorId: Uuid;
}

export interface OcorrenciaResponse {
  id: Long;
  tipo: TipoOcorrencia;
  latitude: number;
  longitude: number;
  fotos: string[];
  urgencia: UrgenciaOcorrencia;
  descricao: string;
  protocolo: string;
  nomeAreaFlorestal: string;
  nomeColaborador: string;
  dataOcorrencia: IsoDateTimeString;
}

