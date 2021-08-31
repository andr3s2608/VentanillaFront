import { environments } from '../../environments/environments';
import { get, post } from './settings/http.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { IPersonaNatural } from 'app/Models/IPersonaNatural';
import { IResponse } from 'app/Models/IResponse';
import { IRoles } from 'app/Models/IRoles';
import { Menu } from 'app/Models/IMenu';
import { IEstadoSolicitud } from 'app/Models/IEstadoSolicitud';

export class ApiService {
  endpoint = environments.shared;
  private oid = '';

  constructor(oid$: string) {
    this.oid = oid$;
  }

  personaNatural = (tipoDominio: IPersonaNatural) =>
    post<IPersonaNatural>({ endpoint: environments.shared, url: `v2/Persona/AddPersonaNatural`, payload: tipoDominio });

  personaJuridica = (tipoDominio: IPersonaNatural) =>
    post<IPersonaNatural>({ endpoint: this.endpoint, url: `v2/Persona/AddPersonaJuridica`, payload: tipoDominio });

  GetMenuUser = () => get<Menu[]>({ endpoint: environments.security, url: `Security/GetMenuByUser/${this.oid}` });

  GetRoles = () => get<IRoles[]>({ endpoint: environments.security, url: `Security/GetRoleByIdUser/${this.oid}` });
  AddUser = (payload: any) =>
    post<any>({ endpoint: environments.security, url: `Security/AddUser`, payload, confirmModal: false });

  PostRolesUser = (payload: any) =>
    post({ endpoint: environments.security, url: 'Security/AddUserRole', payload, confirmModal: false });

  GetSexo = () => get<[]>({ endpoint: environments.shared, url: 'v1/Sexo/GetSexo' });

  GetEtnia = () => get<[]>({ endpoint: environments.shared, url: 'v1/Etnia/GetEtnia' });

  getTipoDocumeto = () => get<[]>({ endpoint: environments.shared, url: 'v1/TipoIdentificacion/GetTipoIdentificacion' });

  getPaises = () => get<[]>({ endpoint: environments.shared, url: 'v1/Pais/GetPais' });

  getDepartament = () => get<[]>({ endpoint: environments.shared, url: 'v1/Departamento/GetAllDepartamento' });

  getMunicipio = (id: string) =>
    get<[]>({ endpoint: environments.shared, url: `v1/Municipio/GetMunicipioByIdDepartamento/${id}` });

  GetNivelEducativo = () => get<[]>({ endpoint: environments.shared, url: 'v1/NivelEducativo/GetNivelEducativo' });
  //
  postLicencia = (payload: any) => post({ endpoint: environments.inhcremacion, url: 'Request/AddRquest', payload });
  GetEstadoSolicitud = (oid: any) => get({ endpoint: environments.inhcremacion, url: `Request/GetRequestByIdUser/${oid}` });
}
