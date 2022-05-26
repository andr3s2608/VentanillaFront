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
    if (idsol == undefined || idsol == '' || idsol == ' ') {
      Swal.fire({
        icon: 'error',

        title: 'Datos invalidos',
        text: 'Debe Ingresar un Codigo de Verificación'
      });
    } else {
      const getidtramite = await api.Obteneridcontroltramite(idsol);

      if (getidtramite == null) {
        Swal.fire({
          icon: 'error',

          title: 'Datos invalidos',
          text: 'No se encontro el código de verificación, por favor verifiquelo '
        });
      } else {
        const getidsol = await api.ObtenerSolicitud(getidtramite.idControlTramite, 'tramite');

        const solicitud = await api.getLicencia(getidsol);
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
        setselecciono(true);
      }
    }

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
          <Form form={form} {...layoutItems} layout='horizontal' onFinish={onSubmit} onFinishFailed={onSubmitFailed}>
            {!selecciono && (
              <>
                <div className='row justify-content-center'>
                  <div className='col-lg-12 col-sm-12 col-md-12 justify-content-center text-center'>
                    <p
                      style={{
                        fontSize: '16px',
                        color: '#3366cc',
                        fontFamily: ' Roboto'
                      }}
                      className='text-uppercase font-weight-bold'
                    >
                      Validación de Documentos
                    </p>
                  </div>
                </div>
                <div className='row justify-content-center'>
                  <div className='col-lg-12 col-sm-12 col-md-12 justify-content-center text-center'>
                    <p
                      style={{
                        fontSize: '13px',
                        color: '#3366cc',
                        fontFamily: ' Roboto'
                      }}
                      className='text-uppercase font-weight-bold'
                    >
                      En esta sección puede validar la autenticidad del documento emitido por esta entidad. <br /> Por favor
                      digite el código de verificación que viene anexo en el documento
                    </p>
                  </div>
                </div>
                <div className='row mt-3 d-flex justify-content-center'>
                  <div className='col-lg-6 col-sm-12'>
                    <Form.Item name='nrodocumento'>
                      <Input
                        className=' center-block'
                        allowClear
                        placeholder='Ingrese el Código de Verificación'
                        autoComplete='off'
                        onKeyPress={(event) => {
                          if (!/[0-9a-zA-Z]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className='row mt-3 justify-content-center text-center'>
                  <Button type='primary' onClick={BuscarCementerio}>
                    Consultar
                  </Button>
                </div>
              </>
            )}
            {selecciono && (
              <>
                <Form.Item name='codigo'>
                  <span className='ant-form-text'>{codigo}</span>
                </Form.Item>

                <Form.Item label='ID Trámite' name='idtramite'>
                  <span className='ant-form-text'>{idTramite}</span>
                </Form.Item>
                <Form.Item label='Fecha de Solicitud ' initialValue={fechasol} name='fecsol'>
                  <span className='ant-form-text'>{fechasol}</span>
                </Form.Item>
                <Form.Item label='Numero de Identificación ' initialValue={numeroid} name='telefono'>
                  <span className='ant-form-text'>{numeroid}</span>
                </Form.Item>
                <Form.Item label='Nombres y Apellidos Solicitante ' initialValue={nombre} name='nombresol'>
                  <span className='ant-form-text'>{nombre}</span>
                </Form.Item>
                <Form.Item label='Nro de Licencia ' initialValue={numerolic} name='tiporep'>
                  <span className='ant-form-text'>{numerolic}</span>
                </Form.Item>
                <Form.Item label='Fecha de Licencia ' initialValue={fechaapsol} name='fecapsol'>
                  <span className='ant-form-text'>{fechaapsol}</span>
                </Form.Item>
                <Form.Item label='Estado del Trámite ' initialValue={estado} name='estado'>
                  <span className='ant-form-text'>{estado}</span>
                </Form.Item>
                <Form.Item label='Tipo de Trámite ' initialValue={tiposoli} name='tipotram'>
                  <span className='ant-form-text'>{tiposoli}</span>
                </Form.Item>
                <div className='row justify-content-center'>
                  <div className='row ml-5'>
                    <div className='col-lg-12 col-sm-12 col-md-12'>
                      <Button type='primary' onClick={Regresar}>
                        Regresar
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};
interface modificarcementerios {
  prop: any;
}
export const KeysForm = ['statustramite', 'observations'];
