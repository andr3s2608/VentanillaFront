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
import { Button, Modal, Table, Upload } from 'antd';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { CheckOutlined, FilePdfOutlined, UploadOutlined } from '@ant-design/icons';
export const DocumentacionAsociada: React.FC<Documentacion<any>> = (props) => {
  const { tipo, obj, prop } = props;
  const [archivocargado, setarchivocargado] = useState<any>();
  const [subioarchivo, setsubioarchivo] = useState<boolean>(false);
  const [urlPdfDocumento, setUrlPdfDocumento] = useState<string>('default');
  const [enableModalViewDocument, setEnableModalViewDocument] = useState<boolean>(false);



  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const Paginas: number = 10;

  const getListas = useCallback(
    async () => {
      const documentos = await api.getSupportDocumentsAguas(obj.idsolicitud);

      const rolesjson: any = localStorage.getItem('roles');
      const roles = JSON.parse(rolesjson)

      if (roles[0].rol == 'Subdirector') {
        setsubioarchivo(true);
      }

      const filter = documentos.filter(function (f: { idTipoDocumentoAdjunto: string }) {
        return (
          f.idTipoDocumentoAdjunto === '81c98a3c-730c-457a-bba1-877b737a9847' ||
          f.idTipoDocumentoAdjunto === '96d00032-4b60-4027-afea-0cc7115220b4' ||
          f.idTipoDocumentoAdjunto === '9edce821-f1d9-4f9d-8764-a436bdfe5ff0' ||
          f.idTipoDocumentoAdjunto === '3c9cf345-e37d-4ab0-baca-c803dbb5380b'
        );
      });


      const array: any[] = [];
      for (let index = 0; index < filter.length; index++) {
        const path = filter[index].path;
        let posicion_ = 0;

        const posicioninicial = filter[index].path.indexOf('/');

        for (let index2 = 0; index2 < path.length; index2++) {
          if (path.substring(index2, index2 + 1) == '_') {
            posicion_ = index2;
          }
        }

        var cadena = path.substring(posicioninicial + 1, posicion_);

        array.push({
          posicion: index, nombre: cadena, archivo: filter[0], cargado: 1, subida: 'nube', path: path
        });
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

    const array: any[] = [];
    if (archivocargado.length > 0) {
      for (let index = 0; index < archivocargado.length; index++) {
        array.push(archivocargado[index]);
        posicion++;
      }
      array.push({
        posicion: posicion, nombre: 'Documentacion asociada a la revision', archivo: value.file, cargado: 0,
        subida: 'local', path: '/Documentacion_asociada_a_la_revision/'
      });
      setarchivocargado(array);
      prop(array);
    } else {
      array.push({
        posicion: posicion, nombre: 'Documentacion asociada a la revision', archivo: value.file, cargado: 0,
        subida: 'local', path: '/Documentacion_asociada_a_la_revision/'
      });
      setarchivocargado(array);
      prop(array);
    }
    setsubioarchivo(true);

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


  const viewPDF = async (DocumentsSupport: any) => {
    let pdfUrl: string = '';

    if (DocumentsSupport.subida === 'nube') {
      const pdfBlob = await api.GetBlobAzure(DocumentsSupport.path + '.pdf');
      pdfUrl = URL.createObjectURL(pdfBlob as Blob);
    } else if (DocumentsSupport.subida === 'local') {
      const pdfFile = DocumentsSupport.archivo;
      pdfUrl = URL.createObjectURL(pdfFile as File);
    }

    setUrlPdfDocumento(pdfUrl);
    setEnableModalViewDocument(true);
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
        if (row.cargado === 0) {
          return (
            <>
              <Button
                type='primary'
                className='fa-solid fa-circle-xmark'
                onClick={() => onClickValidarInformacion(row)}
                style={{ fontSize: '30xp', color: 'white' }}
                icon={<CheckOutlined />}
              >
                Eliminar
              </Button>
              <FilePdfOutlined onClick={() => viewPDF(row)} style={{ fontSize: '30px' }} />{' '}
            </>
          );
        }
        else {
          return (
            <>
              <FilePdfOutlined onClick={() => viewPDF(row)} style={{ fontSize: '30px' }} />{' '}
            </>
          );

        }

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
                    disabled={(subioarchivo)}
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
            <Modal
              title={<p className='text-center'> Visualización de Documento </p>}
              visible={enableModalViewDocument}
              width={1000}
              okButtonProps={{ hidden: true }}
              onCancel={() => setEnableModalViewDocument(false)}
              cancelText='Cerrar'
            >
              <iframe src={urlPdfDocumento} frameBorder='0' scrolling='auto' height='600vh' width='100%'></iframe>
            </Modal>
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
