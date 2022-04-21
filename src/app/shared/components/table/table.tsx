import { Button, Modal } from 'antd';
import Form, { FormInstance } from 'antd/es/form';
import Table from 'antd/es/table';
import { IRoles } from 'app/Models/IRoles';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { useCallback, useEffect, useState } from 'react';
import { columnFake, dataFake } from './model';
import { CheckOutlined, EyeOutlined, FilePdfOutlined, FileTextOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import moment from 'moment';

//redux
import { store } from 'app/redux/app.reducers';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';

interface IDataSource {
  data: Array<any>;
}

export const Gridview = (props: IDataSource) => {
  const history = useHistory();
  const { data } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [solicitud, setSolicitud] = useState<any[]>([]);
  const [roles, setroles] = useState<IRoles[]>([]);
  const [Validacion, setValidacion] = useState<string | undefined>();
  const Paginas: number = 10;
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [dataTable, setDataTable] = useState<[]>();
  const formatDate = 'MM-DD-YYYY';

  const getListas = useCallback(
    async () => {
      const mysRoles = await api.GetRoles();

      setroles(mysRoles);
      setValidacion('1');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  //const getMenu = UpdateMenu();

  useEffect(() => {
    getListas();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [Tipo] = roles;

  var nombre: any;
  var apellido: any;
  var nombres: any;
  var apellidos: any;
  var identify: any;
  var tipotramite: any;
  const Renovar = (datos: any) => {
    if (datos == undefined) {
      datos = data;
    }

    if (Tipo.rol == 'Ciudadano') {
      nombre = datos.reduce((result: any, item: { nombre: any }) => {
        return `${result}${item.nombre}|`;
      }, '');

      apellido = datos.reduce((result: any, item: { apellido: any }) => {
        return `${result}${item.apellido}|`;
      }, '');

      identify = datos.reduce((result: any, item: { nroIdentificacionFallecido: any }) => {
        return `${result}${item.nroIdentificacionFallecido}|`;
      }, '');
      tipotramite = datos.reduce((result: any, item: { tramite: any }) => {
        return `${result}${item.tramite}|`;
      }, '');
    } else {
      nombre = datos.reduce((result: any, item: { persona: { primerNombre: any }[] }) => {
        return `${result}${item.persona[0].primerNombre}|`;
      }, '');

      nombres = datos.reduce((result: any, item: { persona: { segundoNombre: any }[] }) => {
        return `${result}${item.persona[0].segundoNombre}|`;
      }, '');
      apellido = datos.reduce((result: any, item: { persona: { primerApellido: any }[] }) => {
        return `${result}${item.persona[0].primerApellido}|`;
      }, '');
      apellidos = datos.reduce((result: any, item: { persona: { segundoApellido: any }[] }) => {
        return `${result}${item.persona[0].segundoApellido}|`;
      }, '');

      identify = datos.reduce((result: any, item: { persona: { numeroIdentificacion: any }[] }) => {
        return `${result}${item.persona[0].numeroIdentificacion}|`;
      }, '');

      tipotramite = datos.reduce((result: any, item: { idTramite: any }) => {
        return `${result}${item.idTramite}|`;
      }, '');
    }
  };

  if (Validacion == '1') {
    Renovar(undefined);
  }

  const nombrecompleto = () => {
    const posicioninicial = 0;

    if (Tipo.rol == 'Ciudadano') {
      var primernombre = nombre.substring(posicioninicial, nombre.indexOf('|'));
      nombre = nombre.substring(nombre.indexOf('|') + 1, nombre.length);

      var primerapellido = apellido.substring(posicioninicial, apellido.indexOf('|'));
      apellido = apellido.substring(apellido.indexOf('|') + 1, apellido.length);
      var cadena = primernombre + ' ' + primerapellido;

      return cadena;
    } else {
      var primernombre = nombre.substring(posicioninicial, nombre.indexOf('|'));
      nombre = nombre.substring(nombre.indexOf('|') + 1, nombre.length);

      var segundonombre = nombres.substring(posicioninicial, nombres.indexOf('|'));
      nombres = nombres.substring(nombres.indexOf('|') + 1, nombres.length);

      var primerapellido = apellido.substring(posicioninicial, apellido.indexOf('|'));
      apellido = apellido.substring(apellido.indexOf('|') + 1, apellido.length);

      var segundoapellido = apellidos.substring(posicioninicial, apellidos.indexOf('|'));
      apellidos = apellidos.substring(apellidos.indexOf('|') + 1, apellidos.length);

      var cadena = primernombre + ' ' + segundonombre + ' ' + primerapellido + ' ' + segundoapellido;

      return cadena;
    }
  };

  const identificacion = () => {
    const posicioninicial = 0;
    var nroidentificacion = identify.substring(posicioninicial, identify.indexOf('|'));
    identify = identify.substring(identify.indexOf('|') + 1, identify.length);
    return nroidentificacion;
  };
  var structureColumns;

  const tiposolicitud = () => {
    if (Tipo.rol == 'Funcionario') {
      const posicioninicial = 0;
      var idTramite = tipotramite.substring(posicioninicial, tipotramite.indexOf('|'));
      tipotramite = tipotramite.substring(tipotramite.indexOf('|') + 1, tipotramite.length);
      var valor = '';

      switch (idTramite) {
        case 'a289c362-e576-4962-962b-1c208afa0273':
          valor = 'Inhumacion Indivual';

          break;
        case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
          //inhumacion fetal
          valor = 'Inhumacion Fetal';

          break;
        case 'e69bda86-2572-45db-90dc-b40be14fe020':
          //cremacion individual
          valor = 'Cremacion Individual';

          break;
        case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
          //cremacionfetal
          valor = 'Cremacion Fetal ';

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
  const boton = () => {
    if (Tipo.rol == 'Funcionario') {
      structureColumns = [
        {
          title: 'Id Tramite',
          dataIndex: 'iD_Control_Tramite',
          key: 'idTramite'
        },
        {
          title: 'Documento del Fallecido',
          dataIndex: '',
          key: 'numeroDocumento',
          render: (Text: string) => (
            <Form.Item label='' name=''>
              <text>{identificacion()}</text>
            </Form.Item>
          )
        },
        {
          title: 'Nombre Completo',
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

            return permiso.rol === 'Funcionario' ? (
              <>
                <Button
                  type='primary'
                  key={`vali-${index}`}
                  onClick={() => onClickValidarInformacion(row)}
                  style={{ marginLeft: '5px' }}
                  icon={<CheckOutlined />}
                >
                  Validar Informacion
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
          dataIndex: '',
          key: 'numeroDocumento',
          render: (Text: string) => (
            <Form.Item label='' name=''>
              <text>{identificacion()}</text>
            </Form.Item>
          )
        },
        {
          title: 'Nombre Completo',
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
        }
      ];
    }
  };
  if (Validacion == '1') {
    boton();
  }

  const tramite = 'En tramite';
  /*
  render: (Text: string) => (
    <Form.Item label='' name=''>
      <text>{identificacion()}</text>
    </Form.Item>
  );

  render: (Text: string) => (
    <Form.Item label='' name=''>
      <text>{nombrecompleto()}</text>
    </Form.Item>
  );
  */

  const onPrev = ({ idSolicitud, estadoSolicitud }: { [x: string]: string }) => {
    if (estadoSolicitud === '3cd0ed61-f26b-4cc0-9015-5b497673d275') {
      api.GeneratePDF(idSolicitud);
    }
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onClickView = async ({ idSolicitud }: { [x: string]: string }) => {
    const all = await api.getUserTramite(idSolicitud);
    const alldata = all.map((item: any) => {
      item.fechaRegistro = moment(item.fechaRegistro).format(formatDate);
      return item;
    });

    setDataTable(alldata);
    showModal();
  };

  const onClickValidarInformacion = async ({ idSolicitud }: { [x: string]: string }) => {
    const data = await api.getLicencia(idSolicitud);
    const { idTramite } = data[0];

    localStorage.setItem('register', JSON.stringify(data));

    store.dispatch(SetResetViewLicence());

    //history.push('/tramites-servicios/licencia/inhumacion-prueba');
    history.push('/tramites-servicios/licencia/gestion-inhumacion');
  };
  const onPageChange = (pagination: any) => {
    //alert(pagination.current);

    var valor: any = data.at(0);
    var array: any[] = [];
    for (let index = 0; index < data.length; index++) {
      if (index >= (pagination.current - 1) * 10) {
        valor = data.at(index);
        array.push(valor);
      }
    }

    Renovar(array);
  };

  return (
    <div className='card card-body py-5 mb-4 fadeInTop'>
      <div className='d-lg-flex align-items-start'>
        //
        <Table dataSource={data} columns={structureColumns} pagination={{ pageSize: Paginas }} onChange={onPageChange} />
      </div>
    </div>
  );

  /*

const structureColumns = [
    {
      title: 'Tipo Trámite',
      dataIndex: 'tramite',
      key: 'tramite'
    },
    {
      title: 'Fecha Radicación',
      dataIndex: 'fechaSolicitud',
      key: 'fechaSolicitud'
    },
    {
      title: 'Código Solicitud',
      dataIndex: 'idSolicitud',
      key: 'idSolicitud'
    },
    {
      title: 'Número Certificado Defunción',
      dataIndex: 'numeroCertificado',
      key: 'numeroCertificado'
    },
    {
      title: 'Estado',
      dataIndex: 'solicitud',
      key: 'solicitud'
    },
    {
      title: 'PDF',
      dataIndex: 'pdf',
      key: 'pdf',
      render: (_: any, row: any, index: any) => <FilePdfOutlined onClick={() => onPrev(row)} style={{ fontSize: '30px' }} />
    },
    {
      title: 'Acciones',
      key: 'Acciones',

      render: (_: any, row: any, index: any) => {
        const [permiso] = roles;

        return permiso.rol === 'Ciudadano' ? (
          <>
            <Button key={index} type='primary' onClick={() => onClickView(row)} icon={<EyeOutlined />}>
              Ver
            </Button>
          </>
        ) : permiso.rol === 'Funcionario' ? (
          <>
            <Button type='primary' key={`ver-${index}`} onClick={() => onClickView(row)} icon={<EyeOutlined />}>
              Ver
            </Button>

            <Button
              type='primary'
              key={`vali-${index}`}
              onClick={() => onClickValidarInformacion(row)}
              style={{ marginLeft: '5px' }}
              icon={<CheckOutlined />}
            >
              Validar Informacion
            </Button>
          </>
        ) : null;
      }
    }
  ];

//--------------------------------------------


  return (
    <div className='card card-body py-5 mb-4 fadeInTop'>
      <div className='d-lg-flex align-items-start'>
        <Table dataSource={data} columns={structureColumns} pagination={{ pageSize: 50 }} />
      </div>
      <Modal
        title={<h3>Tabla de Seguimiento</h3>}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1000}
        okButtonProps={{ hidden: true }}
        cancelText='Cerrar'
      >
        <Table dataSource={dataTable} columns={columnFake} pagination={{ hideOnSinglePage: true }} />
      </Modal>
    </div>
  );
  */
};
