import React, { useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Upload from 'antd/es/upload';
import Button from 'antd/es/button';

// Antd Iconos
import { EyeOutlined, UploadOutlined } from '@ant-design/icons';

// Utilidades
import { TypeIndividuo, TypeLicencia } from 'app/shared/utils/types.util';
import { environments } from 'environments/environments';
import { infoMessage } from 'app/services/settings/message.service';

export const DocumentosIndividual: React.FC<IDocumentForm<any>> = (props) => {
  const { tipoLicencia, tipoIndividuo, form } = props;

  let labelDocument = 'Documento del fallecido';
  let nameFileType = 'Documento_del_fallecido';
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

  const instType = form.getFieldValue('instType');
  let validateRequired: boolean = false;
  const validateForm = () => {
    if (tipoLicencia === 'Inhumación' && instType !== 'Otros') {
      validateRequired = true;
    }
  };

  validateForm();

  const { obj, files } = props;
  const isEdit = obj?.idTramite !== undefined;

  const onEventFile = async (fileString: string) => {
    const path = tipoLicencia === 'Cremación' ? 'cremacion' : 'inhumacion';
    const type = tipoIndividuo === 'Fetal' ? 'fetal' : 'individual';

    const [file]: any = files?.filter((p) => p.path.includes(fileString));
    if (file?.path !== undefined) {
      const url = `${environments.blob}Storage/GetBlob/${path}${type}/${file?.path}.pdf`;

      window.open(url, 'descarga');
    }
    if (file?.path === undefined) {
      const confirm = await infoMessage({
        content: '¿No se encontro el archivo solicitado?',
        okType: 'default'
      });
    }
  };

  const isFileViwerDisabled = (fileString: string) => {
    const [file]: any = files?.filter((p) => p.path.includes(fileString));
    return file === undefined;
  };

  //#endregion
  const isOtrosEdit = obj?.instType === '80d7f664-5bdd-48eb-8b2c-93c1bd648cc8';

  const formatBytes = (bytes: any, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  const beforeUploadFile = (file: any): boolean => {
    const mb = formatBytes(file.size);

    if (mb <= '5 MB') {
      file.flag = true;
      return false;
    }
    return true;
  };
  const isEditOtros = () => {
    return isEdit
      ? obj?.instType !== '80d7f664-5bdd-48eb-8b2c-93c1bd648cc8'
      : instType !== '80d7f664-5bdd-48eb-8b2c-93c1bd648cc8';
  };

  return (
    <>
      {files?.length ? (
        <Form.Item
          label='Ver Certificado Defunción'
          name='fileCertificadoDefuncion'
          valuePropName='fileList'
          rules={[{ required: false }]}
        >
          <Button
            type='default'
            shape='round'
            style={{ marginRight: '10px' }}
            icon={<EyeOutlined />}
            size='middle'
            onClick={() => onEventFile('Certificado_Defunción')}
            disabled={isFileViwerDisabled('Certificado_Defunción')}
          >
            Certificado_Defunción.pdf
          </Button>
        </Form.Item>
      ) : null}

      <Form.Item
        label='Certificado Defunción'
        name='fileCertificadoDefuncion'
        valuePropName='fileList'
        rules={[{ required: isEdit ? false : true }]}
        getValueFromEvent={normFile}
      >
        <Upload name='fileCertificadoDefuncion' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
          <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
        </Upload>
      </Form.Item>

      {files?.length ? (
        <Form.Item label={labelDocument} name='fileCCFallecido' valuePropName='fileList' rules={[{ required: false }]}>
          <Button
            type='default'
            shape='round'
            style={{ marginRight: '10px' }}
            icon={<EyeOutlined />}
            size='middle'
            onClick={() => onEventFile(nameFileType)}
            disabled={isFileViwerDisabled(nameFileType)}
          >{`${nameFileType}.pdf`}</Button>
        </Form.Item>
      ) : null}

      <Form.Item
        label={labelDocument}
        name='fileCCFallecido'
        valuePropName='fileList'
        rules={[{ required: isEdit ? false : true }]}
        getValueFromEvent={normFile}
      >
        <Upload name='fileCCFallecido' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
          <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
        </Upload>
      </Form.Item>

      {/* {!isCremacion && <></>} */}
      {isEditOtros() && (
        <>
          {files?.length ? (
            <Form.Item label='Acta Notarial Fiscal' name='fileActaNotarialFiscal' valuePropName='fileList'>
              <Button
                type='default'
                shape='round'
                style={{ marginRight: '10px' }}
                icon={<EyeOutlined />}
                size='middle'
                onClick={() => onEventFile('Acta_Notarial_del_Fiscal')}
                disabled={isFileViwerDisabled('Acta_Notarial_del_Fiscal')}
              >
                Acta_Notarial_del_Fiscal.pdf
              </Button>
            </Form.Item>
          ) : null}
          <Form.Item
            label='Acta Notarial Fiscal'
            name='fileActaNotarialFiscal'
            valuePropName='fileList'
            getValueFromEvent={normFile}
            rules={[{ required: isEdit ? false : true }]}
          >
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
        </>
      )}

      {isCremacion && (
        <>
          {files?.length ? (
            <Form.Item
              label='Ver Autorización de cremación del familiar'
              name='fileAuthCCFamiliar'
              valuePropName='fileList'
              rules={[{ required: isEdit ? false : true }]}
            >
              <Button
                type='default'
                shape='round'
                style={{ marginRight: '10px' }}
                icon={<EyeOutlined />}
                size='middle'
                disabled={isFileViwerDisabled('Autorizacion_de_cremacion_del_familiar')}
                onClick={() => onEventFile('Autorizacion_de_cremacion_del_familiar')}
              />
            </Form.Item>
          ) : null}
          <Form.Item
            label='Autorización de cremación del familiar'
            name='fileAuthCCFamiliar'
            valuePropName='fileList'
            rules={[{ required: isEdit ? false : true }]}
            getValueFromEvent={normFile}
          >
            <Upload name='fileAuthCCFamiliar' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
              <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
            </Upload>
          </Form.Item>

          {files?.length ? (
            <Form.Item
              label='Ver Documento del familiar'
              name='fileAuthCremacion'
              valuePropName='fileList'
              rules={[{ required: isEdit ? false : true }]}
              getValueFromEvent={normFile}
            >
              <Button
                type='default'
                shape='round'
                disabled={isFileViwerDisabled('Documento_del_familiar')}
                style={{ marginRight: '10px' }}
                icon={<EyeOutlined />}
                size='middle'
                onClick={() => onEventFile('Documento_del_familiar')}
              />
            </Form.Item>
          ) : null}

          <Form.Item
            label='Documento del familiar'
            name='fileAuthCremacion'
            valuePropName='fileList'
            rules={[{ required: isEdit ? false : true }]}
            getValueFromEvent={normFile}
          >
            <Upload name='fileAuthCremacion' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
              <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
            </Upload>
          </Form.Item>

          {isEditOtros() && (
            <>
              {files?.length ? (
                <Form.Item
                  label='Ver Autorizacion del fiscal para cremar'
                  name='fileOficioIdentificacion'
                  valuePropName='fileList'
                  rules={[{ required: isEdit ? false : true }]}
                  // extra={<Alert className='mt-2' message='Oficio de identificación fehaciente – Medicina Legal.' type='info' showIcon />}
                  getValueFromEvent={normFile}
                >
                  {' '}
                  <Button
                    type='default'
                    shape='round'
                    disabled={isFileViwerDisabled('Autorizacion_del_fiscal_para_cremar')}
                    style={{ marginRight: '10px' }}
                    icon={<EyeOutlined />}
                    size='middle'
                    onClick={() => onEventFile('Autorizacion_del_fiscal_para_cremar')}
                  />
                </Form.Item>
              ) : null}

              <Form.Item
                label='Autorizacion de cremacion del fiscal'
                name='fileOficioIdentificacion'
                valuePropName='fileList'
                rules={[{ required: isEdit ? false : true }]}
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

              {files?.length ? (
                <Form.Item
                  label='Oficio de medicina legal al fiscal para cremar'
                  name='fileOrdenAuthFiscal'
                  valuePropName='fileList'
                  rules={[{ required: isEdit ? false : true }]}
                  getValueFromEvent={normFile}
                >
                  {' '}
                  <Button
                    type='default'
                    shape='round'
                    disabled={isFileViwerDisabled('Oficio_de_medicina_legal_al_fiscal_para_cremar')}
                    style={{ marginRight: '10px' }}
                    icon={<EyeOutlined />}
                    size='middle'
                    onClick={() => onEventFile('Oficio_de_medicina_legal_al_fiscal_para_cremar')}
                  />
                </Form.Item>
              ) : null}

              <Form.Item
                label='Oficio de medicina legal al fiscal para cremar'
                name='fileOrdenAuthFiscal'
                valuePropName='fileList'
                rules={[{ required: isEdit ? false : true }]}
                getValueFromEvent={normFile}
              >
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
            </>
          )}
        </>
      )}

      {files?.length ? (
        <Form.Item
          label='Otros'
          name='fileOtrosDocumentos'
          valuePropName='fileList'
          rules={[{ required: false }]}
          getValueFromEvent={normFile}
        >
          <Button
            type='default'
            shape='round'
            style={{ marginRight: '10px' }}
            icon={<EyeOutlined />}
            size='middle'
            onClick={() => onEventFile('Otros_Documentos')}
            disabled={isFileViwerDisabled('Otros_Documentos')}
          >{`${'Otros_Documentos'}.pdf`}</Button>
        </Form.Item>
      ) : null}

      <Form.Item
        label='Otros'
        name='fileOtrosDocumentos'
        valuePropName='fileList'
        rules={[{ required: false }]}
        getValueFromEvent={normFile}
      >
        <Upload name='fileOtrosDocumentos' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
          <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
        </Upload>
      </Form.Item>
    </>
  );
};
/*
 {files?.length ? (
        <Form.Item label='Otros' name='fileCCFallecido' valuePropName='fileList' rules={[{ required: false }]}>
          <Button
            type='default'
            shape='round'
            style={{ marginRight: '10px' }}
            icon={<EyeOutlined />}
            size='middle'
            onClick={() => onEventFile(nameFileType)}
            disabled={isFileViwerDisabled(nameFileType)}
          >{`${nameFileType}.pdf`}</Button>
        </Form.Item>
      ) : null}

      <Form.Item label='Otros' name='fileCCFallecido' valuePropName='fileList' getValueFromEvent={normFile}>
        <Upload name='fileCCFallecido' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
          <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
        </Upload>
      </Form.Item>
      */
interface IDocumentForm<T> {
  form: FormInstance<T>;
  tipoLicencia: TypeLicencia;
  tipoIndividuo?: TypeIndividuo;
  obj: any;
  files?: any[];
}
