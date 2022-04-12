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
import { store } from 'app/redux/app.reducers';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';

import { IGestionTramite } from 'app/Models/IGestion';
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
  const [isModalVisiblePdf, setIsModalVisiblePdf] = useState(false);
  const [nameUser, setNameUser] = useState<any>('');
  const [urlPdfLicence, setUrlPdfLicence] = useState<any>('');
  const [viewLicenceState, setViewLicenceState] = useState<any>();
  const { Step } = Steps;
  const [dataTable, setDataTable] = useState<[]>();
  const [datos, setdatos] = useState<[]>();
  const history = useHistory();
  const { tipoLicencia, tramite } = props;
  const [form] = Form.useForm<any>();
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [user, setUser] = useState<any>();
  const [supports, setSupports] = useState<any[]>([]);
  const [type, setType] = useState<[]>([]);
  const objJosn: any = EditInhumacion('1');
  const edit = objJosn?.idTramite ? true : false;
  //form.setFieldsValue(objJosn?);
  //#region Listados

  const formatDate = 'MM-DD-YYYY';
  const [[l_paises, l_tipos_documento, l_estado_civil, l_nivel_educativo, l_etnia, l_regimen, l_tipo_muerte], setListas] =
    useState<IDominio[][]>([]);

  store.subscribe(() => {
    const { viewLicence } = store.getState();
    setViewLicenceState(viewLicence);
  });

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
    store.dispatch(SetResetViewLicence());
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
    let solicitud = await api.GetSolicitud(objJosn?.idSolicitud);
    let resumenSolicitud = await api.GetResumenSolicitud(objJosn?.idSolicitud /*'ACF323FE-181C-4039-876D-07695F363C3C'*/);
    //let solicitud = await api.GetSolicitud('69EF7A4C-CE0F-43AD-9D3E-E679204E0F0D');

    let funeraria = await api.GetFunerariasAzure(objJosn?.idSolicitud /*'593E8100-80D2-4CC4-9286-06229E3811BA'*/);
    console.log(funeraria, 'funerariaaaaa');
    console.log(funeraria[0]['funeraria']);

    let fechaSolicitud: string = solicitud[0]['fechaSolicitud'];
    let idTramite = objJosn?.idTramite;
    let cementerio = solicitud[0]['datosCementerio']['cementerio'];
    let date = new Date();
    let emailSolicitante = resumenSolicitud[0]['correoSolicitante'];

    console.log(solicitud, 'solicitud');
    console.log(resumenSolicitud[0]['correoSolicitante'], 'resumen solicitud');

    if (tipoSeguimiento.toLocaleUpperCase() == '3CD0ED61-F26B-4CC0-9015-5B497673D275') {
      //alert('aprobacion');
      console.log('-----------------------------------------');
      console.log(solicitud[0]['datosCementerio']['cementerio']);
      console.log(solicitud[0]['fechaSolicitud']);
      console.log('-----------------------------------------');
      let codeUser = await api.getCodeUser();
      let nameUser = await api.GetInformationUser(codeUser);
      console.log(' tu dato: ' + codeUser);
      console.log(' tu dato: ' + nameUser.fullName.toLocaleUpperCase());

      let linkPDF = api.getLinkPDFNotificacion(objJosn?.idSolicitud, nameUser.fullName.toLocaleUpperCase());

      //window.open(linkPDF, 'hola mundo');

      let datosDinamicosAprobacion = [
        objJosn?.name + ' ' + objJosn?.secondName + ' ' + objJosn?.surname + ' ' + objJosn.secondSurname,
        getDescripcionTramite(idTramite.toLocaleUpperCase()),
        fechaSolicitud.substring(0, 10),
        getDescripcionTramite(idTramite.toLocaleUpperCase()),
        linkPDF
      ];

      let emailCementerio = resumenSolicitud[0]['correoCementerio'];
      let datosDinamicosCementerio = [
        cementerio,
        resumenSolicitud[0]['numeroLicencia'],
        date.toLocaleDateString(),
        getDescripcionTramite(idTramite.toLocaleUpperCase()),
        getDescripcionTramite(idTramite.toLocaleUpperCase()),
        linkPDF
      ];

      let emailFuneraria = resumenSolicitud[0]['correoFuneraria'];
      let datosDinamicosFuneraria = [
        funeraria[0]['funeraria'],
        resumenSolicitud[0]['numeroLicencia'],
        date.toLocaleDateString(),
        getDescripcionTramite(idTramite.toLocaleUpperCase()),
        getDescripcionTramite(idTramite.toLocaleUpperCase()),
        linkPDF
      ];

      notificar(values.validFunctionaltype, datosDinamicosAprobacion, emailSolicitante);
      notificarCementerio(datosDinamicosCementerio, emailCementerio);
      notificarFuneraria(datosDinamicosFuneraria, emailFuneraria);
      //notificarCementerioYFuneraria(datosDinamicosCementerio, datosDinamicosFuneraria, emailCementerio, emailFuneraria);
    } else {
      /*let datosDinamicos = {
        ciudadano: objJosn?.name + ' ' + objJosn?.secondName + ' ' + objJosn?.surname + ' ' + objJosn.secondSurname,
        tipo_de_solicitud: getDescripcionTramite(idTramite.toLocaleUpperCase()),
        numero_de_solicitud: objJosn?.idSolicitud,
        fecha_de_solicitud: fechaSolicitud.substring(0, 10),
        observacion: values.Observations
      };*/
      let datosDinamicosGenericos = [
        objJosn?.name + ' ' + objJosn?.secondName + ' ' + objJosn?.surname + ' ' + objJosn.secondSurname,
        getDescripcionTramite(idTramite.toLocaleUpperCase()),
        fechaSolicitud.substring(0, 10),
        values.observations
      ];

      notificar(values.validFunctionaltype, datosDinamicosGenericos, emailSolicitante);
    }

    setStatus(undefined);
    const idPersonaVentanilla = localStorage.getItem(accountIdentifier);
    const formatDate = 'MM-DD-YYYY';
    const estadoSolicitud = 'fdcea488-2ea7-4485-b706-a2b96a86ffdf'; //estado?.estadoSolicitud;

    //let documentos = await api.getSupportDocuments(objJosn?.idSolicitud);
    let documentos = await api.getSupportDocuments(objJosn?.idSolicitud);
    var iddocumento: string = documentos.reduce((result: any, item: any) => {
      return `${result}${item.idDocumentoSoporte}|`;
    }, '');
    var pathdocumento: string = documentos.reduce((result: any, item: any) => {
      return `${result}${item.path}|`;
    }, '');

    var valor: any[] = [];

    var not = 1;

    const segui = values.validFunctionaltype;

    if (segui == '3cd0ed61-f26b-4cc0-9015-5b497673d275') {
      //const update = await api.updatelicencia(objJosn?.idSolicitud);
    }

    for (let index = 0; index < documentos.length; index++) {
      var posicioninicialid = 0;
      var posicionfinalid = iddocumento.indexOf('|');
      var id = iddocumento.substring(posicioninicialid, posicionfinalid);
      var iddocumento = iddocumento.substring(posicionfinalid + 1, iddocumento.length);

      var posicioninicialpath = 0;
      var posicionfinalpath = pathdocumento.indexOf('/');
      var nuevopath = pathdocumento.indexOf('|');
      var documento = pathdocumento.substring(posicioninicialpath, posicionfinalpath);
      var pathdocumento = pathdocumento.substring(nuevopath + 1, pathdocumento.length);

      var datos: string = datosprueba.at(index);
      if (datos == '1') {
        datos = 'Cumple';
      } else {
        datos = 'No Cumple';
      }

      console.log('Seguimiento', values.validFunctionaltype);
      const json: IGestionTramite<any> = {
        estado: {
          idSolicitud: objJosn?.idSolicitud,
          idDocumentoSoporte: id,
          Path: documento,
          Estado_Documento: datos,
          tipoSeguimiento: values.validFunctionaltype,
          Observaciones: values.observations
        }
      };

      const resp = await api.AddGestion(json, not + '');
    }

    history.push('/tramites-servicios');

    store.dispatch(SetResetViewLicence());
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  var datosprueba: any[] = ['1', '1', '1', '1', '1'];

  const getData = (rowData: any) => {
    datosprueba = rowData;
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

  const onSubmitFailed = () => {
    setStatus('error');
    store.dispatch(SetResetViewLicence());
  };

  //#region Eventos formulario
  const getStatus = (estado: string) => {
    var opciones = '';
    switch (estado.toUpperCase()) {
      case '3CD0ED61-F26B-4CC0-9015-5B497673D275':
        opciones = 'Aprobado validador de documentos';
        //inhumacion indivual
        //history.push('/tramites-servicios/licencia/inhumacion-individual');
        break;
      case 'FDCEA488-2EA7-4485-B706-A2B96A86FFDF':
        opciones = 'Registro de Tramite Usuario Externo';
        //inhumacion fetal
        return 'Registro de Tramite Usuario Externo';
        //history.push('/tramites-servicios/licencia/inhumacion-fetal');
        break;
      case 'FA183116-BE8A-425F-A309-E2032221553F':
        //cremacion individual
        opciones = 'Negado validador de documentos';
        // history.push('/tramites-servicios/licencia/cremacion-individual');
        break;
      case 'FE691637-BE8A-425F-A309-E2032221553F':
        //cremacionfetal
        opciones = 'Documentos Inconsistentes';
        //history.push('/tramites-servicios/licencia/cremacion-fetal');
        break;
    }

    return opciones;
  };

  const onClickView = async (idSolicitud: string) => {
    const all = await api.getLicencia(idSolicitud);

    const alldata = all.map((item: any) => {
      item.fechaRegistro = moment(item.fechaRegistro).format(formatDate);
      item.primerNombre = item.persona[0].primerNombre + ' ' + item.persona[0].segundoNombre;
      item.primerApellido = item.persona[0].primerApellido + ' ' + item.persona[0].segundoApellido;
      item.estadoNuevo = getStatus(item.estadoSolicitud);
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

  const colorEstado = (estado: string) => {
    switch (estado) {
      case 'Aprobado validador de documentos':
        return (
          <p className={'estado'} style={{ color: 'green' }}>
            {estado}
          </p>
        );
      case 'Registro de Tramite Usuario Externo':
        return (
          <p className={'estado'} style={{ color: 'green' }}>
            {estado}
          </p>
        );
        break;
      case 'Negado validador de documentos':
        return (
          <p className={'estado'} style={{ color: 'red' }}>
            {estado}
          </p>
        );
        break;
      case 'Documentos Inconsistentes':
        return (
          <p className={'estado'} style={{ color: 'red' }}>
            {estado}
          </p>
        );
        break;
    }
  };
  const columnFake = [
    {
      title: 'Nombres',
      dataIndex: 'primerNombre',
      key: 'primerNombre'
    },

    {
      title: 'Apellidos',
      dataIndex: 'primerApellido',
      key: 'primerApellido'
    },
    {
      title: 'Fecha de registro',
      dataIndex: 'fechaRegistro',
      key: 'fechaRegistro'
    },
    {
      title: 'Estado',
      dataIndex: 'estadoNuevo',
      key: 'estadoNuevo',
      render: (estado: string) => <> {colorEstado(estado)}</>
    },

    {
      title: 'Observación',
      dataIndex: '',
      key: ''
    }
  ];

  const onPrevPDF = async () => {
    const codeUser = await api.getCodeUser();
    const nameUser = await api.GetInformationUser(codeUser);
    const idSolicitud = objJosn?.idSolicitud;

    let linkPdf = await api.getLinkPDF(idSolicitud, nameUser.fullName);
    console.log('La url de la licencia es: ');
    console.log(linkPdf);

    setUrlPdfLicence(linkPdf);
    setNameUser(nameUser);
    setIsModalVisiblePdf(true);
  };

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
            <InformacionDocumentosGestion prop={getData} obj={objJosn} id={objJosn?.idSolicitud} />

            <div className='fadeInLeft'>
              <div className='container-fluid'>
                <div className='col-lg-12'>
                  <Form.Item>
                    <Button
                      style={{ width: '50%' }}
                      type='primary'
                      onClick={() => onClickView(objJosn?.idSolicitud)}
                      icon={<EyeOutlined width={100} />}
                      size={'large'}
                    >
                      Seguimiento
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      style={{ width: '50%', float: 'right', marginTop: '-63px', marginRight: '-100px' }}
                      type='primary'
                      onClick={() => onPrevPDF()}
                      icon={<EyeOutlined width={100} />}
                      size={'large'}
                      disabled={viewLicenceState}
                    >
                      Vista previa licencia
                    </Button>
                  </Form.Item>
                </div>
              </div>

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

              <Modal
                title={
                  <p className='text-center text-dark text-uppercase mb-0 titulo modal-dialog-scrollable'>
                    Visualización de la licencia
                  </p>
                }
                visible={isModalVisiblePdf}
                onCancel={() => setIsModalVisiblePdf(false)}
                width={1000}
                okButtonProps={{ hidden: true }}
                cancelText='Cerrar'
              >
                <div className='col-lg-12 text-center'>
                  <p>Nombre del tramitador : {nameUser.fullName} </p>
                </div>
                <iframe src={urlPdfLicence} frameBorder='0' scrolling='auto' height='600vh' width='100%'></iframe>
              </Modal>
            </div>
            <div>
              <Actions />
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
  /*
  <List
    grid={{ gutter: 24, column: 2 }}
    dataSource={Lista}
    renderItem={(item) => (
      <List.Item>
        <List.Item.Meta title={item.title} description={item.describe} />
      </List.Item>
    )}
  />;
*/
  function agregarValoresDinamicos(HTML: string, llavesAReemplazar: string[], valoresDinamicos: string[]): string {
    let nuevoHTML = HTML;

    for (let index = 0; index < llavesAReemplazar.length; index++) {
      nuevoHTML = nuevoHTML.replace(llavesAReemplazar[index], valoresDinamicos[index]);
    }

    return nuevoHTML;
  }

  async function notificarCementerio(datosDinamicosCementerio: any, emailCementerio: string) {
    const { accountIdentifier } = authProvider.getAccount();
    const api = new ApiService(accountIdentifier);

    const llavesAReemplazarCementerio = [
      '~:~nombre~:~',
      '~:~número_de_licencia~:~',
      '~:~fecha_de_expedición~:~',
      '~:~tipo_de_trámite~:~',
      '~:~tipo_de_licencia~:~',
      '~:~link_pdf~:~'
    ];

    const idPlantillaCementerio = '7ECC05F8-E5C0-4F8D-997B-2AE5A7E0059C';

    let plantillaCementerio = await api.getFormato(idPlantillaCementerio);
    let bodyCementerio = agregarValoresDinamicos(
      plantillaCementerio.valor,
      llavesAReemplazarCementerio,
      datosDinamicosCementerio
    );

    api.sendEmail({
      to: emailCementerio,
      subject: 'Notificación cementerio',
      body: bodyCementerio
    });
  }

  async function notificarFuneraria(datosDinamicosFuneraria: any, emailFuneraria: string) {
    const { accountIdentifier } = authProvider.getAccount();
    const api = new ApiService(accountIdentifier);

    const llavesAReemplazarFuneraria = [
      '~:~nombre~:~',
      '~:~número_de_licencia~:~',
      '~:~fecha_de_expedición~:~',
      '~:~tipo_de_trámite~:~',
      '~:~tipo_de_licencia~:~',
      '~:~link_pdf~:~'
    ];

    const idPlantillaFuneraria = '7ECC05F8-E5C0-4F8D-997B-2AE5A7E0059C';

    let plantillaFuneraria = await api.getFormato(idPlantillaFuneraria);
    let bodyFuneraria = agregarValoresDinamicos(plantillaFuneraria.valor, llavesAReemplazarFuneraria, datosDinamicosFuneraria);

    api.sendEmail({
      to: emailFuneraria,
      subject: 'Notificación funeraria',
      body: bodyFuneraria
    });
  }

  /*async function notificarCementerioYFuneraria(
    datosDinamicosCementerio: any,
    datosDinamicosFuneraria: any,
    emailCementerio: string,
    emailFuneraria: string
  ) {
    const { accountIdentifier } = authProvider.getAccount();
    const api = new ApiService(accountIdentifier);

    const llavesAReemplazarCementerioYFuneraria = [
      '~:~nombre~:~',
      '~:~número_de_licencia~:~',
      '~:~fecha_de_expedición~:~',
      '~:~tipo_de_trámite~:~',
      '~:~tipo_de_licencia~:~',
      '~:~link_pdf~:~'
    ];

    const idPlantillaCementerioYFuneraria = '7ECC05F8-E5C0-4F8D-997B-2AE5A7E0059C';

    let plantillaCementerio = await api.getFormato(idPlantillaCementerioYFuneraria);
    let bodyCementerio = agregarValoresDinamicos(
      plantillaCementerio.valor,
      llavesAReemplazarCementerioYFuneraria,
      datosDinamicosCementerio
    );

    let plantillaFuneraria = await api.getFormato(idPlantillaCementerioYFuneraria);
    let bodyFuneraria = agregarValoresDinamicos(
      plantillaFuneraria.valor,
      llavesAReemplazarCementerioYFuneraria,
      datosDinamicosFuneraria
    );

    api.sendEmail({
      to: emailCementerio,
      subject: 'Notificación cementerio',
      body: bodyCementerio
    });

    api.sendEmail({
      to: emailFuneraria,
      subject: 'Notificación funeraria',
      body: bodyFuneraria
    });
  }*/

  async function notificar(tipoSeguimiento: string, datosDinamicos: any, emailSolicitante: string) {
    const { accountIdentifier } = authProvider.getAccount();
    const api = new ApiService(accountIdentifier);

    const llavesAReemplazarGenericas = [
      '~:~ciudadano~:~',
      '~:~tipo_de_solicitud~:~',
      '~:~fecha_de_solicitud~:~',
      '~:~observación~:~'
    ];

    const llavesAReemplazarAprobacion = [
      '~:~ciudadano~:~',
      '~:~tipo_de_solicitud~:~',
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
          to: emailSolicitante,
          subject: plantillaAnulacion.asuntoNotificacion,
          body: bodyAnulacion
        });
        break;
      case 'FA183116-BE8A-425F-A309-E2032221553F': //'Negado validador de documentos'
        let plantillaNegacion = await api.getFormato(idPlantillaNegacion);
        let bodyNegacion = agregarValoresDinamicos(plantillaNegacion.valor, llavesAReemplazarGenericas, datosDinamicos);

        api.sendEmail({
          to: emailSolicitante,
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
          to: emailSolicitante,
          subject: plantillaDocumentosInconsistentes.asuntoNotificacion,
          body: bodyDocumentosInconsistentes
        });
        break;
      case '3CD0ED61-F26B-4CC0-9015-5B497673D275': //'Aprobado validador de documentos'
        let plantillaAprobacion = await api.getFormato(idPlantillaAprobacion);
        let bodyAprobacion = agregarValoresDinamicos(plantillaAprobacion.valor, llavesAReemplazarAprobacion, datosDinamicos);

        api.sendEmail({
          to: emailSolicitante,
          subject: plantillaAprobacion.asuntoNotificacion,
          body: bodyAprobacion
        });
        break;
      default:
        break;
    }
  }
};
