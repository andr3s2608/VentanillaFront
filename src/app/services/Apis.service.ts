import { environments } from '../../environments/environments';
import { get, post, put } from './settings/http.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { IPersonaNatural } from 'app/Models/IPersonaNatural';
import { IResponse } from 'app/Models/IResponse';
import { IRoles } from 'app/Models/IRoles';
import { Menu } from 'app/Models/IMenu';
import { IEstadoSolicitud } from 'app/Models/IEstadoSolicitud';
import { IinformatioUser } from 'app/Models/IInformatioUser';
import { Iformato } from 'app/Models/IFormato';

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

  getDepartament = () => get<[]>({ endpoint: environments.shared, url: 'v1/Departamento/GetDepartamento' });

  getMunicipio = (id: string) =>
    get<[]>({ endpoint: environments.shared, url: `v1/Municipio/GetMunicipioByIdDepartamento/${id}` });

  GetNivelEducativo = () => get<[]>({ endpoint: environments.shared, url: 'v1/NivelEducativo/GetNivelEducativo' });

  getCertificado = (solicitud: string) =>
    get<any>({
      endpoint: environments.endpointV1,
      url: `CertificadoDefuncion/ValidateCertificadoDefuncion/73051461`
    });

  getMedico = () =>
    get<any>({
      endpoint: environments.endpointV1,
      url: `ProfesionalesSalud/GetProfesionalSaludByNumeroIdentificacion/86073058564`
    });

  GetAllcementerios = () =>
    get<any>({
      endpoint: environments.endpointV1,
      url: 'Cementerio/GetAllCementerio'
    });

  GetFunerarias = () =>
    get<any>({
      endpoint: environments.endpointV1,
      url: 'Funeraria/GetAllFuneraria'
    });

  postLicencia = (payload: any) => post({ endpoint: environments.inhcremacion, url: 'Request/AddRquest', payload });

  postprueba = (payload: any) => post({ endpoint: environments.local, url: 'Request/AddRquest', payload });

  AddGestion = (payload: any) => post({ endpoint: environments.local, url: 'Request/AddGestion', payload });

  putLicencia = (payload: any) => put({ endpoint: environments.inhcremacion, url: 'Request/UpdateRequest', payload });

  uploadFiles = (payload: any) =>
    post({
      endpoint: environments.blob,
      url: `Storage/AddFile`,
      payload,
      options: {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      },
      confirmModal: false
    });

  GetEstadoSolicitud = () => get<[]>({ endpoint: environments.inhcremacion, url: `Request/GetRequestByIdUser/${this.oid}` });

  GetResumenSolicitud = (solicitud: string) =>
    get<any>({ endpoint: environments.local, url: `Request/GetResumenSolicitud/${solicitud}` });

  getallbyEstado = (solicitud: string) =>
    get<[]>({ endpoint: environments.local, url: `Request/GetRequestByIdEstado/${solicitud}` });

  AddSupportDocuments = (payload: any[]) =>
    post({
      endpoint: environments.inhcremacion,
      url: 'SupportDocuments/AddSupportDocuments',
      payload,
      confirmModal: false
    });
  UpdateSupportDocuments = (payload: any[]) =>
    put({
      endpoint: environments.inhcremacion,
      url: 'SupportDocuments/UpdateSuport',
      payload,
      confirmModal: false
    });

  getSupportDocuments = (solicitud: string) =>
    get<any>({ endpoint: environments.inhcremacion, url: `SupportDocuments/GetAllSuportByRequestId/${solicitud}` });

  GetInformationUser = (userId: string) =>
    get<IinformatioUser>({ endpoint: environments.shared, url: `v2/Persona/GetInfoUserById/${userId}` });

  GetAllLicencias = () =>
    get<any>({
      endpoint: environments.inhcremacion,
      url: 'Request/GetAllRequest'
    });

  getCodeUser = () => get<any>({ endpoint: environments.security, url: `Security/GetCodeVentanillaByIdUser/${this.oid}` });

  getLicencia = (solicitud: string) =>
    get<any>({
      endpoint: environments.inhcremacion,
      url: `Request/GetRequestById/${solicitud}`
    });

  //https://wa-aeu-sds-dev-tsecurity.azurewebsites.net/api/v2/Security/UpdateUser
  putUser = (payload: any) => put<any>({ endpoint: environments.security, url: 'Security/UpdateUser', payload });

  UpdataLicencia = () => {};
  GetAllTypeValidation = () =>
    get<[]>({
      endpoint: environments.endpointV1,
      url: `Dominio/GetAllDominio/C5D41A74-09B6-4A7C-A45D-42792FCB4AC2`
    });

  addSeguimiento = (payload: any) => {
    return post<any>({
      endpoint: environments.inhcremacion,
      url: 'Seguimiento/AddSeguimiento',
      payload
    });
  };

  getUserTramite = (idTramite: string) =>
    get<any>({
      endpoint: environments.inhcremacion,
      url: `Seguimiento/GetSeguimientoBySolicitud/${idTramite}`
    });

  GeneratePDF = (idTramite: string) =>
    window.open(`${environments.inhcremacion}GeneratePDF/GeneratePDF/${idTramite}`, 'descarga');

  GetSolicitud = (solicitud: string) =>
    get<any>({
      endpoint: environments.solicitud,
      url: `Request/GetRequestById/${solicitud}`
    });

  sendEmail = (payload: any) => {
    return post<any>({
      endpoint: environments.notificacion,
      url: 'Email/SendMail',
      payload
    });
  };

  getFormato = (idPlantilla: string) =>
    get<Iformato>({
      endpoint: environments.formatos,
      url: `GetFormatoByTipoPlantilla/${idPlantilla}`
    });
}
