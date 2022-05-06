import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import Divider from 'antd/es/divider';
import Table from 'antd/es/table';
import { List, Card, Layout, Radio, Modal } from 'antd';

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
import { FilePdfOutlined } from '@ant-design/icons';

//import PDFReader from './PDFReader';
//import BasicDocument from './BasicDocument';

// Services
export const InformacionDocumentosGestion: React.FC<documentosgestion> = (props) => {
  const { prop, obj, id } = props;
  const [grid, setGrid] = useState<any[]>([]);
  const [shown, setShown] = useState(false);
  const [isModalVisiblePdf, setIsModalVisiblePdf] = useState(false);
  const [urlPdf, setUrlPdf] = useState<any>('');
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
    prop(arrayarchivos);
    //prop.datos(arrayarchivos);
  };

  const onPrevPDF = async (DocumentsSupport: any) => {
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
    console.log(pathFull + ' path');

    setUrlPdf(api.GetUrlPdf(pathFull));
    /**
     * Se despliega el pop up con el pdf dentro
     */
    setIsModalVisiblePdf(true);
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

      <Modal
        title={<p className='text-center text-dark text-uppercase mb-0 titulo modal-dialog-scrollable'>Visualización de pdf</p>}
        visible={isModalVisiblePdf}
        onCancel={() => setIsModalVisiblePdf(false)}
        width={1000}
        okButtonProps={{ hidden: true }}
        cancelText='Cerrar'
      >
        <iframe src={urlPdf} frameBorder='0' scrolling='auto' height='600vh' width='100%'></iframe>
      </Modal>
    </>
  );
};

interface documentosgestion {
  prop: any;
  id: string;
  obj: any;
}
