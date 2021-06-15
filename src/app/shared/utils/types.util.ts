export type TypeLicencia = 'Cremación' | 'Inhumación';
export type TypeIndividuo = 'Individual' | 'Fetal';

export interface ITipoLicencia {
  tipoLicencia: TypeLicencia;
  tipoIndividuo?: TypeIndividuo;
}
