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
import { DocumentosIndividual } from './documentos/DocumentoIndividual';
import { DocumentosFetal } from './documentos/DocumentoIFetal';

export const DocumentosFormSeccion: React.FC<IDocumentForm<any>> = (props) => {
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
      if (tipoIndividuo === 'Fetal') {
        validateRequired = false;
      }
    }
  };

  validateForm();

  if (
    (tipoLicencia === 'Inhumación' && tipoIndividuo === 'Fetal') ||
    (tipoLicencia === 'Cremación' && tipoIndividuo === 'Fetal')
  ) {
    labelDocument = 'Documento de la Madre';
    nameFileType = 'Documento_de_la_Madre';
  }

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

  const viewChange = () => {
    if (tipoIndividuo === 'Fetal') {
      return <DocumentosFetal obj={obj} tipoLicencia={tipoLicencia} tipoIndividuo='Individual' form={form} />;
    }
    if (tipoIndividuo === 'Individual') {
      return <DocumentosIndividual obj={obj} tipoLicencia={tipoLicencia} tipoIndividuo='Individual' form={form} />;
    }
  };

  return <>{viewChange()}</>;
};

interface IDocumentForm<T> {
  form: FormInstance<T>;
  tipoLicencia: TypeLicencia;
  tipoIndividuo?: TypeIndividuo;
  obj: any;
  files?: any[];
}
