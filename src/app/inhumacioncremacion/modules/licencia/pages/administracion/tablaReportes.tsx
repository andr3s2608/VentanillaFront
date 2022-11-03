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
  const [roles, setroles] = useState<IRoles[]>([]);
  const api = new ApiService(accountIdentifier);
  const Paginas: number = 10;

  const getListas = useCallback(
    async () => {
      const rolesstorage: any = localStorage.getItem('roles');

      setroles(JSON.parse(rolesstorage));
      setValidacion('1');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
  }, []);


  var identify: string;
  var tipotramite: any;
  var fecha: any;

  const Renovar = (datos: any) => {
    if (data.length == 0) {
    } else {
      if (datos == undefined) {
        datos = data;
      }

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

      fecha = datos.reduce((result: any, item: { fechaSolicitud: any }) => {
        return `${result}${item.fechaSolicitud}|`;
      }, '');
    }
  };

  if (Validacion == '1') {
    Renovar(undefined);
  }

  var structureColumns;


  if (Validacion == '1') {
    structureColumns = [
      {
        title: 'Consecutivo',
        dataIndex: 'consecutivo',
        key: 'consecutivo'
      },
      {
        title: 'Num. Licencia',
        dataIndex: 'ResumenSolicitud.NumeroLicencia',
        key: 'resumenSolicitud.numeroLicencia'
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
        key: 'fechaSolicitud',
        render: (Text: string) => (
          <Form.Item label='' name=''>
            <text>{Text.toString().substring(0, Text.toString().indexOf('T'))}</text>
          </Form.Item>
        )
      },
      {
        title: 'Estado Tramite',
        dataIndex: 'estadoString',
        key: 'estado'
      },
      {
        title: 'Tipo Solicitud',
        dataIndex: 'idTramite',
        key: 'tipoSolicitud',
        render: (Text: string) => {
          switch (Text) {
            case 'a289c362-e576-4962-962b-1c208afa0273':
              return <Form.Item label='' name=''>
                <text>{'Inhumación Individual'}</text>
              </Form.Item>

            case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
              //inhumacion fetal
              return <Form.Item label='' name=''>
                <text>{'Inhumación Fetal'}</text>
              </Form.Item>

            case 'e69bda86-2572-45db-90dc-b40be14fe020':
              //cremacion individual
              return <Form.Item label='' name=''>
                <text>{'Cremación Individual'}</text>
              </Form.Item>

            case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
              //cremacionfetal
              return <Form.Item label='' name=''>
                <text>{'Cremación Fetal '}</text>
              </Form.Item>


          }
        }
      }
    ];
  }

  const onPageChange = (pagination: any, filters: any) => {


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
