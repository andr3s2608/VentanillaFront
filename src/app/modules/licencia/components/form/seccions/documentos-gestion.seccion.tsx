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

// Services

export const InformacionDocumentosGestion: React.FC<documentosgestion> = (obj, id) => {
  const [grid, setGrid] = useState<any[]>([]);
  const [shown, setShown] = useState(false);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const solicitud = id.idsolicitud;
  let counterDoc: Array<number>;
  const getListas = useCallback(async () => {
    await GetValidateRol();
  }, []);

  const GetValidateRol = async () => {
    const resp = await api.getSupportDocuments('11A328A2-D161-48CE-9D33-EB90B9F4DCC1');
    //counterDoc = Array.from({ length: resp.length }, (v, i) => i);
    console.log(resp, 'DOCUMENTOS');
    setGrid(resp);
  };

  //
  useEffect(() => {
    getListas();
  }, []);
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
  var posicion = -1;
  const counter = () => {
    posicion = posicion + 1;
    return posicion;
  };

  const archivo = () => {
    window.open('src/archivo/prueba.pdf', 'abrir');
  };

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
        <Viewer fileUrl={'prueba.pdf'} />
      </div>
    </div>
  );

  const structureColumns = [
    {
      title: 'Id Documento',
      dataIndex: 'idDocumentoSoporte',
      key: 'idDocumentoSoporte'
    },
    {
      title: 'Descripcion',
      dataIndex: '',
      key: 'path',
      render: (Text: string) => (
        <Form.Item label='' name=''>
          <text>{validar()}</text>
        </Form.Item>
      )
    },

    {
      title: 'Ver Documento',
      dataIndex: 'Ver',
      key: 'Ver',
      render: (Text: string) => (
        <>
          <button
            style={{
              backgroundColor: '#00449e',
              border: 'none',
              borderRadius: '.25rem',
              color: '#fff',
              cursor: 'pointer',
              padding: '.5rem'
            }}
            onClick={() => setShown(true)}
          >
            ver
          </button>

          {shown && ReactDOM.createPortal(modalBody(), document.body)}
        </>
      )
    },
    {
      title: 'Cumple?',
      dataIndex: 'Cumple',
      key: 'Cumple',
      render: (Text: string) => (
        <Form.Item label='' name={'form' + counter()}>
          <Radio.Group name={'radio' + counter()} defaultValue={1}>
            <Radio value={1}>Si</Radio>
            <Radio value={2}>No</Radio>
          </Radio.Group>
        </Form.Item>
      )
    }
  ];

  const onPrev = ({ idSolicitud, estadoSolicitud }: { [x: string]: string }) => {
    if (estadoSolicitud === '3cd0ed61-f26b-4cc0-9015-5b497673d275') {
      // api.GeneratePDF(idSolicitud);
    }
  };

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
  id: string;
  obj: any;
}
