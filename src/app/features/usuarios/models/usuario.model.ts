import { IsoDateTimeString, Uuid } from '../../../shared/models/api.types';
import { Perfil } from '../../../shared/models/cgaf.enums';

export interface Usuario {
  id: Uuid;
  nome: string;
  email: string;
  ativo: boolean;
  perfil: Perfil;
  ultimoLogin: IsoDateTimeString;
  dataCriacao: IsoDateTimeString;
  dataAtualizacao: IsoDateTimeString;
}

export interface AdministradorRequest {
  nome: string;
  email: string;
  senha: string;
}
