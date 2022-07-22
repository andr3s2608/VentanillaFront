import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import Divider from 'antd/es/divider';
import {
  dominioService,
  ETipoDominio,
  IBarrio,
  IDepartamento,
  IDominio,
  ILocalidad,
  IMunicipio,
  IUpz
} from 'app/services/dominio.service';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';

//Redux
import { store } from 'app/redux/app.reducers';
import { SetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';
import '../../../../css/estilos.css';
import { Button, Table, Upload } from 'antd';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { CheckOutlined, UploadOutlined } from '@ant-design/icons';
export const DocumentacionAsociada: React.FC<Documentacion<any>> = (props) => {
  const { tipo, obj, prop } = props;
  const [archivocargado, setarchivocargado] = useState<any>();

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const Paginas: number = 5;

  const getListas = useCallback(
    async () => {
      console.log('entro1');
      console.log(obj.idsolicitud);

      console.log('entro2');
      const documentos = await api.getSupportDocumentsAguas(obj.idsolicitud);
      const filter = documentos.filter(
        (i: { idTipoDocumentoAdjunto: string }) => i.idTipoDocumentoAdjunto == '81c98a3c-730c-457a-bba1-877b737a9847'
      );
      const array: any[] = [];
      for (let index = 0; index < filter.length; index++) {
        array.push({ posicion: index, nombre: 'Documentacion asociada a la revision', archivo: filter[0] });
      }
      setarchivocargado(array);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subida = (value: any) => {
    let posicion = 0;
    console.log(value);
    if (archivocargado.length > 0) {
      const array: any[] = [];
      for (let index = 0; index < archivocargado.length; index++) {
        array.push(archivocargado[index]);
        posicion++;
      }
      array.push({ posicion: posicion, nombre: value, archivo: value });
      setarchivocargado(array);
    } else {
      setarchivocargado({ posicion: posicion, nombre: value, archivo: value });
    }
  };

  const onClickValidarInformacion = async (datos: any) => {
    const data = datos;
    const array: any[] = [];

    var pos: number = 0;
    for (let index = 0; index < archivocargado.length; index++) {
      if (index != data.posicion) {
        const aux = archivocargado[index];
        aux.posicion = pos;
        pos++;
        array.push(aux);
      }
    }
    setarchivocargado(array);
    prop(array);
    //history.push('/tramites-servicios-aguas/Revision/revisar-solicitud');
  };

  const tabla = [
    {
      title: 'No. ',
      dataIndex: 'posicion',
      key: 'posicion'
    },
    {
      title: 'Nombre del Archivo',
      dataIndex: 'nombre',
      key: 'nombre'
    },
    {
      title: 'Acciones',
      key: 'Acciones',
      align: 'center' as 'center',

      render: (_: any, row: any, index: any) => {
        return (
          <Button
            type='primary'
            className='fa-solid fa-circle-xmark'
            onClick={() => onClickValidarInformacion(row)}
            style={{ fontSize: '30xp', color: 'red' }}
            icon={<CheckOutlined />}
          >
            Validar Información
          </Button>
        );
      }
    }
  ];

  return (
    <>
      <div className='card-body' style={{ backgroundColor: '#ede9e3' }}>
        <div className='row'>
          <div className='col-lg-12 col-sm-12 col-md-12'>
            <Upload
              name='cargarArchivoDocumentacion'
              onChange={subida}
              maxCount={1}
              beforeUpload={() => false}
              listType='text'
              accept='application/pdf'
            >
              <Button
                className='float-right button btn btn-default'
                icon={<UploadOutlined />}
                style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
              >
                Cargar archivo
              </Button>
            </Upload>
          </div>
        </div>
        <div className='row mt-2'>
          <div className='col-lg-12 col-md-12 col-sm-12'>
            <Table
              scroll={{ y: 240 }}
              id='tableGen'
              dataSource={archivocargado}
              columns={tabla}
              pagination={{ pageSize: Paginas }}
              className='table_info'
            />{' '}
            <br />
          </div>
        </div>
      </div>
    </>
  );
};
interface Documentacion<T> {
  form: FormInstance<T>;
  obj: any;
  tipo: any;
  prop: any;
}
export const KeysForm = ['departamento', 'municipio', 'sector', 'vereda', 'localidad', 'direccion', 'observations'];
