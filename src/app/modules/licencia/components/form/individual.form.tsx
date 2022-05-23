import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Alert from 'antd/es/alert';
import Steps from 'antd/es/steps';
import Radio, { RadioChangeEvent } from 'antd/es/radio';
import Button from 'antd/es/button';
import Divider from 'antd/es/divider';
import moment from 'moment';
import Swal from 'sweetalert2';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';

// Hooks
import { useStepperForm } from 'app/shared/hooks/stepper.hook';

// Utilidades
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { ITipoLicencia } from 'app/shared/utils/types.util';

// Secciones del formulario
import { GeneralInfoFormSeccion, KeysForm as KeyFormGeneralInfo } from './seccions/general-info.form-seccion';
import { LugarDefuncionFormSeccion, KeysForm as KeyFormLugarDefuncion } from './seccions/lugar-defuncion.form-seccion';
import { DeathInstituteFormSeccion, KeysForm as KeyFormDeathInstitute } from './seccions/death-institute.form-seccion';
import { MedicalSignatureFormSeccion, KeysForm as KeyFormMedicalSignature } from './seccions/medical-signature.form-seccion';
import { CementerioInfoFormSeccion, KeysForm as KeyFormCementerio } from './seccions/cementerio-info.form-seccion';
import { SolicitudInfoFormSeccion, KeysForm as KeyFormSolicitudInfo } from './seccions/solicitud-info.form-seccion';
import { DatoSolicitanteAdd, KeysForm as KeyFormSolicitante } from './seccions/datoSolicitanteAdd';
import { DocumentosFormSeccion } from './seccions/documentos.form-seccion';

// Servicios
import { dominioService, ETipoDominio, IDominio } from 'app/services/dominio.service';
import { AutorizacionCremacion } from './seccions/autorizacionCremacion';

//redux

import { IRegistroLicencia } from 'app/Models/IRegistroLicencia';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { ApiService } from 'app/services/Apis.service';
import { TypeDocument } from './seccions/TypeDocument';
import { useHistory } from 'react-router';
import { EditInhumacion } from './edit/Inhumacion';
import { ValidationFuntional } from './seccions/validationfuntional';

const { Step } = Steps;

export const IndividualForm: React.FC<ITipoLicencia> = (props) => {
  const history = useHistory();
  const { tipoLicencia, tramite } = props;
  const [inputVal, setInputVal] = useState('');
  const pruebatipo = /[0-9]/;
  const [form] = Form.useForm<any>();
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);
  const { accountIdentifier } = authProvider.getAccount();
  const [sex, setSex] = useState<[]>([]);
  const api = new ApiService(accountIdentifier);
  const [user, setUser] = useState<any>();
  const [isPersonNatural, setIsPersonNatural] = useState<boolean>(false);

  const [longitudsolicitante, setlongitudsolicitante] = useState<number>(6);
  const [longituddeathinst, setlongituddeathinst] = useState<number>(6);
  const [longitudmedico, setlongitudmedico] = useState<number>(6);
  const [supports, setSupports] = useState<any[]>([]);
  const [type, setType] = useState<[]>([]);

  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(6);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{6,10}');
  const [tipocampovalidacion, setTipocampovalidacion] = useState<any>(/[0-9]/);
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [campo, setCampo] = useState<string>('Numéricos');
  //---
  const [longitudmaximaautoriza, setLongitudmaximaautoriza] = useState<number>(10);
  const [longitudminimaautoriza, setLongitudminimaautoriza] = useState<number>(6);
  const [tipocampoautoriza, setTipocampoautoriza] = useState<string>('[0-9]{6,10}');
  const [sininformacion, setsininformacion] = useState<boolean>(false);
  const [sininformacionaut, setsininformacionaut] = useState<boolean>(false);
  const [tipocampovalidacionautoriza, setTipocampovalidacionautoriza] = useState<any>(/[0-9]/);
  const [tipodocumentoautoriza, setTipodocumentoautoriza] = useState<string>('Cédula de Ciudadanía');
  const [campoautoriza, setCampoautoriza] = useState<string>('Numéricos');
  const [l_tipos_documento_autoriza, settiposautoriza] = useState<any>();
  //create o edit
  //const objJosn: any = EditInhumacion('0');
  const objJosn: any = undefined;
  const edit = objJosn?.idTramite ? true : false;
  //form.setFieldsValue(objJosn?);
  //#region Listados

  const [[l_paises, l_tipos_documento, l_estado_civil, l_nivel_educativo, l_etnia, l_regimen, l_tipo_muerte], setListas] =
    useState<IDominio[][]>([]);

  const getListas = useCallback(
    async () => {
      const resp = await Promise.all([
        dominioService.get_type(ETipoDominio.Pais),
        dominioService.get_type(ETipoDominio['Tipo Documento']),
        dominioService.get_type(ETipoDominio['Estado Civil']),
        dominioService.get_type(ETipoDominio['Nivel Educativo']),
        dominioService.get_type(ETipoDominio.Etnia),
        dominioService.get_type(ETipoDominio.Regimen),
        dominioService.get_type(ETipoDominio['Tipo de Muerte'])
      ]);

      const nuevodoc = await dominioService.get_type(ETipoDominio['Tipo Documento']);
      const nuevalista = nuevodoc.filter((i) => i.id != '7c96a4d3-a0cb-484e-a01b-93bc39c7902e');

      settiposautoriza(nuevalista);

      const sexo = await api.GetSexo();
      const userres = await api.getCodeUser();
      const informationUser = await api.GetInformationUser(userres);

      setSex(sexo);
      setUser(userres);
      setListas(resp);

      if (edit) {
        const support = await api.getSupportDocuments(objJosn?.idSolicitud);
        const typeList = await api.GetAllTypeValidation();
        setSupports(support);
        setType(typeList);
      }

      if (informationUser.tipoIdentificacion == 5) {
        setIsPersonNatural(false);
      } else {
        setIsPersonNatural(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      localStorage.removeItem('register');
    };
  }, []);

  //#endregion

  const getData = (longitud: number, procedencia: any) => {
    if (procedencia === 'solicitante') {
      setlongitudsolicitante(longitud);
    }
    if (procedencia === 'deathinst') {
      setlongituddeathinst(longitud);
    }
    if (procedencia === 'medico') {
      setlongitudmedico(longitud);
    }
  };
  const getDataSolicitante = (solicitante: any) => {};

  const onSubmit = async (values: any) => {
    setStatus(undefined);
    const idPersonaVentanilla = localStorage.getItem(accountIdentifier);
    const formatDate = 'MM-DD-YYYY';
    const estadoSolicitud = 'fdcea488-2ea7-4485-b706-a2b96a86ffdf'; //estado?.estadoSolicitud;
    const idUser = await api.getCodeUser();
    const resp = await api.GetInformationUser(idUser);
    let idnum = values.IDNumber;
    let idnumaut = values.mauthIDNumber;

    if (sininformacion) {
      idnum = 'Sin Información';
    }
    if (sininformacionaut) {
      idnumaut = 'Sin Información';
    }

    const tipoinst = values.instTipoIdent;
    var tipoidinst = values.instTipoIdent;
    var numeroins = values.instNumIdent;
    var razonSocialins = values.instRazonSocial;
    var numeroProtocoloins = values.instNumProtocolo;
    if (tipoinst == undefined) {
      tipoidinst = 'A7A1B90B-8F29-4509-8220-A95F567E6FCB';
      numeroins = '0';
      razonSocialins = 'Otros';
      numeroProtocoloins = '452022';
    }
    const par = values.authParentesco;
    var parentesco = '';
    switch (par) {
      case 'Padre / Madre':
        parentesco = 'ed389a26-68cb-4b43-acc7-3eb23e997bf9';
        break;
      case 'Hermano/a':
        parentesco = '313e2b1d-33f0-455b-9178-f23579f01414';
        break;
      case 'Hijo/a':
        parentesco = 'f8841271-f6b7-4d11-b55f-41da3faccdfe';
        break;
      case 'Cónyuge (Compañero/a Permanente)':
        parentesco = '4c00cd98-9a25-400a-9c31-1f6fca7de562';
        break;
      case 'Tío/a':
        parentesco = '6880824b-39c2-4105-8195-c190885796d8';
        break;
      case 'Sobrino/a':
        parentesco = '5fa418af-62d9-498f-94e4-370c195e8fc8';
        break;
      case 'Abuelo/a':
        parentesco = 'ad65eb1c-10bd-4882-8645-d12001cd57b2';
        break;
      case 'Nieto/a':
        parentesco = '84286cb9-2499-4348-aeb8-285fc9dcf60f';
        break;
      case 'Otro':
        parentesco = 'e819b729-799c-4644-b62c-74bff07bf622';
        break;
    }

    var tipo = '';
    var razon = '';
    var tipoid = resp.tipoIdentificacion + '';
    var nroid = resp.numeroIdentificacion + '';
    if (resp.tipoIdentificacion == 5) {
      tipo = 'Juridica';
      razon = resp.razonSocial;
    } else {
      tipo = 'Natural';
      razon = values.namesolicitudadd + ' ' + values.lastnamesolicitudadd;
      tipoid = values.fiscalia;
      nroid = values.ndoc;
    }

    const dep = values.state;
    var mun = values.city;
    switch (dep) {
      case '31b870aa-6cd0-4128-96db-1f08afad7cdd':
        mun = '31211657-3386-420a-8620-f9C07a8ca491';
        break;
    }
    var segunda = values.nationalidad2;

    if (segunda == undefined) {
      segunda = '00000000-0000-0000-0000-000000000000';
    }
    let persona: any[] = [];

    if (tipoLicencia === 'Inhumación') {
      persona = [
        //fallecido
        {
          tipoIdentificacion: values.IDType,
          numeroIdentificacion: idnum,
          primerNombre: values.name,
          segundoNombre: values.secondName,
          primerApellido: values.surname,
          segundoApellido: values.secondSurname,
          fechaNacimiento: values.dateOfBirth,
          nacionalidad: values.nationalidad[0],
          segundanacionalidad: segunda,
          otroParentesco: null,
          idEstadoCivil: values.civilStatus,
          idNivelEducativo: values.educationLevel,
          idEtnia: values.etnia,
          idRegimen: values.regimen,
          idTipoPersona: '01f64f02-373b-49d4-8cb1-cb677f74292c',
          idParentesco: parentesco,
          idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
        },

        //certifica la defuncion
        {
          tipoIdentificacion: values.medicalSignatureIDType,
          numeroIdentificacion: values.medicalSignatureIDNumber,
          primerNombre: values.medicalSignatureName,
          segundoNombre: values.medicalSignatureSecondName,
          primerApellido: values.medicalSignatureSurname,
          segundoApellido: values.medicalSignatureSecondSurname,
          fechaNacimiento: null,
          nacionalidad: '00000000-0000-0000-0000-000000000000',
          segundanacionalidad: '00000000-0000-0000-0000-000000000000',
          otroParentesco: null,
          idEstadoCivil: '00000000-0000-0000-0000-000000000000',
          idNivelEducativo: '00000000-0000-0000-0000-000000000000',
          idEtnia: '00000000-0000-0000-0000-000000000000',
          idRegimen: values.regimen,
          idTipoPersona: 'D8B0250B-2991-42A0-A672-8E3E45985500',
          idParentesco: '00000000-0000-0000-0000-000000000000',
          idLugarExpedicion: '1e05f64f-5e41-4252-862c-5505dbc3931c', //values.medicalSignatureIDExpedition,
          idTipoProfesional: values.medicalSignatureProfesionalType
        }
      ];
    }
    if (tipoLicencia === 'Cremación') {
      persona = [
        //madre
        {
          tipoIdentificacion: values.IDType,
          numeroIdentificacion: idnum,
          primerNombre: values.name,
          segundoNombre: values.secondName,
          primerApellido: values.surname,
          segundoApellido: values.secondSurname,
          fechaNacimiento: values.dateOfBirth,
          nacionalidad: values.nationalidad[0],
          segundanacionalidad: segunda,
          otroParentesco: null,
          idEstadoCivil: values.civilStatus,
          idNivelEducativo: values.educationLevel,
          idEtnia: values.etnia,
          idRegimen: values.regimen,
          idTipoPersona: '01f64f02-373b-49d4-8cb1-cb677f74292c',
          idParentesco: parentesco,
          idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
        },
        //authorizador cremacion
        {
          //idPersona: '',
          tipoIdentificacion: values.authIDType,
          numeroIdentificacion: idnumaut,
          primerNombre: values.authName,
          segundoNombre: values.authSecondName,
          primerApellido: values.authSurname,
          segundoApellido: values.authSecondSurname,
          fechaNacimiento: null,
          nacionalidad: '00000000-0000-0000-0000-000000000000',
          segundanacionalidad: '00000000-0000-0000-0000-000000000000',
          otroParentesco: parentesco, //lista parentesco
          idEstadoCivil: '00000000-0000-0000-0000-000000000000',
          idNivelEducativo: '00000000-0000-0000-0000-000000000000',
          idEtnia: '00000000-0000-0000-0000-000000000000',
          idRegimen: '00000000-0000-0000-0000-000000000000',
          idTipoPersona: 'cc4c8c4d-b557-4a5a-a2b3-520d757c5d06',
          idParentesco: '00000000-0000-0000-0000-000000000000',
          idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
        },
        //certifica la defuncion
        {
          tipoIdentificacion: values.medicalSignatureIDType,
          numeroIdentificacion: values.medicalSignatureIDNumber,
          primerNombre: values.medicalSignatureName,
          segundoNombre: values.medicalSignatureSecondName,
          primerApellido: values.medicalSignatureSurname,
          segundoApellido: values.medicalSignatureSecondSurname,
          fechaNacimiento: null,
          nacionalidad: '00000000-0000-0000-0000-000000000000',
          segundanacionalidad: '00000000-0000-0000-0000-000000000000',
          otroParentesco: null,
          idEstadoCivil: '00000000-0000-0000-0000-000000000000',
          idNivelEducativo: '00000000-0000-0000-0000-000000000000',
          idEtnia: '00000000-0000-0000-0000-000000000000',
          idRegimen: values.regimen,
          idTipoPersona: 'D8B0250B-2991-42A0-A672-8E3E45985500',
          idParentesco: '00000000-0000-0000-0000-000000000000',
          idLugarExpedicion: '1e05f64f-5e41-4252-862c-5505dbc3931c', //values.medicalSignatureIDExpedition,
          idTipoProfesional: values.medicalSignatureProfesionalType
        }
      ];
    }

    const json: IRegistroLicencia<any> = {
      solicitud: {
        numeroCertificado: values.certificado,
        fechaDefuncion: moment(values.date).format(formatDate),
        sinEstablecer: values.check,
        hora: values.check === true ? 'Sin información' : moment(values.time).format('LT'),
        idSexo: values.sex,
        estadoSolicitud: estadoSolicitud,
        idPersonaVentanilla: Number(user), //numero de usuario registrado
        idUsuarioSeguridad: accountIdentifier,
        idTramite: tramite,
        idTipoMuerte: values.deathType,
        tipoPersona: tipo,
        tipoIdentificacionSolicitante: tipoid,
        noIdentificacionSolicitante: nroid,
        razonSocialSolicitante: razon,
        persona,
        lugarDefuncion: {
          idPais: values.country,
          idDepartamento: values.state,
          idMunicipio: mun,
          idAreaDefuncion: values.areaDef,
          idSitioDefuncion: values.sitDef
        },
        ubicacionPersona: {
          idPaisResidencia: values.pais,
          idDepartamentoResidencia: values.departamento,
          idCiudadResidencia: values.ciudad,
          idLocalidadResidencia: values.localidad,
          idAreaResidencia: values.area,
          idBarrioResidencia: values.barrio
        },
        datosCementerio: {
          enBogota: values.cementerioLugar === 'Dentro de Bogotá',
          fueraBogota: values.cementerioLugar === 'Fuera de Bogotá',
          fueraPais: values.cementerioLugar === 'Fuera del País',
          cementerio: values.cementerioBogota,
          otroSitio: values.otro,
          ciudad: values.cementerioCiudad,
          idPais: values.cementerioPais,
          idDepartamento: values.cementerioDepartamento,
          idMunicipio: values.cementerioMunicipio
        },

        datosFuneraria: {
          enBogota: true,
          fueraBogota: false,
          fueraPais: false,
          funeraria: values.funerariaBogota,
          otroSitio: values.otrofuneraria,
          ciudad: values.funerariaCiudad,
          idPais: values.funerariaPais,
          idDepartamento: values.funerariaDepartamento,
          idMunicipio: values.funerariaMunicipio
        },

        resumenSolicitud: {
          correoCementerio: values.emailcementerio,
          correoFuneraria: values.emailfuneraria,
          tipoDocumentoSolicitante: values.fiscalia,
          numeroDocumentoSolicitante: values.ndoc,
          nombreSolicitante: values.namesolicitudadd,
          apellidoSolicitante: values.lastnamesolicitudadd,
          correoSolicitante: values.emailsolicitudadd,
          correoMedico: '',
          cumpleCausa: true,
          observacionCausa: ''
        },

        institucionCertificaFallecimiento: {
          tipoIdentificacion: tipoidinst,
          numeroIdentificacion: numeroins,
          razonSocial: razonSocialins,
          numeroProtocolo: numeroProtocoloins,
          numeroActaLevantamiento: values.instNumActaLevantamiento,
          fechaActa: moment(values.instFechaActa).format(formatDate),
          seccionalFiscalia: values.instSeccionalFiscalia,
          noFiscal: values.instNoFiscal,
          idTipoInstitucion: values.instType
        }
        // documentosSoporte: generateFormFiel(values.instType)
      }
    };

    console.log(json);
    //Guarde de documentos
    const container = tipoLicencia === 'Inhumación' ? 'inhumacionindividual' : 'cremacionindividual';
    const formData = new FormData();
    const supportDocuments: any[] = [];

    if (edit) {
      localStorage.removeItem('');

      const container = tipoLicencia === 'Inhumación' ? 'inhumacionindividual' : 'cremacionindividual';
      const formData = new FormData();

      const resp = await api.putLicencia(json.solicitud);
      localStorage.removeItem('register');

      const [files, names] = generateListFiles(values);
      const supportDocumentsEdit: any[] = [];

      files.forEach((item: any, i: number) => {
        const name = names[i];

        formData.append('file', item);
        formData.append('nameFile', name + '_' + resp);

        TypeDocument.forEach((item: any) => {
          if (item.key === name.toString()) {
            const [support] = supports.filter((p) => p.path.includes(item.name));
            supportDocumentsEdit.push({
              idDocumentoSoporte: support.idDocumentoSoporte,
              idSolicitud: resp,
              idTipoDocumentoSoporte: item.value,
              path: `${accountIdentifier}/${name}_${resp}`,
              idUsuario: accountIdentifier,
              fechaModificacion: new Date()
            });
          }
        });
      });

      formData.append('containerName', container);
      formData.append('oid', accountIdentifier);

      if (supportDocumentsEdit.length) {
        await api.uploadFiles(formData);
        await api.UpdateSupportDocuments(supportDocumentsEdit);
      }
    }

    if (!edit) {
      const resp = await api.postprueba(json);

      if (resp) {
        const [files, names] = generateListFiles(values);

        files.forEach((file: any, i: number) => {
          const name = names[i];

          formData.append('file', file);
          formData.append('nameFile', name + '_' + resp);

          TypeDocument.forEach((item: any) => {
            if (item.key === name.toString()) {
              supportDocuments.push({
                idSolicitud: resp,
                idTipoDocumentoSoporte: item.value,
                path: `${accountIdentifier}/${name}_${resp}`,
                idUsuario: accountIdentifier
              });
            }
          });
        });

        formData.append('containerName', container);
        formData.append('oid', accountIdentifier);
        await api.uploadFiles(formData);
        await api.AddSupportDocuments(supportDocuments);

        form.resetFields();
      }
    }
    history.push('/tramites-servicios');
  };
  const generateListFiles = (values: any) => {
    const Objs = [];

    const {
      fileCertificadoDefuncion,
      fileCCFallecido,
      fileOtrosDocumentos,
      fileAuthCCFamiliar,
      fileAuthCremacion,
      fileOficioIdentificacion,
      fileOrdenAuthFiscal,
      fileActaNotarialFiscal
    } = values;

    Objs.push({ file: fileCertificadoDefuncion, name: 'Certificado_Defuncion' });
    Objs.push({ file: fileCCFallecido, name: 'Documento_del_fallecido' });
    Objs.push({ file: fileOtrosDocumentos, name: 'Otros_Documentos' });
    Objs.push({ file: fileAuthCCFamiliar, name: 'Autorizacion_de_cremacion_del_familiar' });
    Objs.push({ file: fileAuthCremacion, name: 'Documento_del_familiar' });
    Objs.push({ file: fileOficioIdentificacion, name: 'Autorizacion_del_fiscal_para_cremar' });
    Objs.push({ file: fileOrdenAuthFiscal, name: 'Oficio_de_medicina_legal_al_fiscal_para_cremar' });
    Objs.push({ file: fileActaNotarialFiscal, name: 'Acta_Notarial_del_Fiscal' });

    const filesName = Objs.filter((item: { file: any; name: string }) => item.file !== undefined);
    const files: Blob[] = filesName.map((item) => {
      const [file] = item.file;
      return file.originFileObj;
    });
    const names: string[] = filesName.map((item) => item.name);
    return [files, names];
  };
  const onSubmitFailed = () => setStatus('error');

  const PruebaCertificado = async () => {
    let numero: string = form.getFieldValue('certificado');
    const busquedacertificado = await api.ComprobarCertificado(numero);
    let numerodeath: string = form.getFieldValue('instNumIdent');
    if (numero == undefined) {
      numero = '0';
    }
    if (numerodeath == undefined) {
      numerodeath = '00000000000000000';
    }
    if (busquedacertificado == null) {
      if (numero.length >= 6) {
        if (numerodeath.length >= longituddeathinst) {
          onNextStep([...KeyFormGeneralInfo, ...KeyFormDeathInstitute, ...KeyFormLugarDefuncion]);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Datos invalidos',
            text: `El Número de Documento de Institución que Certifica el Fallecimiento debe tener mínimo ${longituddeathinst} Dígitos`
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Datos invalidos',
          text: 'El Número de Certificado debe tener mínimo 6 Dígitos'
        });
      }
    } else {
      Swal.fire({
        title: 'Usuario Registrado',
        text: 'El Número de Certificado ya se Encuentra Registrado',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        icon: 'info'
      });
    }
  };

  const ValidacionMedico = () => {
    let numero: string = form.getFieldValue('medicalSignatureIDNumber');
    if (numero == undefined) {
      numero = '0';
    }
    if (numero.length >= longitudmedico) {
      onNextStep([...KeyFormMedicalSignature]);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Datos invalidos',
        text: `El Número de Identificación del Medico debe tener mínimo ${longitudmedico} Dígitos o Caracteres`
      });
    }
  };

  const ValidacionAutorizador = () => {
    let numero: string = form.getFieldValue('mauthIDNumber');
    let numerosolicitante: string = form.getFieldValue('ndoc');
    if (numerosolicitante == undefined) {
      numerosolicitante = '0';
    }

    if (numero == undefined) {
      numero = '00000000000000000000';
    }

    if (numero.length >= longitudminimaautoriza) {
      if (numerosolicitante.length >= longitudsolicitante) {
        onNextStep([
          ...KeyFormSolicitudInfo,
          ...KeyFormCementerio,
          ...KeyFormSolicitante,
          'authIDType',
          'mauthIDNumber',
          'authName',
          'authSecondName',
          'authSurname',
          'authSecondSurname',
          'authParentesco',
          'authOtherParentesco'
        ]);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Datos invalidos',
          text: `El Número de Identificación del Solicitante debe tener mínimo ${longitudsolicitante} Dígitos o Caracteres`
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Datos invalidos',
        text: `El Número de Identificación del Autorizador debe tener mínimo ${longitudminimaautoriza} Dígitos o Caracteres`
      });
    }
  };

  const ValidacionFallecido = async () => {
    let numero: string = form.getFieldValue('IDNumber');
    let tipo: string = form.getFieldValue('IDType');

    if (numero == undefined || numero == '') {
      numero = '0';
    }
    let busqueda: any = '';

    if (tipo == '7c96a4d3-a0cb-484e-a01b-93bc39c7902e' || tipo == 'c087d833-3cfb-460f-aa78-e5cf2fe83f25') {
      busqueda = null;
    } else {
      busqueda = await api.GetDocumentoFallecido(numero, '01F64F02-373B-49D4-8CB1-CB677F74292C');
    }

    if (busqueda == null) {
      if (numero.length >= longitudminima) {
        onNextStep([
          'name',
          'secondName',
          'surname',
          'secondSurname',
          'nationalidad',
          'dateOfBirth',
          'IDType',
          'IDNumber',
          'civilStatus',
          'educationLevel',
          'etnia',
          'age',
          'unitAge',
          'regime',
          'knownIDType',
          'knownIDNumber',
          'knownName',
          'deathType'
        ]);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Datos invalidos',
          text: `El Número de Identificación debe tener mínimo ${longitudminima} Dígitos o Caracteres`
        });
      }
    } else {
      Swal.fire({
        title: 'Usuario Registrado',
        text: 'El Número de Identificación del Fallecido ya se Encuentra Registrado',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        icon: 'info'
      });
    }
  };

  //#region Eventos formulario

  const [isCremacion, setIsCremacion] = useState(false);
  useEffect(() => {
    setIsCremacion(tipoLicencia === 'Cremación');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoLicencia]);

  const [hasCremacionAuth, setHasCremacionAuth] = useState(true);
  const onChangeCremacionAuth = (value: boolean) => {
    form.resetFields([
      'authIDType',
      'authName',
      'authSecondName',
      'authSurname',
      'authSecondSurname',
      'authParentesco',
      'authOtherParentesco'
    ]);
    setHasCremacionAuth(value);
  };

  const [isOtherParentesco, setIsOtherParentesco] = useState(false);

  const onChangeParentesco = (e: RadioChangeEvent) => {
    form.resetFields(['authOtherParentesco']);
    setIsOtherParentesco(e.target.value === 'Otro');
  };

  //edit
  const Actions = () => (
    <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
      <div className='d-flex justify-content-between'>
        <Button type='dashed' htmlType='button' onClick={onPrevStep}>
          Volver atrás
        </Button>
        <Button type='primary' htmlType='submit'>
          Guardar
        </Button>
      </div>
    </Form.Item>
  );
  const date = objJosn?.dateOfBirth !== undefined ? moment(objJosn?.dateOfBirth) : null;
  //#endregion
  //validacion Tipo de documento//
  const cambiodocumento = (value: any) => {
    const valor: string = value;
    const valorupper = valor.toUpperCase();
    setsininformacion(false);

    if (valorupper == 'C087D833-3CFB-460F-AA78-E5CF2FE83F25') {
      setsininformacion(true);
    }

    if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C7902E') {
      setLongitudminima(2);
      setLongitudmaxima(10);
      setTipocampo('[0-9]{2,10}');
      setTipocampovalidacion(/[0-9]/);
      setCampo('Numéricos');
      setTipodocumento('Tipo de Protocolo');
      form.setFieldsValue({ IDNumber: '8001508610' });
    } else {
      form.setFieldsValue({ IDNumber: undefined });
      if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
        setLongitudminima(6);
        setLongitudmaxima(10);
        setTipocampo('[0-9]{6,10}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Cédula de Ciudadanía');
      } else {
        if (valorupper == 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
          setLongitudminima(10);
          setLongitudmaxima(11);
          setTipocampo('[0-9]{10,11}');
          setTipocampovalidacion(/[0-9]/);
          setCampo('Numéricos');
          setTipodocumento('Tarjeta de Identidad ');
        } else {
          if (valorupper == '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
            setLongitudminima(15);
            setLongitudmaxima(15);
            setTipocampo('[0-9]{15,15}');
            setTipocampovalidacion(/[0-9]/);
            setCampo('Numéricos');
            setTipodocumento('Permiso Especial de Permanencia');
          } else {
            if (valorupper == 'FFE88939-06D5-486C-887C-E52D50B7F35D' || valorupper == '71F659BE-9D6B-4169-9EE2-E70BF0D65F92') {
              setLongitudminima(10);
              setLongitudmaxima(11);
              setTipocampo('[a-zA-Z0-9]{10,11}');
              setTipocampovalidacion(/[a-zA-Z0-9]/);
              setCampo('AlfaNuméricos(Numéros y letras)');
              setTipodocumento('Registro Civil de Nacimiento y Numero único de identificacíon personal');
            } else {
              setLongitudminima(6);
              setLongitudmaxima(10);
              setTipocampo('[a-zA-Z0-9]{6,10}');
              setTipocampovalidacion(/[a-zA-Z0-9]/);
              setCampo('AlfaNuméricos(Numéros y letras)');
              setTipodocumento('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
            }
          }
        }
      }
    }
  };
  const cambiodocumentoautoriza = (value: any) => {
    form.setFieldsValue({ mauthIDNumber: undefined });
    const valor: string = value;
    const valorupper = valor.toUpperCase();
    setsininformacionaut(false);

    if (valorupper == 'C087D833-3CFB-460F-AA78-E5CF2FE83F25') {
      setsininformacionaut(true);
    }

    if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
      setLongitudminimaautoriza(6);
      setLongitudmaximaautoriza(10);
      setTipocampoautoriza('[0-9]{6,10}');
      setTipocampovalidacionautoriza(/[0-9]/);
      setCampoautoriza('Numéricos');
      setTipodocumentoautoriza('Cédula de Ciudadanía');
    } else {
      if (valorupper == 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
        setLongitudminimaautoriza(10);
        setLongitudmaximaautoriza(11);
        setTipocampoautoriza('[0-9]{10,11}');
        setTipocampovalidacionautoriza(/[0-9]/);
        setCampoautoriza('Numéricos');
        setTipodocumentoautoriza('Tarjeta de Identidad ');
      } else {
        if (valorupper == '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
          setLongitudminimaautoriza(15);
          setLongitudmaximaautoriza(15);
          setTipocampoautoriza('[0-9]{15,15}');
          setTipocampovalidacionautoriza(/[0-9]/);
          setCampoautoriza('Numéricos');
          setTipodocumentoautoriza('Permiso Especial de Permanencia');
        } else {
          if (valorupper == 'FFE88939-06D5-486C-887C-E52D50B7F35D' || valorupper == '71F659BE-9D6B-4169-9EE2-E70BF0D65F92') {
            setLongitudminimaautoriza(10);
            setLongitudmaximaautoriza(11);
            setTipocampoautoriza('[a-zA-Z0-9]{10,11}');
            setTipocampovalidacionautoriza(/[a-zA-Z0-9]/);
            setCampoautoriza('AlfaNuméricos(Numéros y letras)');
            setTipodocumentoautoriza('Registro Civil de Nacimiento y Numero único de identificacíon personal');
          } else {
            setLongitudminimaautoriza(6);
            setLongitudmaximaautoriza(10);
            setTipocampoautoriza('[a-zA-Z0-9]{6,10}');
            setTipocampovalidacionautoriza(/[a-zA-Z0-9]/);
            setCampoautoriza('AlfaNuméricos(Numéros y letras)');
            setTipodocumentoautoriza('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
          }
        }
      }
    }
  };
  return (
    <div className='card card-body py-5 mb-4 fadeInTop'>
      <div className='d-lg-flex align-items-start'>
        <Steps
          className='mb-5 mr-5'
          current={current}
          status={status}
          onChange={setCurrent}
          direction='vertical'
          style={{ maxWidth: 350 }}
        >
          <Step title='INFORMACIÓN GENERAL CERTIFICADO' description='Datos certificado de defunción.' />
          <Step title='INFORMACIÓN DEL FALLECIDO' description='Datos personales del fallecido.' disabled={!inputVal} />
          <Step title='INFORMACIÓN SOLICITANTE' description='Datos solicitante - cementerio.' disabled={!inputVal} />
          <Step title='INFORMACIÓN DEL MÉDICO' description='Datos del médico que certifica.' disabled={!inputVal} />
          <Step title='INFORMACIÓN SOPORTES' description='Datos documentos de soporte PDF.' disabled={!inputVal} />
        </Steps>

        <Form
          form={form}
          className='mb-4 w-100'
          {...layoutItems}
          style={{ maxWidth: 800 }}
          layout='horizontal'
          onFinish={onSubmit}
          onFinishFailed={onSubmitFailed}
        >
          <>
            <div className={`d-none fadeInRight ${current === 0 && 'd-block'}`}>
              <GeneralInfoFormSeccion obj={objJosn} tipoLicencia={'Cremación'} />
              <LugarDefuncionFormSeccion form={form} obj={objJosn} />
              <DeathInstituteFormSeccion
                prop={getData}
                obj={objJosn}
                form={form}
                datofiscal={true}
                required={true}
                tipoLicencia={tipoLicencia}
              />

              <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
                <div className='d-flex justify-content-end'>
                  <Button type='primary' htmlType='button' onClick={() => PruebaCertificado()}>
                    Siguiente
                  </Button>
                </div>
              </Form.Item>
            </div>
          </>

          <>
            <div className={`d-none fadeInRight ${current === 1 && 'd-block'}`}>
              <Divider orientation='right'>Datos del Fallecido</Divider>
              <Form.Item label='Primer Nombre' name='name' rules={[{ required: true, max: 50 }]} initialValue={objJosn?.name}>
                <Input
                  allowClear
                  placeholder='Primer Nombre'
                  autoComplete='off'
                  type='text'
                  onKeyPress={(event) => {
                    if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                />
              </Form.Item>
              <Form.Item
                label='Segundo Nombre'
                name='secondName'
                rules={[{ required: false, max: 50 }]}
                initialValue={objJosn?.secondName}
              >
                <Input
                  allowClear
                  placeholder='Segundo Nombre'
                  autoComplete='off'
                  type='text'
                  onKeyPress={(event) => {
                    if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                />
              </Form.Item>
              <Form.Item
                label='Primer Apellido'
                name='surname'
                rules={[{ required: true, max: 50 }]}
                initialValue={objJosn?.surname}
              >
                <Input
                  allowClear
                  placeholder='Primer Apellido'
                  autoComplete='off'
                  type='text'
                  onKeyPress={(event) => {
                    if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                />
              </Form.Item>
              <Form.Item
                label='Segundo Apellido'
                name='secondSurname'
                rules={[{ required: false, max: 50 }]}
                initialValue={objJosn?.secondSurname}
              >
                <Input
                  allowClear
                  placeholder='Segundo Apellido'
                  autoComplete='off'
                  type='text'
                  onKeyPress={(event) => {
                    if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                />
              </Form.Item>
              <Form.Item
                label='Nacionalidad'
                name='nationalidad'
                initialValue={[objJosn?.nacionalidad ? objJosn?.nacionalidad : '1e05f64f-5e41-4252-862c-5505dbc3931c']}
                rules={[{ required: true }]}
              >
                <SelectComponent
                  options={l_paises}
                  placeholder='-- Elija una nacionalidad --'
                  optionPropkey='id'
                  optionPropLabel='descripcion'
                />
              </Form.Item>
              <Form.Item label='Segunda Nacionalidad' name='nationalidad2' rules={[{ required: false }]}>
                <SelectComponent
                  options={l_paises}
                  placeholder='-- Elija una o varias --'
                  optionPropkey='id'
                  optionPropLabel='descripcion'
                />
              </Form.Item>
              <Form.Item label='Fecha de Nacimiento' name='dateOfBirth' rules={[{ required: true }]} initialValue={date}>
                <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' value={date} />
              </Form.Item>
              <Form.Item
                label='Tipo Identificación'
                name='IDType'
                initialValue={objJosn?.IDType ? objJosn?.IDType : '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
                rules={[{ required: true }]}
              >
                <SelectComponent
                  options={l_tipos_documento}
                  onChange={cambiodocumento}
                  optionPropkey='id'
                  optionPropLabel='descripcion'
                />
              </Form.Item>
              <Form.Item label='Número de Identificación' name='IDNumber' rules={[{ required: !sininformacion }]}>
                <Input
                  allowClear
                  type='text'
                  placeholder='Número Identificación'
                  autoComplete='off'
                  pattern={tipocampo}
                  disabled={sininformacion}
                  maxLength={longitudmaxima}
                  onKeyPress={(event) => {
                    if (!tipocampovalidacion.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                  onInvalid={() => {
                    Swal.fire({
                      icon: 'error',
                      title: 'Datos invalidos',
                      text:
                        'Sección:INFORMACIÓN DEL FALLECIDO \n recuerde que para el tipo de documento: ' +
                        tipodocumento +
                        ' solo se admiten valores ' +
                        campo +
                        ' de longitud entre ' +
                        longitudminima +
                        ' y ' +
                        longitudmaxima
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label='Estado Civil'
                name='civilStatus'
                initialValue={objJosn?.civilStatus ?? '4c17996a-7113-4e17-a0fe-6fd7cd9bbcd1'}
              >
                <SelectComponent options={l_estado_civil} optionPropkey='id' optionPropLabel='descripcion' />
              </Form.Item>
              <Form.Item
                label='Nivel Educativo'
                name='educationLevel'
                initialValue={objJosn?.educationLevel ?? '07ebd0bb-2b00-4a2b-8db5-4582eee1d285'}
              >
                <SelectComponent options={l_nivel_educativo} optionPropkey='id' optionPropLabel='descripcion' />
              </Form.Item>

              <Form.Item label='Etnia' name='etnia' initialValue={objJosn?.etnia ?? '60875c52-9b2a-4836-8bc7-2f3648f41f57'}>
                <SelectComponent options={l_etnia} optionPropkey='id' optionPropLabel='descripcion' />
              </Form.Item>

              <Form.Item label='Régimen' name='regimen' initialValue={objJosn?.regime ?? '848c6d53-6bda-4596-a889-8fdb0292f9e4'}>
                <SelectComponent options={l_regimen} optionPropkey='id' optionPropLabel='descripcion' />
              </Form.Item>

              <Form.Item
                label='Tipo de Muerte'
                name='deathType'
                initialValue={objJosn?.deathType ?? '475c280d-67af-47b0-a8bc-de420f6ac740'}
                rules={[{ required: true }]}
              >
                <SelectComponent options={l_tipo_muerte} optionPropkey='id' optionPropLabel='descripcion' />
              </Form.Item>

              {/* TODO: [2021-06-12] Definir los roles del usuario, es solo visible para funcionarios. */}
              {false && (
                <>
                  <Divider orientation='right'>Reconocido como...</Divider>

                  <Form.Item label='Tipo Identificación' name='knownIDType'>
                    <SelectComponent
                      options={l_tipos_documento}
                      onChange={cambiodocumento}
                      optionPropkey='id'
                      optionPropLabel='descripcion'
                    />
                  </Form.Item>

                  <Form.Item label='Número de Identificación' name='knownIDNumber'>
                    <Input
                      allowClear
                      type='text'
                      placeholder='Número Identificación'
                      autoComplete='off'
                      pattern={tipocampo}
                      maxLength={longitudmaxima}
                      onKeyPress={(event) => {
                        if (!tipocampovalidacion.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onPaste={(event) => {
                        event.preventDefault();
                      }}
                      onInvalid={() => {
                        Swal.fire({
                          icon: 'error',
                          title: 'Datos invalidos',
                          text:
                            'Sección:Reconocido como \n recuerde que para el tipo de documento:' +
                            tipodocumento +
                            ' solo se admiten valores ' +
                            campo +
                            ' de longitud entre ' +
                            longitudminima +
                            ' y ' +
                            longitudmaxima
                        });
                      }}
                    />
                  </Form.Item>

                  <Form.Item label='Nombre' name='knownName'>
                    <Input
                      allowClear
                      placeholder='Nombres y Apellidos completos'
                      autoComplete='off'
                      type='text'
                      onKeyPress={(event) => {
                        if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onPaste={(event) => {
                        event.preventDefault();
                      }}
                    />
                  </Form.Item>
                </>
              )}

              <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
                <div className='d-flex justify-content-between'>
                  <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                    Volver atrás
                  </Button>
                  <Button type='primary' htmlType='button' onClick={() => ValidacionFallecido()}>
                    Siguiente
                  </Button>
                </div>
              </Form.Item>
            </div>
          </>

          <>
            <div className={`d-none fadeInRight ${current === 2 && 'd-block'}`}>
              {isCremacion && (
                <>
                  <Divider orientation='right'>Datos Del Familiar Que Autoriza Cremación</Divider>

                  {hasCremacionAuth && (
                    <div className='fadeInRight'>
                      <Form.Item {...layoutWrapper}>
                        <Alert
                          message='Diligencie la información del familiar o persona que autoriza la cremación.'
                          type='warning'
                          showIcon
                        />
                      </Form.Item>

                      <Form.Item
                        label='Tipo Documento'
                        name='authIDType'
                        initialValue={objJosn?.authIDType ? objJosn?.authIDType : '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
                        rules={[{ required: true }]}
                      >
                        <SelectComponent
                          options={l_tipos_documento_autoriza}
                          onChange={cambiodocumentoautoriza}
                          optionPropkey='id'
                          optionPropLabel='descripcion'
                        />
                      </Form.Item>

                      <Form.Item
                        label='Número de Identificación'
                        name='mauthIDNumber'
                        rules={[{ required: !sininformacionaut }]}
                        initialValue={objJosn?.mauthIDNumber ? objJosn?.mauthIDNumber : null}
                      >
                        <Input
                          allowClear
                          type='text'
                          placeholder='Número Identificación'
                          autoComplete='off'
                          pattern={tipocampoautoriza}
                          disabled={sininformacion}
                          maxLength={longitudmaximaautoriza}
                          onKeyPress={(event) => {
                            if (!tipocampovalidacionautoriza.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          onPaste={(event) => {
                            event.preventDefault();
                          }}
                          onInvalid={() => {
                            Swal.fire({
                              icon: 'error',
                              title: 'Datos invalidos',
                              text:
                                'Sección:Datos Del Familiar Que Autoriza Cremación \n recuerde que para el tipo de documento: ' +
                                tipodocumentoautoriza +
                                ' solo se admiten valores ' +
                                campoautoriza +
                                ' de longitud entre ' +
                                longitudminimaautoriza +
                                ' y ' +
                                longitudmaximaautoriza
                            });
                          }}
                        />
                      </Form.Item>

                      <Form.Item
                        label='Primer Nombre'
                        name='authName'
                        initialValue={objJosn?.authName ? objJosn?.authName : null}
                        rules={[{ required: true, max: 50 }]}
                      >
                        <Input
                          allowClear
                          placeholder='Primer Nombre'
                          autoComplete='off'
                          type='text'
                          onKeyPress={(event) => {
                            if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          onPaste={(event) => {
                            event.preventDefault();
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label='Segundo Nombre'
                        initialValue={objJosn?.authSecondName ? objJosn?.authSecondName : null}
                        rules={[{ max: 50 }]}
                        name='authSecondName'
                      >
                        <Input
                          allowClear
                          placeholder='Segundo Nombre'
                          autoComplete='off'
                          type='text'
                          onKeyPress={(event) => {
                            if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          onPaste={(event) => {
                            event.preventDefault();
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label='Primer Apellido'
                        initialValue={objJosn?.authSurname ? objJosn?.authSurname : null}
                        name='authSurname'
                        rules={[{ required: true, max: 50 }]}
                      >
                        <Input
                          allowClear
                          placeholder='Primer Apellido'
                          autoComplete='off'
                          type='text'
                          onKeyPress={(event) => {
                            if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          onPaste={(event) => {
                            event.preventDefault();
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label='Segundo Apellido'
                        initialValue={objJosn?.authSecondSurname ? objJosn?.authSecondSurname : null}
                        name='authSecondSurname'
                        rules={[{ max: 50 }]}
                      >
                        <Input
                          allowClear
                          placeholder='Segundo Apellido'
                          autoComplete='off'
                          type='text'
                          onKeyPress={(event) => {
                            if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          onPaste={(event) => {
                            event.preventDefault();
                          }}
                        />
                      </Form.Item>

                      <AutorizacionCremacion form={form} tipoLicencia={tipoLicencia} />

                      <Form.Item
                        label='Parentesco'
                        initialValue={objJosn?.authParentesco ? objJosn?.authParentesco : 'Cónyuge (Compañero/a Permanente)'}
                        name='authParentesco'
                        rules={[{ required: true }]}
                      >
                        <Radio.Group onChange={onChangeParentesco}>
                          <Radio value='Padre / Madre'>Padre / Madre</Radio>
                          <br />
                          <Radio value='Hermano/a'>Hermano/a</Radio>
                          <br />
                          <Radio value='Hijo/a'>Hijo/a</Radio>
                          <br />
                          <Radio value='Cónyuge (Compañero/a Permanente)'>Cónyuge (Compañero/a Permanente)</Radio>
                          <br />
                          <Radio value='Tío/a'>Tío/a</Radio>
                          <br />
                          <Radio value='Sobrino/a'>Sobrino/a</Radio>
                          <br />
                          <Radio value='Abuelo/a'>Abuelo/a</Radio>
                          <br />
                          <Radio value='Nieto/a'>Nieto/a</Radio>
                          <br />
                          <Radio value='Otro'>Otro</Radio>
                        </Radio.Group>
                      </Form.Item>

                      {isOtherParentesco && (
                        <Form.Item
                          className='fadeInRight'
                          label='Otro... ¿Cúal?'
                          name='authOtherParentesco'
                          initialValue={objJosn?.authOtherParentesco ? objJosn?.authOtherParentesco : null}
                          rules={[{ required: true }]}
                        >
                          <Input allowClear placeholder='Especifique el Parentesco' autoComplete='off' />
                        </Form.Item>
                      )}
                    </div>
                  )}
                </>
              )}

              <SolicitudInfoFormSeccion prop={getDataSolicitante} form={form} obj={objJosn} />
              <DatoSolicitanteAdd prop={getData} form={form} obj={objJosn} />
              <CementerioInfoFormSeccion obj={objJosn} form={form} tipoLicencia={tipoLicencia} />

              <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
                <div className='d-flex justify-content-between'>
                  <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                    Volver atrás
                  </Button>
                  <Button type='primary' htmlType='button' onClick={() => ValidacionAutorizador()}>
                    Siguiente
                  </Button>
                </div>
              </Form.Item>
            </div>
          </>

          <>
            <div className={`d-none fadeInRight ${current === 3 && 'd-block'}`}>
              <MedicalSignatureFormSeccion prop={getData} obj={objJosn} form={form} tipoLicencia={tipoLicencia} />

              <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
                <div className='d-flex justify-content-between'>
                  <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                    Volver atrás
                  </Button>
                  <Button type='primary' htmlType='button' onClick={() => ValidacionMedico()}>
                    Siguiente
                  </Button>
                </div>
              </Form.Item>
            </div>
          </>

          <>
            <div className={`d-none fadeInRight ${current === 4 && 'd-block'}`}>
              <DocumentosFormSeccion obj={objJosn} tipoLicencia={tipoLicencia} tipoIndividuo='Individual' form={form} />
              <Actions />
            </div>
          </>
        </Form>
      </div>
    </div>
  );
};
