import { IsoDateString, IsoDateTimeString, Uuid } from '../../../shared/models/api.types';

export interface ColaboradorRequest {
  nome: string;
  email: string;
  senha?: string;
  ativo?: boolean;
  cpf: string;
  matricula: string;
  funcao: string;
  areaAtuacao: string;
  dataAdmissao: IsoDateString;
  contatoEmergencia: string;
  qualificacoes: string;
}

export interface ColaboradorResponse {
  id: Uuid;
  nome: string;
  email: string;
  ativo: boolean;
  cpf: string;
  matricula: string;
  funcao: string;
  areaAtuacao: string;
  dataAdmissao: IsoDateString;
  contatoEmergencia: string;
  qualificacoes: string;
  dataCriacao: IsoDateTimeString;
  dataAtualizacao: IsoDateTimeString;
}

export interface ColaboradorOptions {
  id: Uuid;
  nome: string;
}