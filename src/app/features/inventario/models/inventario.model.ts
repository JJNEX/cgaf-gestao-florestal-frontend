import { IsoDateString, Long, Uuid } from '../../../shared/models/api.types';
import { EstadoGeralInventario } from '../../../shared/models/cgaf.enums';

export interface InventarioRequest {
  numeroParcela: string;
  areaFlorestalId: Long;
  especieId: Long;
  quantidadeIndividuos: number;
  dapMedio: number;
  alturaMedia: number;
  presencaPragasDoencas: boolean;
  estadoGeral: EstadoGeralInventario;
  dataVistoria: IsoDateString;
  colaboradorId: Uuid;
}

export interface InventarioResponse {
  id: Long;
  numeroParcela: string;
  nomeAreaFlorestal: string;
  nomeEspecie: string;
  quantidadeIndividuos: number;
  dapMedio: number;
  alturaMedia: number;
  presencaPragasDoencas: boolean;
  estadoGeral: EstadoGeralInventario;
  dataVistoria: IsoDateString;
  nomeColaborador: string;
}

