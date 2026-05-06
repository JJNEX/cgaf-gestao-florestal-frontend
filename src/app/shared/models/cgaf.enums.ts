export type Perfil = 'ADMIN' | 'USER';

export type TipoFloresta = 'NATIVA' | 'PLANTADA' | 'MISTA';
export type BiomaPredominante =
  | 'AMAZONIA'
  | 'CERRADO'
  | 'MATA_ATLANTICA'
  | 'CAATINGA'
  | 'PAMPA'
  | 'PANTANAL';

export type CategoriaRecurso = 'VEICULO' | 'FERRAMENTA_MANUAL' | 'EPI' | 'INSUMO_QUIMICO';

export type PorteEspecie = 'ARBOREO' | 'ARBUSTIVO' | 'HERBACEO';
export type ConservacaoEspecie = 'AMEACADA' | 'VULNERAVEL' | 'POUCO_PREOCUPANTE';

export type EstadoGeralInventario = 'OTIMO' | 'BOM' | 'REGULAR' | 'CRITICO';

export type TipoOcorrencia =
  'INCENDIO' |
  'DESMATAMENTO_ILEGAL' |
  'EROSAO' |
  'ESPECIES_INVASORAS' |
  'PRAGAS_DOENCAS' |
  'ACIDENTE_ANIMAL' |
  'ACIDENTE_EQUIPE' |
  'INFRACAO_AMBIENTAL';

export type UrgenciaOcorrencia = 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';

