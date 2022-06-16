import { CheckOutlined, EyeOutlined, FilePdfOutlined, FileTextOutlined, UploadOutlined } from '@ant-design/icons';
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
  const [observacion, setObservacion] = useState<string>('default');
  const [tipoSolicitud, setTipoSolicitud] = useState<string>('default-tiposolicitud');
  const [listadoDocumento, setListadoDocumento] = useState<Array<Document>>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { accountIdentifier } = authProvider.getAccount();
  const [Validacion, setValidacion] = useState<string>('0');
  const [solicitud, setSolicitud] = useState<any[]>([]);
  const [roles, setroles] = useState<IRoles[]>([]);
  const api = new ApiService(accountIdentifier);
  const [dataTable, setDataTable] = useState<[]>();
  const formatDate = 'MM-DD-YYYY';
  var isFilter: boolean = false;
  const filterValue: Array<any> = [];
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

    /**De acuerdo al tipo de solicitud se asigna el nombre del contenedor de Azure Storage Blob
     * al que se debe enviar los archivos
     */
    switch (tipoSolicitud) {
      case 'dsfsd':
        container = '';
        break;
      case 'sdfs':
        container = '';
        break;
      case 'sdfsdf':
        container = '';
        break;
      case 'aldf':
        container = 'sd';
        break;
    }

    /** Se verifica que se encontró un contenedor donde almacenar los documentos */
    if (container) {
      console.log('Se encontró un contenedor donde almacenar');
      formData.append('containerName', container);
      formData.append('oid', accountIdentifierSession);

      const [files, names] = generateListFiles(form);
      const supportDocumentsEdit: any[] = [];

      files.forEach((item: any, i: number) => {
        const name = names[i];

        formData.append('file', item);
        formData.append('nameFile', name);
        console.log(item);
        console.log(name);
      });

      if (supportDocumentsEdit.length) {
        await api.uploadFiles(formData);
        await api.UpdateSupportDocuments(supportDocumentsEdit);
      }
    }
  };

  /** Componente de función que se usa para la gestionar la actualización de documentos inconsistente*/
  function ComponentUpdateDocument(props: DataComponentUpdate) {
    return (
      <Form className='mb-4 w-100' layout='horizontal' onFinish={(form) => SubmitDocuments(form, props)}>
        {props.listDocument.map((item) => {
          return (
            <Form.Item
              label={item.tipo_documento}
              name={item.tipo_documento.replace(/\s+/g, '')}
              valuePropName='fileList'
              getValueFromEvent={normFile}
            >
              <Upload
                name={item.tipo_documento.replace(/\s+/g, '')}
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

        <Button style={{ margin: 10 }} type='primary' htmlType='submit'>
          Guardar
        </Button>
      </Form>
    );
  }

  return (
    <div className='card card-body py-5 mb-4 fadeInTop'>
      <div className='d-lg-flex align-items-start'>
        <Table id='tableGen' dataSource={data} columns={structureColumns} pagination={{ pageSize: Paginas }} />
      </div>

      {/** Modal que se despliega cuando se quiere gestionar una solicitud por parte del ciudadano */}
      <Modal
        title={<p className='text-center'>Gestión de Documentos</p>}
        visible={isVisibleDocumentoGestion}
        width={800}
        onCancel={() => setVisibleDocumentoGestion(false)}
        footer={[]}
      >
        <div className='conteiner-fluid'>
          <div className='row'>
            <strong>Observaciones:</strong>
            <Input.TextArea defaultValue='default' value={observacion} rows={5} disabled={true} />
          </div>
          <div className='row justify-content-md-center'>
            <hr />
            <strong>Lista de documentos:</strong>
            <ComponentUpdateDocument listDocument={listadoDocumento} tipoSolicitud={tipoSolicitud} />
          </div>
        </div>
      </Modal>
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
