import React, { useCallback, useEffect, useState } from 'react';
// Antd
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Steps from 'antd/es/steps';
import Button from 'antd/es/button';
// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';
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
import { DocumentosFormSeccion } from './seccions/documentos.form-seccion';

// Servicios
import {
  dominioService,
  ETipoDominio,
  IBarrio,
  IDepartamento,
  IDominio,
  ILocalidad,
  IMunicipio,
  IUpz
} from 'app/services/dominio.service';
import Divider from 'antd/es/divider';
import { RadioChangeEvent } from 'antd/es/radio';
import { FamilarFetalCremacion } from './familarCremacion';
import { DocumentosSoporte, IRegistroLicencia } from 'app/Models/IRegistroLicencia';
import moment from 'moment';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { ApiService } from 'app/services/Apis.service';
import { TypeDocument } from './seccions/TypeDocument';
import { useHistory } from 'react-router';
import { EditFetal } from './edit/fetal';
import { ValidationFuntional } from './seccions/validationfuntional';
import { IRoles } from 'app/Models/IRoles';

const { Step } = Steps;

export const FetalForm: React.FC<ITipoLicencia> = (props) => {
  const history = useHistory();
  const { tipoLicencia, tramite } = props;
  const [form] = Form.useForm<any>();
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);
  //#region Listados

  const [l_departamentos, setLDepartamentos] = useState<IDepartamento[]>([]);
  const [l_localidades, setLLocalidades] = useState<ILocalidad[]>([]);
  const [roles, setroles] = useState<IRoles[]>([]);
  const [[l_tipos_documento, l_nivel_educativo, l_paises, l_tipo_muerte, l_estado_civil, l_etnia], setListas] = useState<
    IDominio[][]
  >([]);

  const [type, setType] = useState<[]>([]);
  const [supports, setSupports] = useState<any[]>([]);
  const [user, setUser] = useState<any>();
  const idBogota = '31211657-3386-420a-8620-f9c07a8ca491';
  const idlocalidad = '0e2105fb-08f8-4faf-9a79-de5effa8d198';
  const idupz = 'd869bc18-4fca-422a-9a09-a88d3911dc8c';
  const idbarrio = '4674c6b9-1e5f-4446-8b2a-1a986a10ca2e';
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const obj: any = EditFetal();

  const isEdit = obj?.idTramite !== undefined;

  const getListas = useCallback(
    async () => {
      const [userRes, departamentos, localidades, listMunicipio, upzLocalidad, ...resp] = await Promise.all([
        api.getCodeUser(),
        dominioService.get_departamentos_colombia(),
        dominioService.get_localidades_bogota(),
        dominioService.get_municipios_by_departamento(idDepartamentoBogota),
        dominioService.get_upz_by_localidad(idlocalidad),
        dominioService.get_type(ETipoDominio['Tipo Documento']),
        dominioService.get_type(ETipoDominio['Nivel Educativo']),
        dominioService.get_type(ETipoDominio.Pais),
        dominioService.get_type(ETipoDominio['Tipo de Muerte']),
        dominioService.get_type(ETipoDominio['Estado Civil']),
        dominioService.get_type(ETipoDominio.Etnia)
      ]);
      const mysRoles = await api.GetRoles();
      setroles(mysRoles);

      setUser(userRes);
      setLDepartamentos(departamentos);
      setLLocalidades(localidades);
      setListas(resp);
      setLMunicipios(listMunicipio);
      setLAreas(upzLocalidad);
      onChangeArea(idupz);
      if (isEdit) {
        const support = await api.getSupportDocuments(obj?.idSolicitud);
        const typeList = await api.GetAllTypeValidation();
        setSupports(support);
        setType(typeList);
      }
      //setEstado(reqEstado[0]);
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

  const onSubmit = async (values: any) => {
    const idPersonaVentanilla = localStorage.getItem(accountIdentifier);
    setStatus(undefined);
    const formatDate = 'MM-DD-YYYY';
    const estadoSolicitud = 'fdcea488-2ea7-4485-b706-a2b96a86ffdf';

    let persona: any[] = [];
    if (tipoLicencia === 'Inhumación') {
      persona = [
        //madre
        {
          idPersona: obj?.idMadre,
          tipoIdentificacion: values.IDType,
          numeroIdentificacion: values.IDNumber,
          primerNombre: values.namemother,
          segundoNombre: values.secondNamemother,
          primerApellido: values.surnamemother,
          segundoApellido: values.secondSurnamemother,
          fechaNacimiento: null,
          nacionalidad: values.nationalidadmother[0],
          otroParentesco: null,
          idEstadoCivil: values.civilStatusmother,
          idNivelEducativo: values.educationLevelmother,
          idEtnia: values.etniamother,
          idRegimen: '00000000-0000-0000-0000-000000000000',
          idTipoPersona: '342d934b-c316-46cb-a4f3-3aac5845d246',
          idParentesco: '00000000-0000-0000-0000-000000000000',
          idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
        },

        //certifica la defuncion
        {
          idPersona: obj?.idmedico,
          tipoIdentificacion: values.medicalSignatureIDType,
          numeroIdentificacion: values.medicalSignatureIDNumber,
          primerNombre: values.medicalSignatureName,
          segundoNombre: values.medicalSignatureSecondName,
          primerApellido: values.medicalSignatureSurname,
          segundoApellido: values.medicalSignatureSecondSurname,
          fechaNacimiento: null,
          nacionalidad: '00000000-0000-0000-0000-000000000000',
          otroParentesco: null,
          idEstadoCivil: '00000000-0000-0000-0000-000000000000',
          idNivelEducativo: '00000000-0000-0000-0000-000000000000',
          idEtnia: '00000000-0000-0000-0000-000000000000',
          idRegimen: '00000000-0000-0000-0000-000000000000',
          idTipoPersona: 'd8b0250b-2991-42a0-a672-8e3e45985500',
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
          idPersona: obj?.idMadre,
          tipoIdentificacion: values.IDType,
          numeroIdentificacion: values.IDNumber,
          primerNombre: values.namemother,
          segundoNombre: values.secondNamemother,
          primerApellido: values.surnamemother,
          segundoApellido: values.secondSurnamemother,
          fechaNacimiento: null,
          nacionalidad: values.nationalidadmother[0],
          otroParentesco: null,
          idEstadoCivil: values.civilStatusmother,
          idNivelEducativo: values.educationLevelmother,
          idEtnia: values.etniamother,
          idRegimen: '00000000-0000-0000-0000-000000000000',
          idTipoPersona: '342d934b-c316-46cb-a4f3-3aac5845d246',
          idParentesco: '00000000-0000-0000-0000-000000000000',
          idLugarExpedicion: '00000000-0000-0000-0000-000000000000'
        },
        //authorizador cremacion
        {
          //idPersona: '',
          tipoIdentificacion: values.authIDType,
          numeroIdentificacion: values.mauthIDNumber,
          primerNombre: values.authName,
          segundoNombre: values.authSecondName,
          primerApellido: values.authSurname,
          segundoApellido: values.authSecondSurname,
          fechaNacimiento: null,
          nacionalidad: '00000000-0000-0000-0000-000000000000',
          otroParentesco: null, //lista parentesco
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
          idPersona: obj?.idmedico,
          tipoIdentificacion: values.medicalSignatureIDType,
          numeroIdentificacion: values.medicalSignatureIDNumber,
          primerNombre: values.medicalSignatureName,
          segundoNombre: values.medicalSignatureSecondName,
          primerApellido: values.medicalSignatureSurname,
          segundoApellido: values.medicalSignatureSecondSurname,
          fechaNacimiento: null,
          nacionalidad: '00000000-0000-0000-0000-000000000000',
          otroParentesco: null,
          idEstadoCivil: '00000000-0000-0000-0000-000000000000',
          idNivelEducativo: '00000000-0000-0000-0000-000000000000',
          idEtnia: '00000000-0000-0000-0000-000000000000',
          idRegimen: '00000000-0000-0000-0000-000000000000',
          idTipoPersona: 'd8b0250b-2991-42a0-a672-8e3e45985500',
          idParentesco: '00000000-0000-0000-0000-000000000000',
          idLugarExpedicion: '1e05f64f-5e41-4252-862c-5505dbc3931c', //values.medicalSignatureIDExpedition,
          idTipoProfesional: values.medicalSignatureProfesionalType
        }
      ];
    }

    const json: IRegistroLicencia<any> = {
      solicitud: {
        idSolicitud: obj?.idSolicitud,
        numeroCertificado: values.certificado,
        fechaDefuncion: moment(values.date).format(formatDate),
        sinEstablecer: values.check,
        hora: values.check === true ? null : moment(values.time).format('LT'),
        idSexo: values.sex,
        estadoSolicitud: values.validFunctionaltype ?? estadoSolicitud,
        idPersonaVentanilla: Number(user), //numero de usuario registrado
        idUsuarioSeguridad: accountIdentifier,
        idTramite: tramite?.toString(),
        idTipoMuerte: values.deathType,
        persona,
        lugarDefuncion: {
          idLugarDefuncion: obj?.idLugarDefuncion,
          idPais: values.country,
          idDepartamento: values.state,
          idMunicipio: values.city,
          idAreaDefuncion: values.areaDef,
          idSitioDefuncion: values.sitDef
        },
        ubicacionPersona: {
          idUbicacionPersona: obj?.idUbicacionPersona,
          idPaisResidencia: values.pais,
          idDepartamentoResidencia: values.departamento,
          idCiudadResidencia: values.ciudad,
          idLocalidadResidencia: values.localidad,
          idAreaResidencia: values.area,
          idBarrioResidencia: values.barrio
        },
        datosCementerio: {
          idDatosCementerio: obj?.idDatosCementerio,
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
          enBogota: values.funerariaLugar === 'Dentro de Bogotá',
          fueraBogota: values.funerariaLugar === 'Fuera de Bogotá',
          fueraPais: values.funerariaLugar === 'Fuera del País',
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
          correoMedico: values.emailmedicalSignature
        },
        institucionCertificaFallecimiento: {
          idInstitucionCertificaFallecimiento: obj?.idInstitucionCertificaFallecimiento,
          tipoIdentificacion: values.instTipoIdent,
          numeroIdentificacion: values.instNumIdent,
          razonSocial: values.instRazonSocial,
          numeroProtocolo: values.instNumProtocolo,
          numeroActaLevantamiento: values.instNumActaLevantamiento,
          fechaActa: moment(values.instFechaActa).format(formatDate),
          seccionalFiscalia: values.instSeccionalFiscalia,
          noFiscal: values.instNoFiscal,
          idTipoInstitucion: values.instType
        }
        // documentosSoporte: generateFormFiel(values.instType)
      }
    };

    const container = tipoLicencia === 'Inhumación' ? 'inhumacionfetal' : 'cremacionfetal';
    const formData = new FormData();
    const supportDocuments: any[] = [];

    if (isEdit) {
      debugger;
      const resp = await api.putLicencia(json.solicitud);

      const [files, names] = generateListFiles(values, container);
      const supportDocumentsEdit: any[] = [];

      files.forEach((item: any, i: number) => {
        const name = names[i];

        formData.append('file', item);
        formData.append('nameFile', name);

        TypeDocument.forEach((item: any) => {
          if (item.key === name.toString()) {
            const [support] = supports.filter((p) => p.path.includes(item.key));

            if (support !== undefined) {
              supportDocumentsEdit.push({
                idDocumentoSoporte: support.idDocumentoSoporte,
                idSolicitud: resp,
                idTipoDocumentoSoporte: item.value,
                path: `${accountIdentifier}/${name}`,
                idUsuario: accountIdentifier,
                fechaModificacion: new Date()
              });
            } else {
              supportDocumentsEdit.push({
                idSolicitud: resp,
                idTipoDocumentoSoporte: item.value,
                path: `${accountIdentifier}/${name}`,
                idUsuario: accountIdentifier
              });
            }
          }
        });
      });

      formData.append('containerName', container);
      formData.append('oid', accountIdentifier);

      if (supportDocumentsEdit.length) {
        await api.uploadFiles(formData);
        await api.UpdateSupportDocuments(supportDocumentsEdit);
      }

      const tramite = {
        fechaRegistro: new Date(),
        usuario: obj.idUsuario,
        estado: values?.validFunctionaltype,
        idSolicitud: json.solicitud.idSolicitud,
        observacion: values?.descripcionvalidfuncional
      };

      if (tramite.observacion !== '') {
        await api.addSeguimiento(tramite);
      }

      localStorage.removeItem('register');
    }
    if (!isEdit) {
      debugger;
      const resp = await api.postprueba(json);

      if (resp) {
        const [files, names] = generateListFiles(values, container);

        files.forEach((file: any, i: number) => {
          const name = names[i];

          formData.append('file', file);
          formData.append('nameFile', name);

          TypeDocument.forEach((item: any) => {
            if (item.key === name.toString()) {
              supportDocuments.push({
                idSolicitud: resp,
                idTipoDocumentoSoporte: item.value,
                path: `${accountIdentifier}/${name}`,
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

  const onSubmitFailed = () => setStatus('error');

  const generateListFiles = (values: any, container: string) => {
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
    const NameDoc = container.indexOf('fatal') ? 'Documento_de_la_Madre' : 'Documento_del_fallecido';
    Objs.push({ file: fileCertificadoDefuncion, name: 'Certificado_Defunción' });
    Objs.push({ file: fileCCFallecido, name: NameDoc });
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

  const generateFormFiel = (tipoInstitucion: string): DocumentosSoporte[] => {
    let data: DocumentosSoporte[] = [];
    if (tipoInstitucion) {
      data = [
        {
          idTipoDocumentoSoporte: 'Certificado Defunción',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Documento de la Madre',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Otros Documentos',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Autorizacion de cremacion del familiar',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Documento del familiar',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        }
      ];
    }
    if (tipoInstitucion) {
      data = [
        {
          idTipoDocumentoSoporte: 'Certificado Defunción',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Documento de la Madre',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Otros Documentos',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Autorizacion de cremacion del familiar',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Documento del familiar',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Autorizacion del fiscal para cremar',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Oficio de medicina legal al fiscal para cremar',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        },
        {
          idTipoDocumentoSoporte: 'Acta Notarial del Fiscal',
          fechaRegistro: moment(new Date()).format('L'),
          idUsuario: accountIdentifier
        }
      ];
    }
    return data;
  };

  //#region Eventos formulario

  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [l_areas, setLAreas] = useState<IUpz[]>([]);
  const [l_barrios, setLBarrios] = useState<IBarrio[]>([]);

  const [isColombia, setIsColombia] = useState(true);
  const [isBogota, setIsBogota] = useState(true);

  const idColombia = '1e05f64f-5e41-4252-862c-5505dbc3931c';
  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
  const onChangePais = (value: string) => {
    form.resetFields(['departamento', 'ciudad', 'localidad', 'area', 'barrio']);
    setIsColombia(value === idColombia);
    setLMunicipios([]);
    setIsBogota(false);
    setLAreas([]);
    setLBarrios([]);
  };

  const onChangeDepartamento = async (value: string) => {
    form.resetFields(['ciudad', 'localidad', 'area', 'barrio']);
    const resp = await dominioService.get_municipios_by_departamento(value);
    setLMunicipios(resp);
    setIsBogota(false);
    setLAreas([]);
    setLBarrios([]);
  };

  const onChangeMunicipio = (value: string) => {
    form.resetFields(['localidad', 'area', 'barrio']);
    setIsBogota(value === idBogota);
    setLAreas([]);
    setLBarrios([]);
  };

  const onChangeLocalidad = async (value: string) => {
    form.resetFields(['area', 'barrio']);
    const resp = await dominioService.get_upz_by_localidad(value);
    setLAreas(resp);
    setLBarrios([]);
  };

  const onChangeArea = async (value: string) => {
    form.resetFields(['barrio']);
    const resp = await dominioService.get_barrio_by_upz(value);
    setLBarrios(resp);
  };
  const onChangeParentesco = (e: RadioChangeEvent) => {
    form.resetFields(['authOtherParentesco']);
    //setIsOtherParentesco(e.target.value === 'Otro');
  };

  const [permiso] = roles;

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

  //#endregion

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
          <Step title='INFORMACION DE LA MADRE' description='Datos generales de la madre.' />
          <Step title='INFORMACION SOLICITANTE' description='Datos solicitante – cementerio.' />
          <Step title='INFORMACION DEL MEDICO' description='Datos del Médico que certifica.' />
          <Step title='INFORMACION SOPORTES' description='Datos Documentos de soporte PDF .' />
          {permiso?.rol === 'Funcionario' && isEdit ? (
            <Step title='Resultado de la validacion' description='Resultado de la validacion funcional.' />
          ) : null}
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
          <div className={`d-none fadeInRight ${current === 0 && 'd-block'}`}>
            <GeneralInfoFormSeccion obj={obj} />
            <LugarDefuncionFormSeccion form={form} obj={obj} />
            <DeathInstituteFormSeccion obj={obj} form={form} datofiscal={true} required={false} tipoLicencia={tipoLicencia} />
            <Divider orientation='right'> Tipo de Muerte </Divider>
            <Form.Item
              label='Tipo de Muerte'
              name='deathType'
              initialValue='475c280d-67af-47b0-a8bc-de420f6ac740'
              rules={[{ required: true }]}
            >
              <SelectComponent options={l_tipo_muerte} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>

            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-end'>
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={() => onNextStep([...KeyFormGeneralInfo, ...KeyFormLugarDefuncion])}
                >
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 1 && 'd-block'}`}>
            <Divider orientation='right'> INFORMACION DE LA MADRE</Divider>
            <Form.Item
              label='Tipo Identificación'
              name='IDType'
              rules={[{ required: true }]}
              initialValue={obj?.IDType ?? '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
            >
              <SelectComponent options={l_tipos_documento} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>
            <Form.Item
              label='Número de Identificación'
              initialValue={obj?.IDNumber}
              name='IDNumber'
              rules={[{ required: true, max: 25 }]}
            >
              <Input allowClear placeholder='Número de Identificación' autoComplete='off' />
            </Form.Item>

            <Form.Item label='Primer Nombre' name='namemother' initialValue={obj?.namemother} rules={[{ required: true }]}>
              <Input allowClear placeholder='Primer Nombre' autoComplete='off' />
            </Form.Item>
            <Form.Item label='Segundo Nombre' name='secondNamemother' initialValue={obj?.secondNamemother}>
              <Input allowClear placeholder='Segundo Nombre' autoComplete='off' />
            </Form.Item>
            <Form.Item
              label='Primer Apellido'
              name='surnamemother'
              initialValue={obj?.surnamemother}
              rules={[{ required: true }]}
            >
              <Input allowClear placeholder='Primer Apellido' autoComplete='off' />
            </Form.Item>
            <Form.Item label='Segundo Apellido' name='secondSurnamemother' initialValue={obj?.surnamemother}>
              <Input allowClear placeholder='Segundo Apellido' autoComplete='off' />
            </Form.Item>

            <Form.Item
              label='Nacionalidad de la Madre'
              name='nationalidadmother'
              initialValue={obj?.nationalidadmother ?? [idColombia]}
              rules={[{ required: true, type: 'array' }]}
            >
              <SelectComponent
                options={l_paises}
                mode='multiple'
                placeholder='-- Elija una o varias --'
                optionPropkey='id'
                optionPropLabel='descripcion'
              />
            </Form.Item>

            <Form.Item
              label='Estado Civil'
              name='civilStatusmother'
              initialValue={obj?.civilStatus ?? '4c17996a-7113-4e17-a0fe-6fd7cd9bbcd1'}
            >
              <SelectComponent options={l_estado_civil} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>
            <Form.Item
              label='Nivel Educativo'
              name='educationLevelmother'
              initialValue={obj?.educationLevel ?? '07ebd0bb-2b00-4a2b-8db5-4582eee1d285'}
            >
              <SelectComponent options={l_nivel_educativo} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>
            <Form.Item label='Etnia' name='etniamother' initialValue={obj?.etnia ?? '60875c52-9b2a-4836-8bc7-2f3648f41f57'}>
              <SelectComponent options={l_etnia} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>

            <Divider orientation='right'> RESIDENCIA HABITUAL DE LA MADRE</Divider>
            <Form.Item
              label='País de Residencia'
              name='pais'
              initialValue={obj?.residencia ?? idColombia}
              rules={[{ required: true }]}
            >
              <SelectComponent options={l_paises} optionPropkey='id' optionPropLabel='descripcion' onChange={onChangePais} />
            </Form.Item>

            <Form.Item
              label='Departamento de Residencia'
              initialValue={obj?.idDepartamentoResidencia ?? idDepartamentoBogota}
              name='departamento'
              rules={[{ required: isColombia }]}
            >
              <SelectComponent
                options={l_departamentos}
                optionPropkey='idDepartamento'
                optionPropLabel='descripcion'
                disabled={!isColombia}
                onChange={onChangeDepartamento}
              />
            </Form.Item>

            {isColombia ? (
              <Form.Item
                label='Ciudad de Residencia'
                initialValue={obj?.idCiudadResidencia ?? idBogota}
                name='ciudad'
                rules={[{ required: true }]}
              >
                <SelectComponent
                  options={l_municipios}
                  optionPropkey='idMunicipio'
                  optionPropLabel='descripcion'
                  onChange={onChangeMunicipio}
                />
              </Form.Item>
            ) : (
              <Form.Item
                label='Ciudad de Residencia'
                name='ciudad'
                initialValue={obj?.idCiudadResidencia}
                rules={[{ required: true }]}
              >
                <Input allowClear placeholder='Ciudad' autoComplete='off' />
              </Form.Item>
            )}

            <Form.Item
              label='Localidad de Residencia'
              initialValue={obj?.idLocalidadResidencia ?? idlocalidad}
              name='localidad'
              rules={[{ required: isBogota }]}
            >
              <SelectComponent
                options={l_localidades}
                optionPropkey='idLocalidad'
                optionPropLabel='descripcion'
                disabled={!isBogota}
                onChange={onChangeLocalidad}
              />
            </Form.Item>

            <Form.Item
              label='Área de Residencia'
              initialValue={obj?.idAreaResidencia ?? idupz}
              name='area'
              rules={[{ required: isBogota }]}
            >
              <SelectComponent
                options={l_areas}
                optionPropkey='idUpz'
                optionPropLabel='descripcion'
                disabled={!isBogota}
                onChange={onChangeArea}
              />
            </Form.Item>

            <Form.Item
              label='Barrio de Residencia'
              initialValue={obj?.idBarrioResidencia ?? idbarrio}
              name='barrio'
              rules={[{ required: isBogota }]}
            >
              <SelectComponent options={l_barrios} optionPropkey='idBarrio' optionPropLabel='descripcion' disabled={!isBogota} />
            </Form.Item>
            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-between'>
                <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                  Volver atrás
                </Button>
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={() =>
                    onNextStep([
                      'name',
                      'secondName',
                      'surname',
                      'secondSurname',
                      'nationalidad',
                      'IDType',
                      'IDNumber',
                      'pais',
                      'departamento',
                      'ciudad',
                      'localidad',
                      'area',
                      'barrio',
                      'civilStatus',
                      'educationLevel',
                      'etnia'
                    ])
                  }
                >
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 2 && 'd-block'}`}>
            {tipoLicencia === 'Cremación' && <FamilarFetalCremacion tipoLicencia={tipoLicencia} objJosn={obj} />}

            <SolicitudInfoFormSeccion obj={obj} form={form} />

            <CementerioInfoFormSeccion obj={obj} form={form} tipoLicencia={tipoLicencia} />

            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-between'>
                <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                  Volver atrás
                </Button>
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={() =>
                    onNextStep([
                      ...KeyFormDeathInstitute,
                      ...KeyFormSolicitudInfo,
                      ...KeyFormCementerio,
                      'deathType',
                      'authIDType',
                      'authName',
                      'authSecondName',
                      'authSurname',
                      'authSecondSurname',
                      'authParentesco',
                      'authOtherParentesco'
                    ])
                  }
                >
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 3 && 'd-block'}`}>
            <MedicalSignatureFormSeccion obj={obj} form={form} tipoLicencia={tipoLicencia} />

            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-between'>
                <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                  Volver atrás
                </Button>
                <Button type='primary' htmlType='button' onClick={() => onNextStep([...KeyFormMedicalSignature])}>
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 4 && 'd-block'}`}>
            <DocumentosFormSeccion obj={obj} files={supports} tipoLicencia={tipoLicencia} tipoIndividuo='Fetal' form={form} />

            {!isEdit ? <Actions /> : null}
          </div>
          {isEdit ? (
            <div className={`d-none fadeInRight ${current === 5 && 'd-block'}`}>
              {
                <>
                  <ValidationFuntional idSolicitud={obj?.idSolicitud} idTramite={obj?.idTramite} type={type} />
                  <Actions />
                </>
              }
            </div>
          ) : null}
        </Form>
      </div>
    </div>
  );
};
