import React, { useEffect, useState } from 'react';

// Antd
import Form from 'antd/es/form';
import Alert from 'antd/es/alert';
import Upload from 'antd/es/upload';
import Button from 'antd/es/button';

// Antd Iconos
import { UploadOutlined } from '@ant-design/icons';

// Utilidades
import { ITipoLicencia } from 'app/shared/utils/types.util';

export const DocumentosFormSeccion: React.FC<ITipoLicencia> = (props) => {
  const { tipoLicencia, tipoIndividuo } = props;

  const [isCremacion, setIsCremacion] = useState(false);
  const [isFetal, setIsFetal] = useState(false);
  useEffect(() => {
    setIsCremacion(tipoLicencia === 'Cremación');
    setIsFetal(tipoIndividuo === 'Fetal');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoLicencia]);

  //#region Eventos control de archivos.

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  //#endregion

  return (
    <>
      <Form.Item
        label='Certificado Defunción'
        name='fileCertificadoDefuncion'
        valuePropName='fileList'
        rules={[{ required: true }]}
        getValueFromEvent={normFile}
      >
        <Upload name='fileCertificadoDefuncion' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
          <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        label='Documento del fallecido'
        name='fileCCFallecido'
        valuePropName='fileList'
        rules={[{ required: true }]}
        getValueFromEvent={normFile}
      >
        <Upload name='fileCCFallecido' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
          <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
        </Upload>
      </Form.Item>

      {/* {!isCremacion && <></>} */}

      <Form.Item
        label='Otros Documentos'
        name='fileOtrosDocumentos'
        valuePropName='fileList'
        rules={[{ required: true }]}
        getValueFromEvent={normFile}
      >
        <Upload name='fileAuthCremacion' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
          <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
        </Upload>
      </Form.Item>

      {isCremacion && (
        <>
          <Form.Item
            label='Autorizacion de cremacion del familiar'
            name='fileAuthCCFamiliar'
            valuePropName='fileList'
            rules={[{ required: true }]}
            getValueFromEvent={normFile}
          >
            <Upload name='fileAuthCCFamiliar' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
              <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label='Documento del familiar'
            name='fileAuthCremacion'
            valuePropName='fileList'
            rules={[{ required: true }]}
            getValueFromEvent={normFile}
          >
            <Upload name='fileAuthCremacion' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
              <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label='Autorizacion del fiscal para cremar'
            name='fileOficioIdentificacion'
            valuePropName='fileList'
            // extra={<Alert className='mt-2' message='Oficio de identificación fehaciente – Medicina Legal.' type='info' showIcon />}
            getValueFromEvent={normFile}
          >
            <Upload
              name='fileOficioIdentificacion'
              maxCount={1}
              beforeUpload={() => false}
              listType='text'
              accept='application/pdf'
            >
              <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label='Oficio de medicina legal al fiscal para cremar'
            name='fileOrdenAuthFiscal'
            valuePropName='fileList'
            getValueFromEvent={normFile}
          >
            <Upload name='fileOrdenAuthFiscal' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
              <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
            </Upload>
          </Form.Item>
        </>
      )}

      <Form.Item
        label='Acta Notarial del Fiscal'
        name='fileActaNotarialFiscal'
        valuePropName='fileList'
        getValueFromEvent={normFile}
      >
        <Upload name='fileActaNotarialFiscal' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
          <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
        </Upload>
      </Form.Item>
    </>
  );
};
