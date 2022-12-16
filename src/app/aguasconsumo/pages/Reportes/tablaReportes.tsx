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
  const [mostrar, setmostrar] = useState<boolean>(false);
  const [documento, setdocumento] = useState<any>('');
  const [nombrerazon, setnombrerazon] = useState<any>('');
  const [nombrepersona, setnombrepersona] = useState<any>('');
  const [datosUsuario, setdatosUsuario] = useState<any>([]);

  const getListas = useCallback(
    async () => {
      setdatosUsuario(data);


      setValidacion('1');
      setmostrar(true)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
  }, []);

  const FilterByNameInputdocumento = () => {
    return (
      <Input
        placeholder='Documento de Identificación'
        value={documento}
        style={{ width: 200 }}
        onKeyPress={(event) => {
          if (!/[a-zA-Z0-9ñÑ ]/.test(event.key)) {
            event.preventDefault();
          }
        }}
        onChange={(e) => {
          const currValue: string = e.target.value;
          setdocumento(currValue);
          const filteredDataUsuario: any = data.filter((datos: any) => {
            const razon: string = datos.razonSocial.toUpperCase();
            const nombre: string = datos.nombre.toUpperCase();
            return (
              nombre.toString().includes(nombrepersona.toUpperCase()) &&
              razon.toString().includes(nombrerazon.toUpperCase()) &&
              datos.numeroIdentificacion.toString().includes(currValue.toUpperCase())
            );
          });
          setdatosUsuario(filteredDataUsuario);
        }}
      />
    );
  }
  const FilterByName = () => {
    return (
      <Input
        placeholder='Nombre Persona Natural'
        value={nombrepersona}
        style={{ width: 200 }}
        onKeyPress={(event) => {
          if (!/[a-zA-Z0-9ñÑ ]/.test(event.key)) {
            event.preventDefault();
          }
        }}
        onChange={(e) => {

          const currValue: string = e.target.value;
          setnombrepersona(currValue);
          const filteredDataUsuario: any = data.filter((datos: any) => {
            const razon: string = datos.razonSocial.toUpperCase();
            const nombre: string = datos.nombre.toUpperCase();
            return (
              nombre.toString().includes(currValue.toUpperCase()) &&
              razon.toString().includes(nombrerazon.toUpperCase()) &&
              datos.numeroIdentificacion.toString().includes(documento.toUpperCase())
            );
          });
          setdatosUsuario(filteredDataUsuario);
        }}
      />
    );
  }
  const FilterByRazonSocial = () => {
    return (
      <Input
        placeholder='Nombre Razon Social'
        value={nombrerazon}
        style={{ width: 200 }}
        onKeyPress={(event) => {
          if (!/[a-zA-Z0-9ñÑ ]/.test(event.key)) {
            event.preventDefault();
          }
        }}
        onChange={(e) => {

          const currValue: string = e.target.value;
          setnombrerazon(currValue);
          const filteredDataUsuario: any = data.filter((datos: any) => {
            const razon: string = datos.razonSocial.toUpperCase();
            const nombre: string = datos.nombre.toUpperCase();
            return (
              nombre.toString().includes(nombrepersona.toUpperCase()) &&
              razon.toString().includes(currValue.toUpperCase()) &&
              datos.numeroIdentificacion.toString().includes(documento.toUpperCase())
            );
          });
          setdatosUsuario(filteredDataUsuario);
        }}
      />
    );
  }



  let structureColumns: any = [];

  if (Validacion == '1') {

    structureColumns = [
      {
        title: 'Tipo Identificacion',
        dataIndex: 'tipoIdentificacion',
        key: 'tipoIdentificacion',
      },
      {
        title: FilterByNameInputdocumento(),
        dataIndex: 'numeroIdentificacion',
        key: 'numeroIdentificacion',
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { numeroIdentificacion: string; }, b: { numeroIdentificacion: string; }) =>
            a.numeroIdentificacion > b.numeroIdentificacion ? 1 : -1,
          multiple: 6,
        }
      },
      {
        title: 'Tipo Razon Social',
        dataIndex: 'tipoDocumentoRazon',
        key: 'tipoDocumentoRazon',
      },
      {
        title: FilterByName(),
        dataIndex: 'nombre',
        key: 'nombre',
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { nombre: string; }, b: { nombre: string; }) =>
            a.nombre > b.nombre ? 1 : -1,
          multiple: 5,
        }
      },
      {
        title: FilterByRazonSocial(),
        dataIndex: 'razonSocial',
        key: 'razonSocial',
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { razonSocial: string; }, b: { razonSocial: string; }) =>
            a.razonSocial > b.razonSocial ? 1 : -1,
          multiple: 4,
        }
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
        filters: [
          {
            text: 'Aprobada ',
            value: 'Aprobada'
          }
          ,
          {
            text: 'En tramite ',
            value: 'Abierta'
          }
          ,
          {
            text: 'Subsanación',
            value: 'Subsanación'
          },
          {
            text: 'Desistimiento',
            value: 'Desistimiento'
          },
          {
            text: 'No aprobada',
            value: 'No aprobada'
          }
        ],
        filterSearch: true,
        onFilter: (value: string, record: { estado: string }) => record.estado.toString().includes(value),


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
                dataSource={datosUsuario}
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
