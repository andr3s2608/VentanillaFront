import { Button, Modal } from 'antd';
import Table from 'antd/es/table';
import { IRoles } from 'app/Models/IRoles';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { useCallback, useEffect, useState } from 'react';
import { columnFake, dataFake } from './model';
import { CheckOutlined, EyeOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';

interface IDataSource {
  data: Array<any>;
}

export const Gridview = (props: IDataSource) => {
  const history = useHistory();
  const { data } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roles, setroles] = useState<IRoles[]>([]);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

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
      title: 'Numero Licencia',
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
      render: () => <FilePdfOutlined style={{ fontSize: '30px' }} />
    },
    {
      title: 'Acciones',
      key: 'Acciones',

      render: (_: any, row: any, index: any) => {
        const [permiso] = roles;

        return permiso.rol === 'Ciudadano' ? (
          <Button key={index} type='primary' onClick={showModal} icon={<EyeOutlined />}>
            Ver
          </Button>
        ) : permiso.rol === 'Funcionario' ? (
          <>
            <Button type='primary' key={`ver-${index}`} onClick={showModal} icon={<EyeOutlined />}>
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onClickValidarInformacion = async ({ idSolicitud }: { [x: string]: string }) => {
    const data = await api.getLicencia(idSolicitud);
    const { idTramite } = data[0];

    localStorage.setItem('register', JSON.stringify(data));

    switch (idTramite) {
      case 'a289c362-e576-4962-962b-1c208afa0273':
        //inhumacion indivual
        history.push('/tramites-servicios/licencia/inhumacion-individual');
        break;
      case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
        //inhumacion fetal
        history.push('/tramites-servicios/licencia/inhumacion-fetal');
        break;
      case 'e69bda86-2572-45db-90dc-b40be14fe020':
        //cremacion individual
        history.push('/tramites-servicios/licencia/cremacion-individual');
        break;
      case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
        //cremacionfetal
        history.push('/tramites-servicios/licencia/cremacion-fetal');
        break;
    }
  };

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
        <Table dataSource={dataFake} columns={columnFake} pagination={{ hideOnSinglePage: true }} />
      </Modal>
    </div>
  );
};
