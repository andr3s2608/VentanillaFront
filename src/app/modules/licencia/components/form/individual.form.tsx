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
import Swal from 'sweetalert2';

const { Step } = Steps;

export const IndividualForm: React.FC<ITipoLicencia> = (props) => {
  const history = useHistory();
  const { tipoLicencia, tramite } = props;
  const [form] = Form.useForm<any>();
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);
  const { accountIdentifier } = authProvider.getAccount();
  const [sex, setSex] = useState<[]>([]);
  const api = new ApiService(accountIdentifier);
  const [user, setUser] = useState<any>();
  const [emailsol, setEmailso] = useState(false);
  const [emailcem, setEmailcem] = useState(false);
  const [emailfun, setEmailfun] = useState(false);
  const [supports, setSupports] = useState<any[]>([]);
  const [type, setType] = useState<[]>([]);
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(6);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{6,10}');
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [campo, setCampo] = useState<string>('Numéricos');
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
      const sexo = await api.GetSexo();
      setSex(sexo);
      const userres = await api.getCodeUser();
      setUser(userres);
      setListas(resp);
      //console.log('============');
      //console.log(resp);

      if (edit) {
        const support = await api.getSupportDocuments(objJosn?.idSolicitud);
        const typeList = await api.GetAllTypeValidation();
        setSupports(support);
        setType(typeList);
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

  const getData = (validacion: any, tipo: string) => {
    if (tipo == '0') {
      setEmailcem(validacion);
    } else {
      setEmailfun(validacion);
    }
  };
  const getDataSolicitante = (solicitante: any) => {
    if (solicitante) {
      setEmailso(true);
    } else {
      setEmailso(false);
    }
  };

  const onSubmit = async (values: any) => {
    setStatus(undefined);
    const idPersonaVentanilla = localStorage.getItem(accountIdentifier);
    const formatDate = 'MM-DD-YYYY';
    const estadoSolicitud = 'fdcea488-2ea7-4485-b706-a2b96a86ffdf'; //estado?.estadoSolicitud;
    const idUser = await api.getCodeUser();
    const resp = await api.GetInformationUser(idUser);

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
        mun = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
        break;
    }

    const json: IRegistroLicencia<any> = {
      solicitud: {
        numeroCertificado: values.certificado,
        fechaDefuncion: moment(values.date).format(formatDate),
        sinEstablecer: values.check,
        hora: values.check === true ? null : moment(values.time).format('LT'),
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
        persona: [
          //fallecido
          {
            tipoIdentificacion: values.IDType,
            numeroIdentificacion: values.IDNumber,
            primerNombre: values.name,
            segundoNombre: values.secondName,
            primerApellido: values.surname,
            segundoApellido: values.secondSurname,
            fechaNacimiento: values.dateOfBirth,
            nacionalidad: values.nationalidad[0],
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
        ],
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
          correoMedico: ''
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
    console.log('Json' + mun);
    if (edit) {
      localStorage.removeItem('');

      const container = tipoLicencia === 'Inhumación' ? 'inhumacionfetal' : 'cremacionfetal';
      const formData = new FormData();

      const resp = await api.putLicencia(json.solicitud);
      localStorage.removeItem('register');

      const [files, names] = generateListFiles(values);
      const supportDocumentsEdit: any[] = [];

      files.forEach((item: any, i: number) => {
        const name = names[i];

        formData.append('file', item);
        formData.append('nameFile', name);

        TypeDocument.forEach((item: any) => {
          if (item.key === name.toString()) {
            const [support] = supports.filter((p) => p.path.includes(item.name));
            supportDocumentsEdit.push({
              idDocumentoSoporte: support.idDocumentoSoporte,
              idSolicitud: resp,
              idTipoDocumentoSoporte: item.value,
              path: `${accountIdentifier}/${name}`,
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
      localStorage.removeItem('register');
      if (resp) {
        const formData = new FormData();
        const container = tipoLicencia === 'Inhumación' ? 'inhumacionindividual' : 'Cremación';
        const supportDocuments: any[] = [];
        const [files, names] = generateListFiles(values);

        files.forEach((item: any, i: number) => {
          const name = names[i];

          formData.append('file', item);
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

        //form.resetFields();
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

  const Prueba = () => {
    if (emailsol) {
      if (emailcem) {
        if (true) {
          onNextStep([
            ...KeyFormSolicitudInfo,
            ...KeyFormCementerio,
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
          alert('Email de Funeraria incorrecto');
        }
      } else {
        alert('Email de Cementerio incorrecto');
      }
    } else {
      alert('Email de Solicitante incorrecto');
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
    if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
      setLongitudminima(6);
      setLongitudmaxima(10);
      setTipocampo('[0-9]{6,10}');
      setCampo('Numéricos');
      setTipodocumento('Cédula de Ciudadanía');
    } else {
      if (valorupper == 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
        setLongitudminima(10);
        setLongitudmaxima(11);
        setTipocampo('[0-9]{10,11}');
        setCampo('Numéricos');
        setTipodocumento('Tarjeta de Identidad ');
      } else {
        if (valorupper == '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
          setLongitudminima(15);
          setLongitudmaxima(15);
          setTipocampo('[0-9]{15,15}');
          setCampo('Numéricos');
          setTipodocumento('Permiso Especial de Permanencia');
        } else {
          if (valorupper == 'FFE88939-06D5-486C-887C-E52D50B7F35D' || valorupper == '71F659BE-9D6B-4169-9EE2-E70BF0D65F92') {
            setLongitudminima(10);
            setLongitudmaxima(11);
            setTipocampo('[0-9]{10,11}');
            setCampo('AlfaNuméricos(Numéros y letras)');
            setTipodocumento('Registro Civil de Nacimiento y Numero único de identificacíon personal');
          } else {
            setLongitudminima(6);
            setLongitudmaxima(10);
            setTipocampo('[a-zA-Z0-9]{6,10}');
            setCampo('AlfaNuméricos(Numéros y letras)');
            setTipodocumento('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
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
          <Step title='INFORMACIÓN DEL FALLECIDO' description='Datos personales del fallecido.' />
          <Step title='INFORMACIÓN SOLICITANTE' description='Datos solicitante - cementerio.' />
          <Step title='INFORMACIÓN DEL MÉDICO' description='Datos del médico que certifica.' />
          <Step title='INFORMACION SOPORTES' description='Datos documentos de soporte PDF.' />
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
            <GeneralInfoFormSeccion obj={objJosn} />
            <LugarDefuncionFormSeccion form={form} obj={objJosn} />
            <DeathInstituteFormSeccion obj={objJosn} form={form} datofiscal={true} required={true} tipoLicencia={tipoLicencia} />

            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-end'>
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={() => onNextStep([...KeyFormGeneralInfo, ...KeyFormDeathInstitute, ...KeyFormLugarDefuncion])}
                >
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 1 && 'd-block'}`}>
            <Form.Item label='Primer Nombre' name='name' rules={[{ required: true, max: 50 }]} initialValue={objJosn?.name}>
              <Input
                allowClear
                placeholder='Primer Nombre'
                autoComplete='off'
                type='text'
                pattern='[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{3,50}'
                onInvalid={() => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Datos invalidos',
                    text: 'recuerde que no puede ingresar numéros o caracteres especiales en el campo Primer nombre'
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              label='Segundo Nombre'
              name='secondName'
              rules={[{ required: true, max: 50 }]}
              initialValue={objJosn?.secondName}
            >
              <Input
                allowClear
                placeholder='Segundo Nombre'
                autoComplete='off'
                type='text'
                pattern='[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{3,50}'
                onInvalid={() => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Datos invalidos',
                    text: 'recuerde que no puede ingresar numéros o caracteres especiales en el campo Segundo nombre'
                  });
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
                pattern='[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{3,50}'
                onInvalid={() => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Datos invalidos',
                    text: 'recuerde que no puede ingresar numéros o caracteres especiales en el campo Primer apellido'
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              label='Segundo Apellido'
              name='secondSurname'
              rules={[{ required: true, max: 50 }]}
              initialValue={objJosn?.secondSurname}
            >
              <Input
                allowClear
                placeholder='Segundo Apellido'
                autoComplete='off'
                type='text'
                pattern='[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{3,50}'
                onInvalid={() => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Datos invalidos',
                    text: 'recuerde que no puede ingresar numéros o caracteres especiales en el campo Segundo apellido'
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              label='Nacionalidad'
              name='nationalidad'
              initialValue={[objJosn?.nacionalidad ? objJosn?.nacionalidad : '1e05f64f-5e41-4252-862c-5505dbc3931c']}
              rules={[{ required: true, type: 'array', max: 1 }]}
            >
              <SelectComponent
                options={l_paises}
                mode='multiple'
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
            <Form.Item
              label='Número de Identificación'
              name='IDNumber'
              initialValue={objJosn?.IDNumber !== undefined ? objJosn?.IDNumber : null}
              rules={[{ required: true }]}
            >
              <Input
                allowClear
                type='text'
                placeholder='Número Identificación'
                autoComplete='off'
                pattern={tipocampo}
                onInvalid={() => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Datos invalidos',
                    text:
                      'recuerde que para el tipo de documento1:' +
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
                    onInvalid={() => {
                      Swal.fire({
                        icon: 'error',
                        title: 'Datos invalidos',
                        text:
                          'recuerde que para el tipo de documentox:' +
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
                    pattern='[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]{3,50}'
                    onInvalid={() => {
                      Swal.fire({
                        icon: 'error',
                        title: 'Datos invalidos',
                        text: 'recuerde que no puede ingresar numéros o caracteres especiales en el campo Nombres y Apellidos completos'
                      });
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
                    ])
                  }
                >
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

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
                        options={l_tipos_documento}
                        onChange={cambiodocumento}
                        optionPropkey='id'
                        optionPropLabel='descripcion'
                      />
                    </Form.Item>

                    <Form.Item
                      label='Número de Identificación'
                      name='mauthIDNumber'
                      rules={[{ required: true }]}
                      initialValue={objJosn?.mauthIDNumber ? objJosn?.mauthIDNumber : null}
                    >
                      <Input
                        allowClear
                        type='text'
                        placeholder='Número Identificación'
                        autoComplete='off'
                        pattern={tipocampo}
                        onInvalid={() => {
                          Swal.fire({
                            icon: 'error',
                            title: 'Datos invalidos',
                            text:
                              'recuerde que para el tipo de documentoy:' +
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
                        pattern='[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{3,50}'
                        onInvalid={() => {
                          Swal.fire({
                            icon: 'error',
                            title: 'Datos invalidos',
                            text: 'recuerde que no puede ingresar numéros o caracteres especiales en el campo Primer nombre'
                          });
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
                        pattern='[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{3,50}'
                        onInvalid={() => {
                          Swal.fire({
                            icon: 'error',
                            title: 'Datos invalidos',
                            text: 'recuerde que no puede ingresar numéros o caracteres especiales en el campo Segundo nombre'
                          });
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
                        pattern='[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{3,50}'
                        onInvalid={() => {
                          Swal.fire({
                            icon: 'error',
                            title: 'Datos invalidos',
                            text: 'recuerde que no puede ingresar numéros o caracteres especiales en el campo Primer apellido'
                          });
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
                        pattern='[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{3,50}'
                        onInvalid={() => {
                          Swal.fire({
                            icon: 'error',
                            title: 'Datos invalidos',
                            text: 'recuerde que no puede ingresar numéros o caracteres especiales en el campo Segundo apellido'
                          });
                        }}
                      />
                    </Form.Item>

                    <AutorizacionCremacion tipoLicencia={tipoLicencia} />
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
            {!isCremacion && (
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
            )}
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
            <CementerioInfoFormSeccion prop={getData} obj={objJosn} form={form} tipoLicencia={tipoLicencia} />

            <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
              <div className='d-flex justify-content-between'>
                <Button type='dashed' htmlType='button' onClick={onPrevStep}>
                  Volver atrás
                </Button>
                <Button type='primary' htmlType='button' onClick={() => Prueba()}>
                  Siguiente
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className={`d-none fadeInRight ${current === 3 && 'd-block'}`}>
            <MedicalSignatureFormSeccion obj={objJosn} form={form} tipoLicencia={tipoLicencia} />

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
            <DocumentosFormSeccion obj={objJosn} tipoLicencia={tipoLicencia} tipoIndividuo='Individual' form={form} />
            {!edit ? <Actions /> : null}
          </div>
          {edit ? (
            <div className={`d-none fadeInRight ${current === 5 && 'd-block'}`}>
              {
                <>
                  <ValidationFuntional idSolicitud={objJosn?.idSolicitud} idTramite={objJosn?.idTramite} type={type} />
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
