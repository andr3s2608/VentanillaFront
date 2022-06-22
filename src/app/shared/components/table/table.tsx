import {
  CheckOutlined,
  ConsoleSqlOutlined,
  EyeOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { IRoles } from 'app/inhumacioncremacion/Models/IRoles';
import { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import Form, { FormInstance } from 'antd/es/form';
import { store } from 'app/redux/app.reducers';
import { Alert, Button, Modal, Upload } from 'antd';
import { useHistory } from 'react-router';
import Input from 'antd/es/input';
import Table from 'antd/es/table';
import moment from 'moment';

export const Gridview = (props: IDataSource) => {
  const history = useHistory();
  const { data } = props;
  const [isVisibleDocumentoGestion, setVisibleDocumentoGestion] = useState<boolean>(false);
  const [tipoSolicitud, setTipoSolicitud] = useState<string>('default-tiposolicitud');
  const [listadoDocumento, setListadoDocumento] = useState<Array<Document>>([]);
  const [observacion, setObservacion] = useState<string>('default');
  const { accountIdentifier } = authProvider.getAccount();
  const [Validacion, setValidacion] = useState<string>('0');
  const [roles, setroles] = useState<IRoles[]>([]);

  const api = new ApiService(accountIdentifier);
  const Paginas: number = 10;

  const getListas = useCallback(
    async () => {
      const mysRoles = await api.GetRoles();
      setroles(mysRoles);
      setValidacion('1');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
  }, []);

  const [Tipo] = roles;

  var nombre: any;
  var apellido: any;
  var nombres: any;
  var apellidos: any;
  var identify: string;
  var tipotramite: any;
  var Filterfuneraria: string;
  var FilterDoc: string;
  var FilterId: string;
  var FilterEstado: string;

  var Filterfuneraria: string;
  var FilterDoc: string;
  var FilterId: string;
  var FilterEstado: string;

  const Renovar = (datos: any) => {
    if (data.length == 0) {
    } else {
      if (datos == undefined) {
        datos = data;
      }

      if (Tipo.rol == 'Ciudadano') {
        identify = datos.reduce((result: any, item: { nroIdentificacionFallecido: any }) => {
          return `${result}${item.nroIdentificacionFallecido}|`;
        }, '');
        tipotramite = datos.reduce((result: any, item: { tramite: any }) => {
          return `${result}${item.tramite}|`;
        }, '');
      } else {
        const { persona } = datos;

        identify = '';

        for (let index = 0; index < datos.length; index++) {
          identify = identify + datos[index].persona[0].numeroIdentificacion + '|';
        }

        // identify = datos.reduce((result: any, item: { persona: { numeroIdentificacion: any }[] }) => {
        // return `${result}${item['persona']['numeroIdentificacion']}|`;
        // }, '');

        tipotramite = datos.reduce((result: any, item: { idTramite: any }) => {
          return `${result}${item.idTramite}|`;
        }, '');
      }
    }
  };

  if (Validacion == '1') {
    Renovar(undefined);
  }

  var structureColumns;

  const tiposolicitud = () => {
    if (Tipo.rol !== 'Ciudadano') {
      const posicioninicial = 0;
      var idTramite = tipotramite.substring(posicioninicial, tipotramite.indexOf('|'));
      tipotramite = tipotramite.substring(tipotramite.indexOf('|') + 1, tipotramite.length);
      var valor = '';

      switch (idTramite) {
        case 'a289c362-e576-4962-962b-1c208afa0273':
          valor = 'Inhumación Indivual';

          break;
        case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
          //inhumacion fetal
          valor = 'Inhumación Fetal';

          break;
        case 'e69bda86-2572-45db-90dc-b40be14fe020':
          //cremacion individual
          valor = 'Cremación Individual';

          break;
        case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
          //cremacionfetal
          valor = 'Cremación Fetal ';

          break;
      }
      return valor;
    } else {
      const posicioninicial = 0;
      var idTramite = tipotramite.substring(posicioninicial, tipotramite.indexOf('|'));
      tipotramite = tipotramite.substring(tipotramite.indexOf('|') + 1, tipotramite.length);
      return idTramite;
    }
  };

  if (Validacion == '1') {
    if (Tipo.rol !== 'Ciudadano') {
      structureColumns = [
        {
          title: 'Id Tramite',
          dataIndex: 'iD_Control_Tramite',
          key: 'idTramite'
        },
        {
          title: 'Documento del Fallecido',
          dataIndex: 'noIdentificacionSolicitante',
          key: 'numeroDocumento'
        },
        {
          title: 'Funeraria y/o Nombre',
          dataIndex: 'razonSocialSolicitante',
          key: 'nombreCompleto'
        },

        {
          title: 'Fecha de Registro',
          dataIndex: 'fechaSolicitud',
          key: 'fechaSolicitud'
        },
        {
          title: 'Estado Tramite',
          dataIndex: '',
          key: 'estado',
          render: (Text: string) => (
            <Form.Item label='' name=''>
              <text>{tramite}</text>
            </Form.Item>
          )
        },
        {
          title: 'Tipo Solicitud',
          dataIndex: 'tramite',
          key: 'tipoSolicitud',
          render: (Text: string) => (
            <Form.Item label='' name=''>
              <text>{tiposolicitud()}</text>
            </Form.Item>
          )
        },

        {
          title: 'Validar Tramite',
          key: 'Acciones',

          render: (_: any, row: any, index: any) => {
            const [permiso] = roles;

            return permiso.rol !== 'Ciudadano' ? (
              <>
                <Button
                  type='primary'
                  key={`vali-${index}`}
                  onClick={() => onClickValidarInformacion(row)}
                  style={{ marginLeft: '5px' }}
                  icon={<CheckOutlined />}
                >
                  Validar Información
                </Button>
              </>
            ) : null;
          }
        }
      ];
    } else {
      structureColumns = [
        {
          title: 'Id Tramite',
          dataIndex: 'iD_Control_Tramite',
          key: 'idTramite'
        },
        {
          title: 'Documento del Fallecido',
          dataIndex: 'nroIdentificacionFallecido',
          key: 'numeroDocumento'
        },
        {
          title: 'Funeraria y/o Nombre',
          dataIndex: 'razonSocialSolicitante',
          key: 'nombreCompleto'
        },
        {
          title: 'Fecha de Registro',
          dataIndex: 'fechaSolicitud',
          key: 'fechaSolicitud'
        },
        {
          title: 'Estado Tramite',
          dataIndex: '',
          key: 'estado',
          render: (row: any) => {
            return row.solicitud == 'Registro Usuario Externo' ? (
              <Form.Item label='' name=''>
                <text>{tramite}</text>
              </Form.Item>
            ) : (
              <Form.Item label='' name=''>
                <text>{row.solicitud}</text>
              </Form.Item>
            );
          }
        },
        {
          title: 'Tipo Solicitud',
          dataIndex: 'tramite',
          key: 'tipoSolicitud',
          render: (Text: string) => (
            <Form.Item label='' name=''>
              <text>{tiposolicitud()}</text>
            </Form.Item>
          )
        },
        {
          title: 'Gestión',
          key: 'Acciones',
          render: (_: any, row: any, index: any) => {
            if (row.solicitud == 'Documentos Inconsistentes') {
              return (
                <Button
                  type='primary'
                  style={{ marginLeft: '5px' }}
                  icon={<CheckOutlined />}
                  onClick={() => onGestionarDocumento(row)}
                >
                  Gestionar
                </Button>
              );
            } else {
              return null;
            }
          }
        }
      ];
    }
  }

  let tramite = 'En tramite';

  const onClickValidarInformacion = async ({ idSolicitud }: { [x: string]: string }) => {
    const data = await api.getLicencia(idSolicitud);

    localStorage.setItem('register', JSON.stringify(data));
    store.dispatch(SetResetViewLicence());
    history.push('/tramites-servicios/licencia/gestion-inhumacion');
  };

  const getNamesAndBlobForm = (values: any, tipoSolitudIN: string) => {
    let { CD, DM, OD, ANFI, DFALL, ACF, DFAMI, AFC, OML } = values;
    const Objs = [];

    /*if (tipoSolitudIN == 'Cremacion Fetal' || tipoSolitudIN == 'Inhumacion Fetal') {
      DFALL = DM;
    }*/

    Objs.push({ file: CD, name: 'Certificado_Defuncion' });
    Objs.push({ file: DM, name: 'Documento_de_la_Madre' });
    Objs.push({ file: OD, name: 'Otros_Documentos' });
    Objs.push({ file: ANFI, name: 'Acta_Notarial_del_Fiscal' });
    Objs.push({ file: DFALL, name: 'Documento_del_fallecido' });
    Objs.push({ file: ACF, name: 'Autorizacion_de_cremacion_del_familiar' });
    Objs.push({ file: DFAMI, name: 'Documento_del_familiar' });
    Objs.push({ file: AFC, name: 'Autorizacion_del_fiscal_para_cremar' });
    Objs.push({ file: OML, name: 'Oficio_de_medicina_legal_al_fiscal_para_cremar' });

    const filesLoaded = Objs.filter((item: { file: any; name: string }) => item.file !== undefined);
    const files: Blob[] = filesLoaded.map((item) => {
      const [file] = item.file;
      return file.originFileObj;
    });
    const names: string[] = filesLoaded.map((item) => item.name);

    return [files, names];
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  /** Evento que se ejecuta cuando se da click en el boton de gestionar */
  const onGestionarDocumento = async (solicitud: Solicitud) => {
    const resultResponse: Array<Document> = await api.getDocumentosRechazados(solicitud.idSolicitud);

    setObservacion(resultResponse[0].observaciones);
    setTipoSolicitud(solicitud.tramite);
    setListadoDocumento(resultResponse);
    setVisibleDocumentoGestion(true);
  };

  /** Evento que se ejecuta cuando se da click en guardar los cambios */
  const SubmitDocuments = async (form: any, dataComponentUpdate: DataComponentUpdate) => {
    const { tipoSolicitud, listDocument } = dataComponentUpdate;
    const [accountIdentifierSession] = listDocument[0].path.split('/');
    const formData = new FormData();
    let container = null;

    console.log('======= el id de esta solicitud es =======');
    console.log(listDocument[0].idSolicitud);
    /**De acuerdo al tipo de solicitud se asigna el nombre del contenedor de Azure Storage Blob
     * al que se debe enviar los archivos
     */
    switch (tipoSolicitud) {
      case 'Inhumacion Individual':
        container = 'inhumacionindividual';
        break;
      case 'Cremacion Individual':
        container = 'cremacionindividual';
        break;
      case 'Cremacion Fetal':
        container = 'cremacionfetal';
        break;
      case 'Inhumacion Fetal':
        container = 'inhumacionfetal';
        break;
    }

    /** Se verifica que se encontró un contenedor donde almacenar los documentos */
    if (container) {
      console.log('Se encontró un contenedor donde almacenar, los datos pertenecen a un contenedor de: ', container);
      formData.append('containerName', container);
      formData.append('oid', accountIdentifierSession);

      const [files, names] = getNamesAndBlobForm(form, tipoSolicitud);
      const supportDocumentsEdit: any[] = [];

      /** Se itera por cada archivo subido por el cliente y se hace mapeo entre el blob y el nombre
       *  que debe tener el archivo
       */
      files.forEach((item: any, i: number) => {
        const name: string = names[i] + '';
        for (let j = 0; j < listDocument.length; j++) {
          if (listDocument[j].path.includes(name)) {
            const [, nameFile] = listDocument[j].path.split('/');
            formData.append('file', item);
            formData.append('nameFile', nameFile);
            console.log('El mapeo de nombre y archivo es el siguiente:');
            console.log(nameFile, item);

            supportDocumentsEdit.push({
              idDocumentoSoporte: listDocument[j].idDocumentoSoporte,
              fechaModificacion: new Date()
            });
          }
        }
      });

      console.log('======= la fecha de este host es =======');
      console.log(new Date());
      console.log('============= form data ===========');
      console.log(formData.values());
      console.log('=========== suppor document ======0');
      console.log(supportDocumentsEdit);
      /** Verifica que hay archivos ha subir  y a su vez sirve para validar que se agregue la meta data a cada
       *  uno de los archivos y se mandan a base de datos
       * */
      if (supportDocumentsEdit.length) {
        console.log('se mando a servidor');
        await api.uploadFiles(formData);
        await api.UpdateSupportDocuments(supportDocumentsEdit);
      }
    }
  };

  /** Componente de función que se usa para la gestionar la actualización de documentos inconsistente*/
  function ComponentUpdateDocument(props: DataComponentUpdate) {
    function GUIDtoString(cadena: string) {
      switch (cadena) {
        /** GUID que corresponde a Certificado de defunción */
        case '19a11490-261c-4114-9152-23c2b991cb36':
          return 'CD';

        /** GUID que corresponde al Documento de la madre */
        case 'd2d3aba7-3b92-446a-aa8c-80a75de246a7':
          return 'DM';

        /** GUID que corresponde a Otros Documentos */
        case 'abe33c1d-9370-4189-9e81-597e5b643481':
          return 'OD';

        /** GUID que corresponde al Acta Notarial del Fiscal */
        case '79320af6-943c-43bf-87d1-847b625f6203':
          return 'ANFI';

        /** GUID que corresponde al Documento del fallecido */
        case '9c4e62a4-ee76-4ba1-8dbe-8be172e23788':
          return 'DFALL';

        /** GUID que corresponde a Autorización de Cremación del familiar */
        case 'f67f1c4e-a6a5-4257-a995-17a926801f7c':
          return 'ACF';

        /** GUID que corresponde al Documento del familiar */
        case 'd6524742-e32d-4548-ab21-7a9cbb367926':
          return 'DFAMI';

        /** GUID que corresponde a Autorización del fiscal para cremar */
        case 'c659a063-e8a3-4f23-9a61-575afb1e1c2b':
          return 'AFC';

        /** GUID que corresponde a Oficio de Medicinal Legal al fiscal para cremar */
        case '1266f06c-0bc1-4cf8-ba51-5e889d5e8178':
          return 'OML';
      }
      return 'default';
    }

    return (
      <Form className='mb-4 w-100' layout='horizontal' onFinish={(form) => SubmitDocuments(form, props)}>
        {props.listDocument.map((item) => {
          return (
            <Form.Item
              label={item.tipo_documento}
              name={GUIDtoString(item.idTipoDocumento)}
              valuePropName='fileList'
              getValueFromEvent={normFile}
            >
              <Upload
                name={GUIDtoString(item.idTipoDocumento)}
                maxCount={1}
                beforeUpload={() => false}
                listType='text'
                accept='application/pdf'
              >
                <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
              </Upload>
            </Form.Item>
          );
        })}

        <Button style={{ margin: 10 }} type='primary' htmlType='submit' onClick={() => setVisibleDocumentoGestion(false)}>
          Guardar
        </Button>
      </Form>
    );
  }

  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body'>
          <div className='row'>
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <Table id='tableGen' dataSource={data} columns={structureColumns} pagination={{ pageSize: Paginas }} />
            </div>
          </div>
          <div className='row'>
            {/** Modal que se despliega cuando se quiere gestionar una solicitud por parte del ciudadano */}
            <Modal
              title={<p className='text-center'>Gestión de Documentos</p>}
              visible={isVisibleDocumentoGestion}
              width={800}
              onCancel={() => setVisibleDocumentoGestion(false)}
              footer={[]}
            >
              <div className='row'>
                <div className='col-gl-12 col-sm-12 col-md-12'>
                  <label>Observaciones:</label>
                  <Input.TextArea defaultValue='default' value={observacion} rows={5} disabled={true} />
                </div>
              </div>
              <div className='row  justify-content-md-center'>
                <label>Lista de documentos:</label>
                <div className='col-lg-12 col-sm-12 col-md-12'>
                  <ComponentUpdateDocument listDocument={listadoDocumento} tipoSolicitud={tipoSolicitud} />
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Solicitud {
  estadoSolicitud: string;
  fechaSolicitud: string;
  iD_Control_Tramite: string;
  idSolicitud: string;
  noIdentificacionSolicitante: string;
  nroIdentificacionFallecido: string;
  numeroCertificado: string;
  razonSocialSolicitante: string;
  solicitud: string;
  tramite: string;
}

interface Document {
  idTipoDocumento: string;
  estado_Documento: string;
  fecha_registro: string;
  fecha_ultima_modificacion: string;
  idDocumentoSoporte: string;
  idEstadoDocumento: string;
  idSolicitud: string;
  observaciones: string;
  path: string;
  tipoSeguimiento: string;
  tipoSeguimientoDescripcion: string;
  tipo_documento: string;
}

interface DataComponentUpdate {
  tipoSolicitud: string;
  listDocument: Array<Document>;
}

interface IDataSource {
  data: Array<any>;
}
