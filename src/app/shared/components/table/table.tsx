import { Button, Modal } from 'antd';
import Table from 'antd/es/table';
import { useState } from 'react';
import { columnFake, dataFake, structureColumns } from './model';

interface IDataSource {
  data: Array<any>;
}

export const Gridview = (props: IDataSource) => {
  const { data } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      title: 'Acciones',
      key: 'operation',

      render: () => (
        <Button type='primary' onClick={showModal}>
          Ver
        </Button>
      )
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
