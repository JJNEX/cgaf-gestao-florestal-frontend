import { IsoDateTimeString, Long, Uuid } from '../../../shared/models/api.types';

export interface PlantioRequest {
  dataHora: IsoDateTimeString;
  areaFlorestalId: Long;
  especieId: Long;
  quantidadeMudas: number;
  latitudeTalhao: number;
  longitudeTalhao: number;
  temperatura: number;
  umidade: number;
  chuva: boolean;
  metodoPlantio: string;
  observacoes: string;
  colaboradorId: Uuid;
}

export interface PlantioResponse {
  id: Long;
  dataHora: IsoDateTimeString;
  nomeAreaFlorestal: string;
  nomeEspecie: string;
  quantidadeMudas: number;
  latitudeTalhao: number;
  longitudeTalhao: number;
  temperatura: number;
  umidade: number;
  chuva: boolean;
  metodoPlantio: string;
  observacoes: string;
  nomeColaborador: string;
}

