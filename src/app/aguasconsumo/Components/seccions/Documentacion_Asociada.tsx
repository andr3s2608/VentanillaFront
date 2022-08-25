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
  const [subioarchivo, setsubioarchivo] = useState<boolean>(false);

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const Paginas: number = 10;

  const getListas = useCallback(
    async () => {
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
    if (archivocargado.length === 0) {
      let posicion = 1;

      const array: any[] = [];
      if (archivocargado.length > 0) {
        for (let index = 0; index < archivocargado.length; index++) {
          array.push(archivocargado[index]);
          posicion++;
        }
        array.push({ posicion: posicion, nombre: value.file.name, archivo: value.file });
        setarchivocargado(array);
        prop(array);
      } else {
        array.push({ posicion: posicion, nombre: value.file.name, archivo: value.file });
        setarchivocargado(array);
        prop(array);
      }
      setsubioarchivo(true);
    }
  };

  const onClickValidarInformacion = async (datos: any) => {
    const data = datos;
    const array: any[] = [];

    var pos: number = 1;
    for (let index = 0; index < archivocargado.length; index++) {
      if (index != data.posicion - 1) {
        const aux = archivocargado[index];
        aux.posicion = pos;
        pos++;
        array.push(aux);
      }
    }
    setsubioarchivo(false);
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
      <section style={{ width: '100%' }}>
        <div className='container-fluid'>
          <div className='card-body' style={{ marginTop: '-20px' }}>
            <div className='row' style={{ marginLeft: '-20px' }}>
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
                    disabled={subioarchivo}
                    style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                  >
                    Cargar archivo
                  </Button>
                </Upload>
              </div>
            </div>
            <div className='row mt-2' style={{ marginLeft: '-28px' }}>
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
        </div>
      </section>
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
