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
      /*
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
        },*/
      {
        title: 'Numero de Licencia',
        dataIndex: 'numerolicenciainfo',
        key: 'numerolicenciainfo',
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { numerolicenciainfo: number; }, b: { numerolicenciainfo: number; }) =>
            a.numerolicenciainfo - b.numerolicenciainfo,
          multiple: 5,
        }
      },
      {
        title: 'Fecha de Licencia',
        dataIndex: 'fechaLicencia',
        key: 'fechaLicencia',
        render: (Text: any) => {
          const fecha = moment(Text + "").format('DD-MM-YYYY HH:mm')
          return <Form.Item label='' name=''>
            <text>{fecha}</text>
          </Form.Item>

        }
      },
      {
        title: 'Tipo Solicitud',
        dataIndex: 'idTramite',
        key: 'tipoSolicitud', width: 300,
        filters: [
          {
            text: 'Inhumación Individual',
            value: 'a289c362-e576-4962-962b-1c208afa0273'
          },
          {
            text: 'Inhumación Fetal',
            value: 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060'
          },
          {
            text: 'Cremación Individual',
            value: 'e69bda86-2572-45db-90dc-b40be14fe020'
          },
          {
            text: 'Cremación Fetal ',
            value: 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e'
          }
        ],
        filterSearch: true,
        onFilter: (value: string, record: { idTramite: string }) => record.idTramite.toString().includes(value.toLocaleUpperCase()),
        render: (Text: string) => {
          switch (Text.toLowerCase()) {
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
      },
      {
        title: 'Tipo de Documento',
        dataIndex: 'tipoIdentificacionFallecido',
        key: 'tipoIdentificacionFallecido'
      },
      {
        title: 'Número de documento',
        dataIndex: 'noIdentificacionFallecido',
        key: 'noIdentificacionFallecido'
      },
      {
        title: 'Primer Apellido',
        dataIndex: 'primerApellidoRep',
        key: 'primerApellidoRep',
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { primerApellidoRep: string; }, b: { primerApellidoRep: string; }) =>
            a.primerApellidoRep > b.primerApellidoRep ? 1 : -1,
          multiple: 4,
        }
      },

      {
        title: 'Segundo Apellido',
        dataIndex: 'segundoApellidoRep',
        key: 'segundoApellidoRep',
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { segundoApellidoRep: string; }, b: { segundoApellidoRep: string; }) =>
            a.segundoApellidoRep > b.segundoApellidoRep ? 1 : -1,
          multiple: 3,
        }
      },
      {
        title: 'Primer Nombre',
        dataIndex: 'primerNombreRep',
        key: 'primerNombreRep',
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { primerNombreRep: string; }, b: { primerNombreRep: string; }) =>
            a.primerNombreRep > b.primerNombreRep ? 1 : -1,
          multiple: 2,
        }
      },
      {
        title: 'Segundo Nombre',
        dataIndex: 'segundoNombreRep',
        key: 'segundoNombreRep',
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { segundoNombreRep: string; }, b: { segundoNombreRep: string; }) =>
            a.segundoNombreRep > b.segundoNombreRep ? 1 : -1,
          multiple: 1,
        }
      },

      {
        title: 'Fecha de Nacimiento',
        dataIndex: 'fechaNacimientoRep',
        key: 'fechaNacimientoRep',
        render: (Text: any) => {
          if (Text != "" && Text != null && Text != undefined) {
            const fecha = moment(Text + "").format('DD-MM-YYYY')
            return <Form.Item label='' name=''>
              <text>{fecha}</text>
            </Form.Item>
          }



        }
      },
      {
        title: 'Fecha de Fallecimiento',
        dataIndex: 'fechaDefuncion',
        key: 'fechaDefuncion',
        render: (Text: any) => {
          const fecha = moment(Text + "").format('DD-MM-YYYY')
          return <Form.Item label='' name=''>
            <text>{fecha}</text>
          </Form.Item>

        }
      },
      {
        title: 'Funeraria',
        dataIndex: 'funerariaRep',
        key: 'funerariaRep'
      },
      {
        title: 'Cementerio',
        dataIndex: 'cementerio',
        key: 'cementerio'
      },
      {
        title: 'Departamento',
        dataIndex: 'departamentoRep',
        key: 'departamentoRep'
      },
      {
        title: 'Municipio',
        dataIndex: 'municipioRep',
        key: 'municipioRep'
      },
      {
        title: 'Pais',
        dataIndex: 'paisRep',
        key: 'paisRep'
      },
      {
        title: 'Ciudad',
        dataIndex: 'ciudadRep',
        key: 'ciudadRep'
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
                bordered
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
