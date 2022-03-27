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

interface IDataSource {
  data: Array<any>;
}

export const Gridview = (props: IDataSource) => {
  const history = useHistory();
  const { data } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [solicitud, setSolicitud] = useState<any[]>([]);
  const [roles, setroles] = useState<IRoles[]>([]);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [dataTable, setDataTable] = useState<[]>();
  const formatDate = 'MM-DD-YYYY';

  const getListas = useCallback(
    async () => {
      const mysRoles = await api.GetRoles();
      setroles(mysRoles);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  //const getMenu = UpdateMenu();

  useEffect(() => {
    getListas();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  var numero = 0;

  const traerdatos = async ({ idSolicitud }: { [x: string]: string }) => {
    if (numero == 0) {
      const data = await api.getLicencia(idSolicitud);
      const { idTramite } = data[0];

      //arrayprueba.push(resp)
    }
  };

  const structureColumns = [
    {
      title: 'No Tramite',
      dataIndex: 'numeroCertificado',
      key: 'fechaSolicitud'
    },
    {
      title: 'Nombre Completo',
      dataIndex: '',
      key: 'fechaSolicitud'
    },
    {
      title: 'Numero de Documento',
      dataIndex: '',
      key: 'fechaSolicitud'
    },

    {
      title: 'Telefono',
      dataIndex: '',
      key: 'idSolicitud'
    },
    {
      title: 'Correo',
      dataIndex: '',
      key: 'numeroCertificado'
    },
    {
      title: 'Fecha de Registro',
      dataIndex: 'fechaSolicitud',
      key: 'fechaSolicitud'
    },
    {
      title: 'Estado Tramite',
      dataIndex: 'solicitud',
      key: 'solicitud'
    },
    {
      title: 'Tipo Solicitud',
      dataIndex: 'tramite',
      key: 'tramite'
    },
    {
      title: 'PDF',
      dataIndex: 'pdf',
      key: 'pdf',
      render: (_: any, row: any, index: any) => <FilePdfOutlined onClick={() => onPrev(row)} style={{ fontSize: '30px' }} />
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
  console.log(data, 'datos nuevos');

  const onClickValidarInformacion = async ({ idSolicitud }: { [x: string]: string }) => {
    const data = await api.getLicencia(idSolicitud);
    const { idTramite } = data[0];

    localStorage.setItem('register', JSON.stringify(data));

    //history.push('/tramites-servicios/licencia/inhumacion-prueba');

    switch (idTramite) {
      case 'a289c362-e576-4962-962b-1c208afa0273':
        //inhumacion indivual
        history.push('/tramites-servicios/licencia/inhumacion-prueba');
        //history.push('/tramites-servicios/licencia/inhumacion-individual');
        break;
      case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
        //inhumacion fetal
        history.push('/tramites-servicios/licencia/inhumacion-prueba');
        //history.push('/tramites-servicios/licencia/inhumacion-fetal');
        break;
      case 'e69bda86-2572-45db-90dc-b40be14fe020':
        //cremacion individual
        history.push('/tramites-servicios/licencia/inhumacion-prueba');
        // history.push('/tramites-servicios/licencia/cremacion-individual');
        break;
      case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
        //cremacionfetal
        history.push('/tramites-servicios/licencia/inhumacion-prueba');
        //history.push('/tramites-servicios/licencia/cremacion-fetal');
        break;
    }
  };
  var stringData: string = data.reduce((result, item) => {
    return `${result}${item.idSolicitud}|`;
  }, '');

  const arrayprueba: any = [];

  var validacion = 0;
  if (data.length > 0) {
    if (validacion < 1) {
      validacion = validacion + 1;

      for (var i = 0; i < 10; i++) {
        const posicion = stringData.indexOf('|');
        var cadena: any = stringData.substring(0, posicion);
        //console.log('id:', cadena, '///', 'salta?');

        //traerdatos(data.at(i));

        //console.log('cadena', cadena);
        cadena = stringData;
        stringData = cadena.substring(posicion + 1, stringData.length);
        //console.log('stringdatanueva', stringData);

        //traerdatos();
      }
    }
  }

  return (
    <div className='card card-body py-5 mb-4 fadeInTop'>
      <div className='d-lg-flex align-items-start'>
        //
        <Table dataSource={data} columns={structureColumns} pagination={{ pageSize: 3 }} />
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
