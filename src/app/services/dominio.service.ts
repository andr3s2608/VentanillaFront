import { environments } from '../../environments/environments';
import { get } from './settings/http.service';

class DominioService {
  private endpoint = environments.endpoint;

  get_type = (tipoDominio: ETipoDominio) =>
    get<IDominio[]>({ endpoint: this.endpoint, url: `Dominio/GetAllDominio/${tipoDominio}` });

  get_departamentos_colombia = () => get<IDepartamento[]>({ endpoint: this.endpoint, url: `Departamento/GetAllDepartamento` });

  get_municipios_by_departamento = (idDepartamento: string) =>
    get<IMunicipio[]>({ endpoint: this.endpoint, url: `Municipio/GetMunicipioByIdDepartamento/${idDepartamento}` });

  get_localidades_bogota = () => get<ILocalidad[]>({ endpoint: this.endpoint, url: `Localidad/GetAllLocalidad` });

  get_upz_by_localidad = (idLocalidad: string) =>
    get<IUpz[]>({ endpoint: this.endpoint, url: `Upz/GetUpzByIdLocalidad/${idLocalidad}` });

  get_barrio_by_upz = (idUpz: string) => get<IBarrio[]>({ endpoint: this.endpoint, url: `Barrio/GetBarrioByIdUpz/${idUpz}` });

  get_cementerios_bogota = () => get<ICementerio[]>({ endpoint: this.endpoint, url: `Cementerio/GetAllCementerio` });

  search_profesional_salud_by_documento = (documento: string) =>
    get<IProfesionalSalud[]>({
      endpoint: this.endpoint,
      url: `ProfesionalesSalud/GetProfesionalSaludByNumeroIdentificacion/${documento}`,
      cancel: true
    });
}

const dominioService: DominioService = new DominioService();
export { dominioService };

export enum ETipoDominio {
  'Tipo de Muerte' = '9D4811D3-163D-4DB2-87D8-053A3BDA96F1',
  'Orientacion Sexual' = '551FDB94-7D6D-476F-9D76-07A0F13A4576',
  'Pais' = '321A9B9B-6F4B-4658-A2D0-103D98B1FCFE',
  'Sitio de Defuncion' = '1A8A6791-C4B1-43F5-B1EF-21BC066A1706',
  'Unidad de Medida Edad' = '67F409E0-F8AF-4737-BF52-3153C06FB606',
  'Tipo de Profesional' = 'E9A684AF-B18F-43DE-8FA7-423CE4321E65',
  'Condicion Mujer' = '3574E1BB-4E3F-4ABA-82D6-77C090473162',
  'Area de Defuncion' = '281BB898-A68C-4FBC-AEA7-79B5E6580348',
  'Genero' = '571C4B4A-E34A-42E6-94AC-7DC528D218DD',
  'Etnia' = 'C20E4378-8B2D-4680-8C11-817021CEE4CC',
  'Zona' = '2AE8DC5A-B8B9-4678-8658-BF25665E065D',
  'Aseguradora' = '1CCDC026-0FBF-495C-A8D7-D1D68B9110FD',
  'Vacuna' = '217A868D-7040-48C9-9D60-D2B0F031B5BE',
  'Tipo Documento' = '45D1338E-5D01-44E4-A9C0-E39820845791',
  'Estado Civil' = 'DA6593EA-B5F6-464F-AFAC-734DBA376AF1',
  'Nivel Educativo' = 'E3589B9B-34BD-4892-82E2-0AA730E98E5E',
  'Regimen' = 'AABCD5DE-3C63-454F-9149-DE9E9503561A'
}

export interface IDominio {
  id: string;
  descripcion: string;
}

interface IListGeneral {
  descripcion: string;
  estado: boolean;
}

export interface IDepartamento extends IListGeneral {
  idDepartamento: string;
  idDepPai: number;
  idPais: string;
}

export interface ILocalidad extends IListGeneral {
  idLocalidad: string;
  idSubred: number;
  locId: number;
}

export interface IMunicipio extends IListGeneral {
  idMunicipio: string;
  cabecera: string;
  idDepPai: number;
  idDepartamento: string;
  munId: number;
}

export interface IUpz extends IListGeneral {
  idUpz: string;
  upzId: number;
  upzLocalidad: number;
  idLocalidad: string;
}

export interface IBarrio extends IListGeneral {
  idBarrio: string;
  idUpz: string;
  upzId: number;
}

export interface ICementerio {
  CREMACION: string;
  DIRECCION: string;
  NOMBRE_REP: string;
  NROIDENT: number;
  NROIDENT_REP: number;
  RAZON_S: string;
  TELEFONO_1: string;
  TELEFONO_2: string;
  TIPO_I: string;
  TIPO_I_REP: string;
}

export interface IProfesionalSalud {
  TIPO_I: string;
  NROIDENT: number;
  SITIO_EXP_IDENT: string;
  NOMBRES: string;
  APELLIDOS: string;
}
