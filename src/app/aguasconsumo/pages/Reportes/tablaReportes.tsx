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

export const TablaReportes = (props: IDataSource) => {
  const history = useHistory();
  const { data } = props;

  const { accountIdentifier } = authProvider.getAccount();
  const [Validacion, setValidacion] = useState<string>('0');

  const api = new ApiService(accountIdentifier);
  const Paginas: number = 10;

  const getListas = useCallback(
    async () => {

      setValidacion('1');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
  }, []);





  let structureColumns: any = [];

  if (Validacion == '1') {

    structureColumns = [
      {
        title: 'Consecutivo',
        dataIndex: 'consecutivo',
        key: 'consecutivo',
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { consecutivo: string; }, b: { consecutivo: string; }) =>
            a.consecutivo > b.consecutivo ? 1 : -1,
          multiple: 6,
        }
      },
      {
        title: 'Tipo Identificacion',
        dataIndex: 'tipoidentificacion',
        key: 'tipoidentificacion',
      },
      {
        title: 'Numero Identificacion',
        dataIndex: 'numeroidentificacion',
        key: 'numeroidentificacion',
      },
      {
        title: 'Tipo Razon Social',
        dataIndex: 'tipoidentificacionrazon',
        key: 'tipoidentificacionrazon',
      },
      {
        title: 'Nombre Persona Natural',
        dataIndex: 'nombre',
        key: 'nombre',
      },
      {
        title: 'Nombre Razon Social',
        dataIndex: 'razonSocial',
        key: 'razonSocial',
      },
      {
        title: 'Nit',
        dataIndex: 'nit',
        key: 'nit',
      },
      {
        title: 'Rut',
        dataIndex: 'rut',
        key: 'rut',
      },
      {
        title: 'Fecha de Autorizacion',
        dataIndex: 'fechaAutorizacion',
        key: 'fechaAutorizacion',

      },
      {
        title: 'Fecha de Solicitud',
        dataIndex: 'fechaSolicitud',
        key: 'fechaSolicitud',

      },
      {
        title: 'Estado ',
        dataIndex: 'estado',
        key: 'estado',
        width: 230,
        render: (Text: string) => {

          if (Text === 'Cambio de Licencia') {
            return (<Form.Item label='' name=''>
              <text>{'Cambio tipo de licencia'}</text>
            </Form.Item>)
          }
          else {
            if (Text === 'Registro Usuario Externo') {
              return (<Form.Item label='' name=''>
                <text>{'En Tramite'}</text>
              </Form.Item>)
            }
            else {
              return (<Form.Item label='' name=''>
                <text>{Text}</text>
              </Form.Item>)
            }

          }

        }
      }

    ];
  }

  const onPageChange = (pagination: any, filters: any) => {




  };

  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body'>
          <div className='row'>
            <span> Resultados = {data.length}</span>
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <Table
                id='tableGen'
                dataSource={data}
                columns={structureColumns}
                onChange={onPageChange}
                scroll={{ x: true }}
                pagination={{ pageSize: Paginas }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface IDataSource {
  data: Array<any>;
}
