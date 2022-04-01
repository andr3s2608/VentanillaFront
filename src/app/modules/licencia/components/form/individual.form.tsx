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

const { Step } = Steps;

export const IndividualForm: React.FC<ITipoLicencia> = (props) => {
  const history = useHistory();
  const { tipoLicencia, tramite } = props;
  const [form] = Form.useForm<any>();
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [user, setUser] = useState<any>();
  const [supports, setSupports] = useState<any[]>([]);
  const [type, setType] = useState<[]>([]);
  //create o edit
  const objJosn: any = EditInhumacion();
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

      const userres = await api.getCodeUser();
      setUser(userres);
      setListas(resp);

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

  const onSubmit = async (values: any) => {
    setStatus(undefined);
    const idPersonaVentanilla = localStorage.getItem(accountIdentifier);
    const formatDate = 'MM-DD-YYYY';
    const estadoSolicitud = 'fdcea488-2ea7-4485-b706-a2b96a86ffdf'; //estado?.estadoSolicitud;

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
        persona: [
          //fallecido
          {
            tipoIdentificacion: values.IDType,
            numeroIdentificacion: values.IDNumber,
            primerNombre: values.name,
            segundoNombre: values.secondName,
            primerApellido: values.surname,
            segundoApellido: values.secondSurname,
            fechaNacimiento: null,
            nacionalidad: values.nationalidad[0],
            otroParentesco: null,
            idEstadoCivil: values.civilStatus,
            idNivelEducativo: values.educationLevel,
            idEtnia: values.etnia,
            idRegimen: values.regimen,
            idTipoPersona: '01f64f02-373b-49d4-8cb1-cb677f74292c',
            idParentesco: '00000000-0000-0000-0000-000000000000',
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
          idMunicipio: values.city,
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
        const container = tipoLicencia === 'Inhumación' ? 'inhumacionindividual' : 'cremacionindividual';
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
          <Step title='INFORMACION DEL MEDICO' description='Datos del médico que certifica.' />
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
            <Form.Item label='Primer Nombre' name='name' rules={[{ required: true }]} initialValue={objJosn?.name}>
              <Input allowClear placeholder='Primer Nombre' autoComplete='off' />
            </Form.Item>
            <Form.Item label='Segundo Nombre' name='secondName' initialValue={objJosn?.secondName}>
              <Input allowClear placeholder='Segundo Nombre' autoComplete='off' />
            </Form.Item>
            <Form.Item label='Primer Apellido' name='surname' rules={[{ required: true }]} initialValue={objJosn?.surname}>
              <Input allowClear placeholder='Primer Apellido' autoComplete='off' />
            </Form.Item>
            <Form.Item label='Segundo Apellido' name='secondSurname' initialValue={objJosn?.secondSurname}>
              <Input allowClear placeholder='Segundo Apellido' autoComplete='off' />
            </Form.Item>
            <Form.Item
              label='Nacionalidad'
              name='nationalidad'
              initialValue={[objJosn?.nacionalidad ? objJosn?.nacionalidad : '1e05f64f-5e41-4252-862c-5505dbc3931c']}
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
            <Form.Item label='Fecha de Nacimiento' name='dateOfBirth' rules={[{ required: true }]} initialValue={date}>
              <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' value={date} />
            </Form.Item>
            <Form.Item
              label='Tipo Identificación'
              name='IDType'
              initialValue={objJosn?.IDType ? objJosn?.IDType : '7c96a4d3-a0cb-484e-a01b-93bc39c2552e'}
              rules={[{ required: true }]}
            >
              <SelectComponent options={l_tipos_documento} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>
            <Form.Item
              label='Número de Identificación'
              name='IDNumber'
              initialValue={objJosn?.IDNumber !== undefined ? objJosn?.IDNumber : null}
              rules={[{ required: true, max: 25 }]}
            >
              <Input allowClear placeholder='Número de Identificación' autoComplete='off' />
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
                  <SelectComponent options={l_tipos_documento} optionPropkey='id' optionPropLabel='descripcion' />
                </Form.Item>

                <Form.Item label='Número de Identificación' name='knownIDNumber'>
                  <Input allowClear type='tel' placeholder='Número de Identificación' autoComplete='off' />
                </Form.Item>

                <Form.Item label='Nombre' name='knownName'>
                  <Input allowClear placeholder='Nombres y Apellidos completos' autoComplete='off' />
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
                <Divider orientation='right'>Datos Del Familiar Que Autoriza la Cremación</Divider>

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
                      <SelectComponent options={l_tipos_documento} optionPropkey='id' optionPropLabel='descripcion' />
                    </Form.Item>

                    <Form.Item
                      label='Número de Identificación'
                      name='mauthIDNumber'
                      rules={[{ required: true, max: 20 }]}
                      initialValue={objJosn?.mauthIDNumber ? objJosn?.mauthIDNumber : null}
                    >
                      <Input allowClear type='tel' placeholder='Número de Identificación' autoComplete='off' />
                    </Form.Item>

                    <Form.Item
                      label='Primer Nombre'
                      name='authName'
                      initialValue={objJosn?.authName ? objJosn?.authName : null}
                      rules={[{ required: true }]}
                    >
                      <Input allowClear placeholder='Primer Nombre' autoComplete='off' />
                    </Form.Item>
                    <Form.Item
                      label='Segundo Nombre'
                      initialValue={objJosn?.authSecondName ? objJosn?.authSecondName : null}
                      name='authSecondName'
                    >
                      <Input allowClear placeholder='Segundo Nombre' autoComplete='off' />
                    </Form.Item>
                    <Form.Item
                      label='Primer Apellido'
                      initialValue={objJosn?.authSurname ? objJosn?.authSurname : null}
                      name='authSurname'
                      rules={[{ required: true }]}
                    >
                      <Input allowClear placeholder='Primer Apellido' autoComplete='off' />
                    </Form.Item>
                    <Form.Item
                      label='Segundo Apellido'
                      initialValue={objJosn?.authSecondSurname ? objJosn?.authSecondSurname : null}
                      name='authSecondSurname'
                    >
                      <Input allowClear placeholder='Segundo Apellido' autoComplete='off' />
                    </Form.Item>
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

                    <AutorizacionCremacion tipoLicencia={tipoLicencia} />
                  </div>
                )}
              </>
            )}

            <SolicitudInfoFormSeccion form={form} obj={objJosn} />
            <CementerioInfoFormSeccion obj={objJosn} form={form} tipoLicencia={tipoLicencia} />

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
                    ])
                  }
                >
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
