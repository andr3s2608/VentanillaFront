import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';

import Divider from 'antd/es/divider';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { ApiService } from 'app/services/Apis.service';
import { dominioService, ETipoDominio, IDepartamento, IMunicipio, IDominio, ICementerio } from 'app/services/dominio.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import Swal from 'sweetalert2';
import Button from 'antd/es/button';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';

//Redux
import { store } from 'app/redux/app.reducers';
import { UploadOutlined } from '@ant-design/icons';
import { Input, Radio } from 'antd';

export const ValidarDocumentos = ({ props }: any) => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();
  const [l_cementerios, setl_cementerios] = useState<ICementerio[]>([]);
  const [selecciono, setselecciono] = useState<boolean>(false);

  const [[idTramite, fechasol, numeroid, nombre, numerolic, fechaapsol, estado, tiposoli], setDatos] = useState<
    [string, any, string, string, string, any, string, string]
  >(['', , '', '', '', , '', '']);
  const [codigo, setcodigo] = useState<String>('');
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);

  const getListas = useCallback(async () => {
    const Graveyard = await dominioService.get_cementerios_bogota();
    setl_cementerios(Graveyard);
  }, []);

  useEffect(() => {
    getListas();
  }, []);

  const Regresar = async () => {
    form.resetFields(['nrodocumento']);
    setselecciono(false);
  };

  const BuscarCementerio = async () => {
    const idsol: string = form.getFieldValue('nrodocumento');
    const solicitud = await api.getLicencia(idsol);
    if (idsol == null) {
      Swal.fire({
        icon: 'error',

        title: 'Datos invalidos',
        text: 'No se encontro el código de verificación, por favor verifiquelo '
      });
    } else {
      let valor = '';
      switch (solicitud[0].idTramite) {
        case 'a289c362-e576-4962-962b-1c208afa0273':
          valor = 'Inhumación Indivual';

          break;
        case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
          //inhumacion fetal
          valor = 'Inhumación Fetal';

          break;
        case 'e69bda86-2572-45db-90dc-b40be14fe020':
          //cremacion individual
          valor = 'Cremación Individual';

          break;
        case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
          //cremacionfetal
          valor = 'Cremación Fetal ';

          break;
      }
      const idtram = `El documento con código de verificación ${solicitud[0].iD_Control_Tramite}, se encuentra asociado a la siguiente información:`;

      setDatos([
        solicitud[0].iD_Control_Tramite,
        solicitud[0].fechaSolicitud,
        solicitud[0].resumenSolicitud.numeroDocumentoSolicitante,
        solicitud[0].resumenSolicitud.nombreSolicitante + ' ' + solicitud[0].resumenSolicitud.apellidoSolicitante,
        solicitud[0].resumenSolicitud.numeroLicencia,
        solicitud[0].resumenSolicitud.fechaLicencia,
        'Aprobado y firmado',
        valor
      ]);
      setcodigo(idtram);
    }
    setselecciono(true);
    //form.resetFields(['razon', 'direccion', 'telefono', 'nombrerep', 'tiporep', 'nrorep']);
  };

  const onSubmit = (values: any) => {
    if (selecciono) {
    }
  };

  const onSubmitFailed = () => {
    setStatus('error');
    store.dispatch(SetResetViewLicence());
  };

  const Actions = () => (
    <Form.Item {...layoutWrapper}>
      <div className='container-fluid'>
        <div className='row justify-content-center text-center'>
          <div className='col-lg-12 col-sm-12 col-md-12 text-center mr-5'>
            <Button type='primary' htmlType='submit' className='save'>
              Guardar o Modificar
            </Button>
          </div>
        </div>
      </div>
    </Form.Item>
  );

  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body'>
          <div className='row justify-content-center'>
            <div className='col-lg-12 col-sm-12 col-md-12 justify-content-center text-center'>
              <p
                style={{ fontSize: '16px', color: '#3366cc', fontFamily: ' Roboto' }}
                className='text-uppercase font-weight-bold'
              >
                Validación de Documentos
              </p>
              <p
                style={{ fontSize: '12px', color: '#3366cc', fontFamily: ' Roboto' }}
                className='text-uppercase font-weight-bold'
              >
                En esta sección puede validar la autenticidad del documento emitido por esta entidad. <br /> Por favor digite el
                código de verificación que viene anexo en el documento
              </p>
            </div>
          </div>
          <div className='row mt-5 mr-5'>
            <div className='col-lg-4 col-md-4 col-sm-12'>
              <Form.Item label='Cementerios' name='cementerio'>
                <SelectComponent options={l_cementerios} optionPropkey='RAZON_S' optionPropLabel='RAZON_S' />
              </Form.Item>
            </div>
            <div className='col-lg-8 col-md-8 col-sm-12 '>
              <Button type='primary' onClick={BuscarCementerio}>
                Buscar cementerio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
interface modificarcementerios {
  prop: any;
}
export const KeysForm = ['statustramite', 'observations'];
