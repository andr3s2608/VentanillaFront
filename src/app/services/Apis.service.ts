import { get, post, put } from './settings/http.service';
import { IPersonaNatural } from 'app/Models/IPersonaNatural';
import { IRoles } from 'app/Models/IRoles';
import { Menu } from 'app/Models/IMenu';
import { IinformatioUser } from 'app/Models/IInformatioUser';
import { Iformato } from 'app/Models/IFormato';

const {
  REACT_APP_SECURITY,
  REACT_APP_SHARED,
  REACT_APP_INHCREMACION,
  REACT_APP_ENDPOINTV1,
  REACT_APP_NOTIFICACION,
  REACT_APP_BLOB,
  REACT_APP_FORMATOS
} = process.env;

export class ApiService {
  endpoint = REACT_APP_SHARED as string;
  private oid = '';

  constructor(oid$: string) {
    this.oid = oid$;
  }
  getIdUsuario = () => {
    return this.oid;
  };

  ComprobarCertificado = (numero: string) =>
    get<[]>({ endpoint: REACT_APP_INHCREMACION as string, url: `Request/ConsultarCertificado/${numero}`, id: '0' });

  GetDocumentoFallecido = (numero: string, persona: string) =>
    get<[]>({ endpoint: REACT_APP_INHCREMACION as string, url: `Request/ConsultarFallecido/${numero}/${persona}`, id: '0' });

  agregarFirma = (payload: any) => {
    return post<any>({
      endpoint: REACT_APP_INHCREMACION as string,
      url: 'Request/AddFirma',
      payload,
      id: '1'
    });
  };

  getFuncionarios = () => get<any>({ endpoint: REACT_APP_SHARED as string, url: `v2/Persona/GetUsers`, id: '0' });

  personaNatural = (tipoDominio: IPersonaNatural) =>
    post<IPersonaNatural>({ endpoint: this.endpoint, url: `v2/Persona/AddPersonaNatural`, payload: tipoDominio, id: '0' });

  personaJuridica = (tipoDominio: IPersonaNatural) =>
    post<IPersonaNatural>({ endpoint: this.endpoint, url: `v2/Persona/AddPersonaJuridica`, payload: tipoDominio, id: '0' });

  GetMenuUser = () => get<Menu[]>({ endpoint: REACT_APP_SECURITY as string, url: `Security/GetMenuByUser/${this.oid}`, id: '0' });

  GetRoles = () =>
    get<IRoles[]>({ endpoint: REACT_APP_SECURITY as string, url: `Security/GetRoleByIdUser/${this.oid}`, id: '0' });

  AddUser = (payload: any) =>
    post<any>({ endpoint: REACT_APP_SECURITY as string, url: `Security/AddUser`, payload, confirmModal: false, id: '0' });

  PostRolesUser = (payload: any) =>
    post({ endpoint: REACT_APP_SECURITY as string, url: 'Security/AddUserRole', payload, confirmModal: false, id: '0' });

  GetSexo = () => get<[]>({ endpoint: this.endpoint, url: 'v1/Sexo/GetSexo', id: '0' });
  GetSexoazure = () => get<[]>({ endpoint: this.endpoint, url: 'v1/Sexo/GetSexoSQL', id: '0' });
  GetOrientacionazure = () => get<[]>({ endpoint: this.endpoint, url: 'v1/Sexo/GetOrientacion', id: '0' });
  GetGeneroonazure = () => get<[]>({ endpoint: this.endpoint, url: 'v1/Sexo/GetGenero', id: '0' });

  GetEtnia = () => get<[]>({ endpoint: this.endpoint, url: 'v1/Etnia/GetEtnia', id: '0' });

  getTipoDocumeto = () => get<[]>({ endpoint: this.endpoint, url: 'v1/TipoIdentificacion/GetTipoIdentificacion', id: '0' });

  getPaises = () => get<[]>({ endpoint: this.endpoint, url: 'v1/Pais/GetPais', id: '0' });

  getDepartament = () => get<[]>({ endpoint: this.endpoint, url: 'v1/Departamento/GetDepartamento', id: '0' });

  getMunicipio = (id: string) =>
    get<[]>({ endpoint: this.endpoint, url: `v1/Municipio/GetMunicipioByIdDepartamento/${id}`, id: '0' });

  GetNivelEducativo = () => get<[]>({ endpoint: this.endpoint, url: 'v1/NivelEducativo/GetNivelEducativo', id: '0' });

  getCertificado = (id: string) =>
    get<any>({
      endpoint: REACT_APP_ENDPOINTV1 as string,
      url: `CertificadoDefuncion/ValidateCertificadoDefuncion/${id}`,
      id: '0'
    });

  getMedico = (id: string) =>
    get<any>({
      endpoint: REACT_APP_ENDPOINTV1 as string,
      //86073058564 quemado -> ${id} dinamico
      url: `ProfesionalesSalud/GetProfesionalSaludByNumeroIdentificacion/${id}`,
      id: '0'
    });

  GetAllcementerios = () =>
    get<any>({
      endpoint: REACT_APP_ENDPOINTV1 as string,
      url: 'Cementerio/GetAllCementerio',
      id: '0'
    });

  GetFunerarias = () =>
    get<any>({
      endpoint: REACT_APP_ENDPOINTV1 as string,
      url: 'Funeraria/GetAllFuneraria',
      id: '0'
    });

  postLicencia = (payload: any) =>
    post({ endpoint: REACT_APP_INHCREMACION as string, url: 'Request/AddRquest', payload, id: '0' });

  postprueba = (payload: any) => post({ endpoint: 'https://localhost:5001/api/', url: 'Request/AddRquest', payload, id: '0' });

  AddGestion = (payload: any, id: string) =>
    post({ endpoint: REACT_APP_INHCREMACION as string, url: 'Request/AddGestion', payload, id });

  putLicencia = (payload: any) =>
    put({ endpoint: REACT_APP_INHCREMACION as string, url: 'Request/UpdateRequest', payload, id: '0' });

  uploadFiles = (payload: any) =>
    post({
      endpoint: REACT_APP_BLOB as string,
      url: `Storage/AddFile`,
      payload,
      id: '0',
      options: {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      },
      confirmModal: false
    });

  GetEstadoSolicitud = () =>
    get<[]>({ endpoint: REACT_APP_INHCREMACION as string, url: `Request/GetRequestByIdUser/${this.oid}`, id: '0' });

  GetEstadoSolicitudNuevo = () =>
    get<[]>({ endpoint: REACT_APP_INHCREMACION as string, url: `Request/GetByIdUser/${this.oid}`, id: '0' });

  updatelicencia = (solicitud: string) =>
    post<any>({ endpoint: this.endpoint, url: `v2/Persona/SetApprovalInhumacionQuery/${solicitud}`, id: '1' });

  GetResumenSolicitud = (solicitud: string) =>
    get<any>({ endpoint: REACT_APP_INHCREMACION as string, url: `Request/GetResumenSolicitud/${solicitud}`, id: '0' });
  GetFunerariasAzure = (solicitud: string) =>
    get<any>({ endpoint: REACT_APP_INHCREMACION as string, url: `Request/GetFunerariabyidSolicitud/${solicitud}`, id: '0' });

  getallbyEstado = (solicitud: string) =>
    get<[]>({ endpoint: REACT_APP_INHCREMACION as string, url: `Request/GetRequestByIdEstado/${solicitud}`, id: '0' });

  AddSupportDocuments = (payload: any[]) =>
    post({
      endpoint: REACT_APP_INHCREMACION as string,
      url: 'SupportDocuments/AddSupportDocuments',
      payload,
      confirmModal: false,
      id: '0'
    });
  UpdateSupportDocuments = (payload: any[]) =>
    put({
      endpoint: REACT_APP_INHCREMACION as string,
      url: 'SupportDocuments/UpdateSuport',
      payload,
      confirmModal: false,
      id: '0'
    });

  getSupportDocuments = (solicitud: string) =>
    get<any>({
      endpoint: REACT_APP_INHCREMACION as string,
      url: `SupportDocuments/GetAllSuportByRequestId/${solicitud}`,
      id: '0'
    });

  GetInformationUser = (userId: string) =>
    get<IinformatioUser>({ endpoint: this.endpoint, url: `v2/Persona/GetInfoUserById/${userId}`, id: '0' });

  GetAllLicencias = () =>
    get<any>({
      endpoint: REACT_APP_INHCREMACION as string,
      url: 'Request/GetAllRequest',
      id: '0'
    });

  getCodeUser = () =>
    get<any>({ endpoint: REACT_APP_SECURITY as string, url: `Security/GetCodeVentanillaByIdUser/${this.oid}`, id: '0' });

  getLicencia = (solicitud: string) =>
    get<any>({
      endpoint: REACT_APP_INHCREMACION as string,
      url: `Request/GetRequestById/${solicitud}`,
      id: '0'
    });

  //https://wa-aeu-sds-dev-tsecurity.azurewebsites.net/api/v2/Security/UpdateUser
  putUser = (payload: any) => put<any>({ endpoint: REACT_APP_SECURITY as string, url: 'Security/UpdateUser', payload, id: '1' });

  UpdataLicencia = () => {};
  GetAllTypeValidation = () =>
    get<[]>({
      endpoint: REACT_APP_ENDPOINTV1 as string,
      url: `Dominio/GetAllDominio/C5D41A74-09B6-4A7C-A45D-42792FCB4AC2`,
      id: '0'
    });

  addSeguimiento = (payload: any) => {
    return post<any>({
      endpoint: REACT_APP_INHCREMACION as string,
      url: 'Seguimiento/AddSeguimiento',
      payload,
      id: '0'
    });
  };

  getUserTramite = (idTramite: string) =>
    get<any>({
      endpoint: REACT_APP_INHCREMACION as string,
      url: `Seguimiento/GetSeguimientoBySolicitud/${idTramite}`,
      id: '0'
    });

  getCostante = (idConstante: string) =>
    get<any>({
      endpoint: REACT_APP_INHCREMACION as string,
      url: `Seguimiento/GetCosntante/${idConstante}`,
      id: '0'
    });

  //consulta informacion adicional del fallecido
  GetInformacionFallecido = (solicitud: string) =>
    get<any>({ endpoint: REACT_APP_INHCREMACION as string, url: `Request/GetInfoFallecido/${solicitud}`, id: '0' });

  GetSolicitud = (solicitud: string) =>
    get<any>({
      endpoint: REACT_APP_INHCREMACION as string,
      url: `Request/GetAllRequestByIdSolicitud/${solicitud}`,
      id: '0'
    });

  sendEmail = (payload: any) => {
    return post<any>({
      endpoint: REACT_APP_NOTIFICACION as string,
      url: 'Email/SendMail',
      payload,
      id: '1'
    });
  };

  actualizarMedico = (idMedico: string, campo: string, cambio: string) => {
    return put<any>({
      endpoint: REACT_APP_INHCREMACION as string,
      url: `Request/UpdateMedico/${idMedico}/${campo}/${cambio}`,
      id: '1'
    });
  };

  getFormato = (idPlantilla: string) =>
    get<Iformato>({
      endpoint: REACT_APP_FORMATOS as string,
      url: `GetFormatoByTipoPlantilla/${idPlantilla}`,
      id: '0'
    });

  /** Lista de metodos que permiten consumir los end-point que retornar los Blob
   *  de los pdf que se agregar al crear las solicitudes.
   * */
  GetUrlPdf = (pathfull: string) => (REACT_APP_BLOB as string) + `Storage/GetBlob/${pathfull}`;

  GeneratePDF = (idTramite: string) => `${REACT_APP_INHCREMACION as string}GeneratePDF/GeneratePDF/${idTramite}`;

  getLinkPDF = (idTramite: string, idTramitador: string, nombreTramitador: string): string => {
    return (
      (REACT_APP_INHCREMACION as string) +
      'GeneratePDF/GeneratePDFPrev/' +
      idTramite +
      '/' +
      idTramitador +
      '/' +
      nombreTramitador
    );
  };

  getLinkPDFNotificacion = (idTramite: string, tramitador: string, nombreTramitador: string): string => {
    return (
      (REACT_APP_INHCREMACION as string) + 'GeneratePDF/GeneratePDF/' + idTramite + '/' + tramitador + '/' + nombreTramitador
    );
  };
  validarFirmaFuncionario = (idTramitador: string) =>
    get<any>({
      endpoint: REACT_APP_INHCREMACION as string,
      url: `Seguimiento/ValidarFirmaFuncionarioByIdUsuario/${idTramitador}`,
      id: '0'
    });
}
