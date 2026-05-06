import { IsoDateTimeString, Uuid } from '../../../shared/models/api.types';
import { Perfil } from '../../../shared/models/cgaf.enums';
import { DefaultResponse } from '../../../shared/models/default-response.model';

export interface AutenticacaoRequest {
  email: string;
  senha: string;
}

export interface AutenticacaoResponse {
  id: Uuid;
  email: string;
  token: string;
  ultimoLogin: IsoDateTimeString;
  perfil: Perfil;
}

export type AutenticacaoDefaultResponse = DefaultResponse<AutenticacaoResponse>;

