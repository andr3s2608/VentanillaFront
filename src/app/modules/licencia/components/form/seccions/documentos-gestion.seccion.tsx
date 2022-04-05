import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import Divider from 'antd/es/divider';
import Table from 'antd/es/table';
import { List, Card, Layout, Radio } from 'antd';

// Componentes

import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

import ReactDOM from 'react-dom';

import { Viewer } from '@react-pdf-viewer/core';

// Antonio Cantillo - Components
import { PDFViewer } from '@react-pdf/renderer';
import { Page, Document } from 'react-pdf';
import ReactPDF from '@react-pdf/renderer';
import { MyDocument } from '../seccions/documentoPDF';
import { FilePdfOutlined } from '@ant-design/icons';

//import PDFReader from './PDFReader';
import BasicDocument from './BasicDocument';

// Services
export const InformacionDocumentosGestion: React.FC<documentosgestion> = (props) => {
  const { prop, obj, id } = props;
  const [grid, setGrid] = useState<any[]>([]);
  const [shown, setShown] = useState(false);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const solicitud = obj.idSolicitud;

  var arrayarchivos: any[] = ['1', '1', '1', '1', '1'];
  const getListas = useCallback(async () => {
    await GetValidateRol();
  }, []);

  const GetValidateRol = async () => {
    const resp = await api.getSupportDocuments(solicitud);

    setGrid(resp);
  };

  //
  useEffect(() => {
    getListas();
  }, []);

  //desglosar descripcion de path
  var stringData = grid.reduce((result, item) => {
    return `${result}${item.path}|`;
  }, '');

  var validara = 0;
  const validar = () => {
    const posicioninicial = stringData.indexOf('/');
    const posicionfinal = stringData.indexOf('|');
    var cadena = stringData.substring(posicioninicial + 1, posicionfinal);
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

  //////////////////////////

  const modalBody = () => (
    <div
      style={{
        backgroundColor: '#fff',
        flexDirection: 'column',
        overflow: 'hidden',

        /* Fixed position */
        left: 0,
        position: 'fixed',
        top: 0,

        /* Take full size */
        height: '100%',
        width: '100%',

        /* Displayed on top of other elements */
        zIndex: 9999
      }}
    >
      <div
        style={{
          alignItems: 'center',
          backgroundColor: '#000',
          color: '#fff',
          display: 'flex',
          padding: '.5rem'
        }}
      >
        <div style={{ marginRight: 'auto' }}></div>
        <button
          style={{
            backgroundColor: '#357edd',
            border: 'none',
            borderRadius: '4px',
            color: '#ffffff',
            cursor: 'pointer',
            padding: '8px'
          }}
          onClick={() => setShown(false)}
        >
          Close
        </button>
      </div>
      <div
        style={{
          flexGrow: 1,
          overflow: 'auto'
        }}
      >
        <Viewer fileUrl={'F:/repositorios/prueba/TramitesVentanillaFront/src/archivo/prueba.pdf'} />
      </div>
    </div>
  );
  var valorradio = 'sin modificar';
  const onChange = (value: any) => {
    var nombre: string = value.target.name;
    var posicion: number = parseInt(nombre.substring(5, 6));

    arrayarchivos[posicion] = value.target.value;

    prop(arrayarchivos);
    //prop.datos(arrayarchivos);
  };
      const onPrevPDF = ({ idDocumentoSoporte, estadoSolicitud }: { [x: string]: string }) => {
    console.log('ID SOPORTE', { idDocumentoSoporte });
    idDocumentoSoporte = '1042979778.pdf';
    api.VisualizerPdfEstado(idDocumentoSoporte);
  };
  
  
  

  const structureColumns = [
    {
      title: 'Descripcion',
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
      render: (_: any, row: any, index: any) => <FilePdfOutlined onClick={() => onPrevPDF(row)} style={{ fontSize: '30px' }} />
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


  return (
    <>
      <Divider orientation='left'>Documentos Cargados</Divider>
      <div className='d-lg-flex align-items-start'>
        <Table dataSource={grid} columns={structureColumns} pagination={{ pageSize: 50 }} />
      </div>
    </>
  );
};
interface documentosgestion {
  prop: any;
  id: string;
  obj: any;
}
