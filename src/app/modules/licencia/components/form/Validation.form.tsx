import { useCallback, useEffect, useState } from 'react';

// Antd

import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Alert from 'antd/es/alert';
import Steps from 'antd/es/steps';
import Radio, { RadioChangeEvent } from 'antd/es/radio';
import { columnFake } from 'app/shared/components/table/model';
import { Button, List, Modal } from 'antd';
import Table from 'antd/es/table';
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
import { InformacionFallecidoSeccion, KeysForm as KeyFormInformacionDefuncion } from './seccions/Informacion-Fallecido.seccion';
import { InformacionSolicitanteSeccion } from './seccions/Datos-solicitante.seccion';
import { InformacionMedicoCertificante } from './seccions/medico-certificante.seccion';
import { InformacionDocumentosGestion } from './seccions/documentos-gestion.seccion';
import { GestionTramite } from './seccions/gestion-tramite.seccion';

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
import 'app/shared/components/table/estilos.css';
import { EyeOutlined } from '@ant-design/icons';

export const ValidationForm: React.FC<ITipoLicencia> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { Step } = Steps;
  const [dataTable, setDataTable] = useState<[]>();
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

  const formatDate = 'MM-DD-YYYY';
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

  function getDescripcionTramite(idTramite: string): string {
    let idInhumacionIndividual = 'A289C362-E576-4962-962B-1C208AFA0273';
    let idInhumacionFetal = 'AD5EA0CB-1FA2-4933-A175-E93F2F8C0060';
    let idCremacionIndividual = 'E69BDA86-2572-45DB-90DC-B40BE14FE020';
    let idCremacionFetal = 'F4C4F874-1322-48EC-B8A8-3B0CAC6FCA8E';
    switch (idTramite) {
      case idInhumacionIndividual:
        return 'Inhumación Individual';
      case idInhumacionFetal:
        return 'Inhumación fetal';
      case idCremacionIndividual:
        return 'Cremación Individual';
      case idCremacionFetal:
        return 'Cremación fetal';
      default:
        return '';
    }
  }

  const onSubmit = async (values: any) => {
    let tipoSeguimiento: string = values.validFunctionaltype;
    if (tipoSeguimiento.toLocaleUpperCase() == '3CD0ED61-F26B-4CC0-9015-5B497673D275') {
      alert('aprobacion');
    } else {
      let solicitud = await api.GetSolicitud(objJosn?.idSolicitud);

      let fechaSolicitud: string = solicitud[0]['fechaSolicitud'];
      let idTramite = objJosn?.idTramite;

      /*let datosDinamicos = {
        ciudadano: objJosn?.name + ' ' + objJosn?.secondName + ' ' + objJosn?.surname + ' ' + objJosn.secondSurname,
        tipo_de_solicitud: getDescripcionTramite(idTramite.toLocaleUpperCase()),
        numero_de_solicitud: objJosn?.idSolicitud,
        fecha_de_solicitud: fechaSolicitud.substring(0, 10),
        observacion: values.Observations
      };*/
      let datosDinamicos = [
        objJosn?.name + ' ' + objJosn?.secondName + ' ' + objJosn?.surname + ' ' + objJosn.secondSurname,
        getDescripcionTramite(idTramite.toLocaleUpperCase()),
        objJosn?.idSolicitud,
        fechaSolicitud.substring(0, 10),
        values.Observations
      ];

      notificar(values.validFunctionaltype, datosDinamicos);
    }

    setStatus(undefined);
    const idPersonaVentanilla = localStorage.getItem(accountIdentifier);
    const formatDate = 'MM-DD-YYYY';
    const estadoSolicitud = 'fdcea488-2ea7-4485-b706-a2b96a86ffdf'; //estado?.estadoSolicitud;
    console.log('imprimir');
    /*
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
            idRegimen: '00000000-0000-0000-0000-000000000000',
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
            idRegimen: '00000000-0000-0000-0000-000000000000',
            idTipoPersona: 'cc4c8c4d-b557-4a5a-a2b3-520d757c5d06',
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
        resumenSolicitud: {
          correoCementerio: values.emailcementerio,
          correoFuneraria: values.emailcementerio,
          tipoDocumentoSolicitante: values.emailfuneraria,
          numeroDocumentoSolicitante: '',
          nombreSolicitante: '',
          apellidoSolicitante: '',
          correoSolicitante: ''
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
*/
    history.push('/tramites-servicios');
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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

  const onClickView = async (idSolicitud: string) => {
    const all = await api.getLicencia(idSolicitud);

    const alldata = all.map((item: any) => {
      item.fechaRegistro = moment(item.fechaRegistro).format(formatDate);
      return item;
    });

    setDataTable(alldata);
    showModal();
  };

  const validar = async (idSolicitud: string) => {
    const all = await api.getLicencia(idSolicitud);

    const alldata = all.map((item: any) => {
      item.fechaRegistro = moment(item.fechaRegistro).format(formatDate);
      return item;
    });

    const stringInfo: string = alldata.reduce((result: any, item: any) => {
      return `${result}${item.persona[0].primerNombre}|${result}${item.persona[0].segundoNombre}`;
    }, '');
    return stringInfo;
  };

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

  const Lista = [
    {
      title: 'Seleccione Licencia',
      describe: <SelectComponent options={type} optionPropkey='license' optionPropLabel='Licencia' />
    },
    {
      title: '',
      describe: <Button type='primary'>Consultar</Button>
    }
  ];
  const newcolumn = [
    {
      title: 'Id tramite',
      dataIndex: 'idTramite',
      key: 'idTramite'
    },
    {
      title: 'Usuario',
      dataIndex: '',
      key: 'idUsuarioSeguridad'
    },
    {
      title: 'Fecha de registro',
      dataIndex: 'fechaRegistro',
      key: 'fechaRegistro'
    },
    {
      title: 'Estado',
      dataIndex: 'estadoSolicitud',
      key: 'estadoSolicitud'
    },

    {
      title: 'Observación',
      dataIndex: '',
      key: ''
    }
  ];

  return (
    <div className='card card-body py-5 mb-4 fadeInTop'>
      <div className='d-lg-flex align-items-start'>
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
            <InformacionSolicitanteSeccion obj={objJosn} />
            <InformacionFallecidoSeccion obj={objJosn} />
            <InformacionMedicoCertificante obj={objJosn} />

            <GestionTramite idSolicitud={objJosn?.idSolicitud} idTramite={objJosn?.idTramite} type={type} />
            <InformacionDocumentosGestion obj={objJosn} id={objJosn?.idSolicitud} />

            <div className='fadeInLeft'>
              <Form.Item>
                <Button
                  type='primary'
                  onClick={() => onClickView(objJosn?.idSolicitud)}
                  icon={<EyeOutlined width={100} />}
                  size={'large'}
                  block
                >
                  Ver
                </Button>
              </Form.Item>

              <Modal
                title={<p className='text-center text-dark text-uppercase mb-0 titulo'>Ventana de seguimiento y auditoria</p>}
                visible={isModalVisible}
                onCancel={handleCancel}
                width={1000}
                okButtonProps={{ hidden: true }}
                cancelText='Cerrar'
              >
                <Table
                  className='text-center table'
                  dataSource={dataTable}
                  columns={columnFake}
                  pagination={{ hideOnSinglePage: true }}
                />
              </Modal>
            </div>
            <div>
              <List
                grid={{ gutter: 24, column: 2 }}
                dataSource={Lista}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta title={item.title} description={item.describe} />
                  </List.Item>
                )}
              />
              <Actions />
            </div>
          </div>
        </Form>
      </div>
    </div>
  );

  function agregarValoresDinamicos(HTML: string, llavesAReemplazar: string[], valoresDinamicos: string[]): string {
    let nuevoHTML = HTML;

    for (let index = 0; index < llavesAReemplazar.length; index++) {
      nuevoHTML = nuevoHTML.replace(llavesAReemplazar[index], valoresDinamicos[index]);
    }

    return nuevoHTML;
  }

  async function notificar(tipoSeguimiento: string, datosDinamicos: any) {
    const { accountIdentifier } = authProvider.getAccount();
    const api = new ApiService(accountIdentifier);

    const llavesAReemplazarGenericas = [
      '~:~ciudadano~:~',
      '~:~tipo_de_solicitud~:~',
      '~:~número_de_solicitud~:~',
      '~:~fecha_de_solicitud~:~',
      '~:~observación~:~'
    ];

    const llavesAReemplazarAprobacion = [
      '~:~ciudadano~:~',
      '~:~tipo_de_solicitud~:~',
      '~:~número_de_solicitud~:~',
      '~:~fecha_de_solicitud~:~',
      '~:~tipo_de_licencia~:~',
      '~:~link_pdf~:~'
    ];

    const idPlantillaAnulacion = '903C641E-C65B-494B-AF79-B091C55217FC';
    const idPlantillaNegacion = 'C5D07C62-E2C3-46DE-9444-E3397DAAA357';
    const idPlantillaDocumentosInconsistentes = '77CA26E9-50E6-4823-8BB3-EB1EB29726EF';
    const idPlantillaAprobacion = '985D236C-25B5-4A08-BB7B-98D22761BF63';

    switch (tipoSeguimiento.toLocaleUpperCase()) {
      case 'C21F9037-8ADB-4353-BEAD-BDBBE0ADC2C9': //'Anulado validador de documentos'
        let plantillaAnulacion = await api.getFormato(idPlantillaAnulacion);
        let bodyAnulacion = agregarValoresDinamicos(plantillaAnulacion.valor, llavesAReemplazarGenericas, datosDinamicos);

        api.sendEmail({
          to: 'ppalacios@soaint.com',
          subject: plantillaAnulacion.asuntoNotificacion,
          body: bodyAnulacion
        });
        break;
      case 'FA183116-BE8A-425F-A309-E2032221553F': //'Negado validador de documentos'
        let plantillaNegacion = await api.getFormato(idPlantillaNegacion);
        let bodyNegacion = agregarValoresDinamicos(plantillaNegacion.valor, llavesAReemplazarGenericas, datosDinamicos);

        api.sendEmail({
          to: 'ppalacios@soaint.com',
          subject: plantillaNegacion.asuntoNotificacion,
          body: bodyNegacion
        });
        break;
      case 'FE691637-BE8A-425F-A309-E2032221553F': //'Documentos Inconsistentes'
        let plantillaDocumentosInconsistentes = await api.getFormato(idPlantillaDocumentosInconsistentes);
        let bodyDocumentosInconsistentes = agregarValoresDinamicos(
          plantillaDocumentosInconsistentes.valor,
          llavesAReemplazarGenericas,
          datosDinamicos
        );

        api.sendEmail({
          to: 'ppalacios@soaint.com',
          subject: plantillaDocumentosInconsistentes.asuntoNotificacion,
          body: bodyDocumentosInconsistentes
        });
        break;
      case '3CD0ED61-F26B-4CC0-9015-5B497673D275': //'Aprobado validador de documentos'
        //let plantillaAprobacion = '';
        break;
      default:
        break;
    }
  }
};
