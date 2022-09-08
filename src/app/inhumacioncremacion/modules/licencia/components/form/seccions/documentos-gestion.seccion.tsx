import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import Divider from 'antd/es/divider';
import Table from 'antd/es/table';
import { List, Card, Layout, Radio, Modal, Upload, Button } from 'antd';

// Componentes

import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

import ReactDOM from 'react-dom';

import { Viewer } from '@react-pdf-viewer/core';

// Antonio Cantillo - Components
//import { PDFViewer } from '@react-pdf/renderer';
//import { Page, Document } from 'react-pdf';
//import ReactPDF from '@react-pdf/renderer';
//import { MyDocument } from '../seccions/documentoPDF';
import { FilePdfOutlined, UploadOutlined } from '@ant-design/icons';

//import PDFReader from './PDFReader';
//import BasicDocument from './BasicDocument';
import '../../../../../../../css/estilos.css';
// Services
export const InformacionDocumentosGestion: React.FC<documentosgestion> = (props) => {
  const { prop, obj, id, escambio, instType } = props;
  const [grid, setGrid] = useState<any[]>([]);
  const [urlPdf, setUrlPdf] = useState<any>('');

  const instTypebd = obj?.instRazonSocial;
  const [heightIframe, setHeightIframe] = useState<string>('');
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const solicitud = obj.idSolicitud;

  const arrayinhind: any = [
    '19A11490-261C-4114-9152-23C2B991CB36',
    '9C4E62A4-EE76-4BA1-8DBE-8BE172E23788',
    '79320AF6-943C-43BF-87D1-847B625F6203',
    'ABE33C1D-9370-4189-9E81-597E5B643481',
    'FA808621-D345-43C7-88B0-E0B9FF56A24D',
    '6E57212B-2266-4854-9C13-F805BB4BBCF8'
  ];
  const arrayinhfet: any = [
    '19A11490-261C-4114-9152-23C2B991CB36',
    'D2D3ABA7-3B92-446A-AA8C-80A75DE246A7',
    '79320AF6-943C-43BF-87D1-847B625F6203',
    'ABE33C1D-9370-4189-9E81-597E5B643481'
  ];
  const arraycremind: any = [
    '19A11490-261C-4114-9152-23C2B991CB36',
    '9C4E62A4-EE76-4BA1-8DBE-8BE172E23788',
    '79320AF6-943C-43BF-87D1-847B625F6203',
    'F67F1C4E-A6A5-4257-A995-17A926801F7C',
    'D6524742-E32D-4548-AB21-7A9CBB367926',
    'C659A063-E8A3-4F23-9A61-575AFB1E1C2B',
    '1266F06C-0BC1-4CF8-BA51-5E889D5E8178',
    'ABE33C1D-9370-4189-9E81-597E5B643481',
    '242A2E58-46B5-4C45-97BA-881A383F2CBB'
  ];
  const arraycremfet: any = [
    '19A11490-261C-4114-9152-23C2B991CB36',
    'D2D3ABA7-3B92-446A-AA8C-80A75DE246A7',
    '79320AF6-943C-43BF-87D1-847B625F6203',
    'F67F1C4E-A6A5-4257-A995-17A926801F7C',
    'D6524742-E32D-4548-AB21-7A9CBB367926',
    'C659A063-E8A3-4F23-9A61-575AFB1E1C2B',
    '1266F06C-0BC1-4CF8-BA51-5E889D5E8178',
    'ABE33C1D-9370-4189-9E81-597E5B643481'
  ];

  let arrayarchivos: any[] = ['1', '1', '1', '1', '1', '1', '1', '1'];
  const getListas = useCallback(async () => {



    await GetValidateRol();
  }, []);

  const GetValidateRol = async () => {
    const resp = await api.getSupportDocuments(solicitud);

    switch (obj.idTramite) {
      case 'a289c362-e576-4962-962b-1c208afa0273':
        /*El contenedor es de inhumacion indivual */

        var array: any[] = [];

        for (let index = 0; index < arrayinhind.length; index++) {
          const documento: string = arrayinhind[index];

          for (let indexinterno = 0; indexinterno < resp.length; indexinterno++) {
            const bd: string = await resp[indexinterno].idTipoDocumentoSoporte;
            if (bd.toUpperCase() == documento) {
              if (resp[indexinterno].esValido == true) {
                array.push(resp[indexinterno]);
                break;
              }

            }
          }
        }

        setGrid(array);

        break;
      case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
        /*El contenedor es de inhumacion fetal */

        var array: any[] = [];

        for (let index = 0; index < arrayinhfet.length; index++) {
          const documento: string = arrayinhfet[index];

          for (let indexinterno = 0; indexinterno < resp.length; indexinterno++) {
            const bd: string = await resp[indexinterno].idTipoDocumentoSoporte;
            if (bd.toUpperCase() == documento) {
              if (resp[indexinterno].esValido == true) {
                array.push(resp[indexinterno]);
                break;
              }
            }
          }
        }

        setGrid(array);
        break;
      case 'e69bda86-2572-45db-90dc-b40be14fe020':
        /*El contenedor es de cremacion individual */

        var array: any[] = [];

        for (let index = 0; index < arraycremind.length; index++) {
          const documento: string = arraycremind[index];

          for (let indexinterno = 0; indexinterno < resp.length; indexinterno++) {
            const bd: string = await resp[indexinterno].idTipoDocumentoSoporte;
            if (bd.toUpperCase() == documento) {
              if (resp[indexinterno].esValido == true) {
                array.push(resp[indexinterno]);
                break;
              }
            }
          }
        }

        setGrid(array);
        break;
      case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
        /*El contenedor es de cremacionfetal */

        var array: any[] = [];

        for (let index = 0; index < arraycremfet.length; index++) {
          const documento: string = arraycremfet[index];

          for (let indexinterno = 0; indexinterno < resp.length; indexinterno++) {
            const bd: string = await resp[indexinterno].idTipoDocumentoSoporte;
            if (bd.toUpperCase() == documento) {
              if (resp[indexinterno].esValido == true) {
                array.push(resp[indexinterno]);
                break;
              }
            }
          }
        }

        setGrid(array);
        break;
    }
  };

  //
  useEffect(() => {

    getListas();
    setHeightIframe('0vh');
  }, []);

  //desglosar descripcion de path
  var stringData = grid.reduce((result, item) => {
    return `${result}${item.path}|`;
  }, '');

  var validara = 0;
  const validar = () => {
    const posicioninicial = stringData.indexOf('/');
    var posicion_ = 0;
    for (let index = 0; index < stringData.indexOf('|'); index++) {
      if (stringData.substring(index, index + 1) == '_') {
        posicion_ = index;
      }
    }
    var cadena = stringData.substring(posicioninicial + 1, posicion_);
    const posicionfinal = stringData.indexOf('|');
    stringData = stringData.substring(posicionfinal + 1, stringData.length);

    return cadena;
  };
  //////////////////////

  //separar los radiogroup
  var posicionradio = -1;
  var posicionform = -1;
  const counterradio = () => {
    posicionradio = posicionradio + 1;
    return posicionradio;
  };
  const counterform = () => {
    posicionform = posicionform + 1;
    return posicionform;
  };

  var valorradio = 'sin modificar';

  //Capturar que documento se modifico(cumple,no cumple)
  const onChange = (value: any) => {
    var nombre: string = value.target.name;
    var posicion: number = parseInt(nombre.substring(5, 6));

    arrayarchivos[posicion] = value.target.value;

    //envia a validation.form el array con el estado de los documentos
    prop(posicion + '', value.target.value + '');
    //prop.datos(arrayarchivos);
  };

  const viewPDF = async (DocumentsSupport: any) => {
    /** Se consume end-point para obtener la solicitud a la que pertenece
     *  el documento, y saber el tipo de tramite de la solicitud
     * */
    const [solicitud] = await api.getLicencia(DocumentsSupport.idSolicitud);
    let typeContainer = null;

    /** Se asigna el tipo de contendor donde buscar el pdf que depende del tipo
     *  de tramite de la solicitud
     **/
    switch (solicitud.idTramite) {
      case 'a289c362-e576-4962-962b-1c208afa0273':
        /*El contenedor es de inhumacion indivual */
        typeContainer = `inhumacionindividual/`;
        break;
      case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
        /*El contenedor es de inhumacion fetal */
        typeContainer = `inhumacionfetal/`;
        break;
      case 'e69bda86-2572-45db-90dc-b40be14fe020':
        /*El contenedor es de cremacion individual */
        typeContainer = `cremacionindividual/`;
        break;
      case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
        /*El contenedor es de cremacionfetal */
        typeContainer = `cremacionfetal/`;
        break;
    }

    let pathFull = typeContainer + DocumentsSupport.path + `.pdf`;

    setUrlPdf(api.GetUrlPdf(pathFull));
    setHeightIframe('1000vh');
  };

  let structureColumns: any = [];

  if (escambio) {
    structureColumns = [
      {
        title: 'Descripción',
        dataIndex: '',
        key: 'descripcionpath',
        render: (Text: string) => (
          <Form.Item label='' name=''>
            <text>{validar()}</text>
          </Form.Item>
        )
      },
      {
        title: 'Ver PDF',
        dataIndex: 'pdf',
        key: Math.random().toString(36).substring(2, 9),
        render: (_: any, row: any, index: any) => <FilePdfOutlined onClick={() => viewPDF(row)} style={{ fontSize: '30px' }} />
      }
    ];
  }
  else {


    structureColumns = [
      {
        title: 'Descripción',
        dataIndex: '',
        key: 'descripcionpath',
        render: (Text: string) => (
          <Form.Item label='' name=''>
            <text>{validar()}</text>
          </Form.Item>
        )
      },
      {
        title: 'Ver PDF',
        dataIndex: 'pdf',
        key: Math.random().toString(36).substring(2, 9),
        render: (_: any, row: any, index: any) => <FilePdfOutlined onClick={() => viewPDF(row)} style={{ fontSize: '30px' }} />
      },
      {
        title: 'Cumple?',
        dataIndex: 'Cumple',
        key: 'cumple',
        render: (Text: string) => (
          <Form.Item label='' name={'form' + counterform()}>
            <Radio.Group onChange={onChange} name={'radio' + counterradio()} defaultValue={1}>
              <Radio value={1}>Si</Radio>
              <Radio value={2}>No</Radio>
            </Radio.Group>
          </Form.Item>
        )
      }
    ];
  }
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
          <p style={{ fontSize: '16px', color: '#3366cc', fontFamily: ' Roboto' }} className='text-uppercase font-weight-bold'>
            Documentos Cargados
          </p>
        </div>
      </div>
      <div className='row'>
        <div className='col-lg-6 col-sm-6 col-md-6 documents'>
          <Table dataSource={grid} columns={structureColumns} pagination={{ pageSize: 50 }} />
        </div>
        <div className='col-lg-6 col-sm-6 col-md-6 pdf'>
          <iframe src={urlPdf} frameBorder='0' scrolling='auto' height='500px' width='100%'></iframe>
        </div>
      </div>

      {escambio && (<>

        {(instTypebd === 'Otros' && instType != '80d7f664-5bdd-48eb-8b2c-93c1bd648cc8') && (<>

          <Form.Item label='Acta Notarial Fiscal' name='fileActaNotarialFiscal' rules={[{ required: true }]}>
            <Upload
              name='fileActaNotarialFiscal'
              maxCount={1}
              beforeUpload={() => false}
              listType='text'
              accept='application/pdf'
            >
              <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
            </Upload>
          </Form.Item>


        </>)}
        {id === 'Cremación' ? (<>
          <Form.Item label='Autorización de cremación del familiar' name='fileAuthCCFamiliar' rules={[{ required: true }]}>
            <Upload
              name='fileAuthCCFamiliar'
              maxCount={1}
              beforeUpload={() => false}
              listType='text'
              accept='application/pdf'
            >
              <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
            </Upload>
          </Form.Item>

          <Form.Item label='Documento del familiar' name='fileDocCremacion' rules={[{ required: true }]}>
            <Upload
              name='fileDocCremacion'
              maxCount={1}
              beforeUpload={() => false}
              listType='text'
              accept='application/pdf'
            >
              <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
            </Upload>
          </Form.Item>
          {(instTypebd === 'Otros' && instType != '80d7f664-5bdd-48eb-8b2c-93c1bd648cc8') && (<>
            <Form.Item label='Autorización de cremacion del fiscal' name='fileAuthFiscalCremacion' rules={[{ required: true }]}>
              <Upload
                name='fileAuthFiscalCremacion'
                maxCount={1}
                beforeUpload={() => false}
                listType='text'
                accept='application/pdf'
              >
                <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
              </Upload>
            </Form.Item>

            <Form.Item label='Oficio de medicina legal al fiscal para cremar' name='fileOrdenAuthFiscal' rules={[{ required: true }]}>
              <Upload
                name='fileOrdenAuthFiscal'
                maxCount={1}
                beforeUpload={() => false}
                listType='text'
                accept='application/pdf'
              >
                <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
              </Upload>
            </Form.Item>
          </>)}
          <Form.Item label='Justificación del cambio de licencia' name='filejustcambio' rules={[{ required: true }]}>
            <Upload
              name='filejustcambio'
              maxCount={1}
              beforeUpload={() => false}
              listType='text'
              accept='application/pdf'
            >
              <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
            </Upload>
          </Form.Item>


        </>) :
          <>
            <Form.Item label='Justificación de inhumación' name='filejustFamiliar' rules={[{ required: true }]}>
              <Upload
                name='filejustFamiliar'
                maxCount={1}
                beforeUpload={() => false}
                listType='text'
                accept='application/pdf'
              >
                <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
              </Upload>
            </Form.Item>

            <Form.Item label='Documento de quien autoriza' name='fileDocaut' rules={[{ required: true }]}>
              <Upload
                name='fileDocaut'
                maxCount={1}
                beforeUpload={() => false}
                listType='text'
                accept='application/pdf'
              >
                <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
              </Upload>
            </Form.Item>
          </>
        }
      </>)}




    </div>
  );
};

interface documentosgestion {
  prop: any;
  id: string;
  obj: any;
  escambio: boolean;
  instType: string;
}
