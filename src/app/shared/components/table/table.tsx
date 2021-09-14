import { Button, Modal } from 'antd';
import Table from 'antd/es/table';
import { IRoles } from 'app/Models/IRoles';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { useCallback, useEffect, useState } from 'react';
import { columnFake, dataFake, structureColumns } from './model';
import { CheckOutlined, EyeOutlined, FilePdfOutlined } from '@ant-design/icons';
interface IDataSource {
  data: Array<any>;
}

export const Gridview = (props: IDataSource) => {
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
      key: 'operation',

      render: () => {
        const [permiso] = roles;
        console.log(permiso);
        return permiso.rol === 'Ciudadano' ? (
          <Button type='primary' onClick={showModal} icon={<EyeOutlined />}>
            Ver
          </Button>
        ) : permiso.rol === 'Funcionario' ? (
          <>
            <Button type='primary' onClick={showModal} icon={<EyeOutlined />}>
              Ver
            </Button>

            <Button type='primary' style={{ marginLeft: '5px' }} onClick={showModal} icon={<CheckOutlined />}>
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
