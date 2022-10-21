import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';



// Componentes

import { ApiService } from 'app/services/Apis.service';
import { ICementerio } from 'app/services/dominio.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import Swal from 'sweetalert2';
import Button from 'antd/es/button';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';

//Redux
import { store } from 'app/redux/app.reducers';

import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import moment from 'moment';
import { Input } from 'antd';

export const EmergenciaSanitaria = ({ props }: any) => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();
  const [selecciono, setselecciono] = useState<boolean>(false);
  const [mensajeEmergencia, setmensajeEmergencia] = useState<string>('');




  const { setStatus } = useStepperForm<any>(form);

  const getListas = useCallback(async () => {
    const Mensaje = await api.getCostante('DD81B078-14F3-49D9-BB99-13A66EACC93F');
    console.log(Mensaje, "/ Mensaje")
    setmensajeEmergencia(Mensaje.valor);
    setselecciono(true);
  }, []);

  useEffect(() => {
    getListas();
  }, []);

  const onSubmit = async (values: any) => {

    const emergencia = values.mensajeemergencia;

    await api.ModificarConstante('DD81B078-14F3-49D9-BB99-13A66EACC93F', emergencia, '0');

    Swal.fire({
      icon: 'success',

      title: 'Mensaje Modificado',
      text: 'Se ha modificado El mensaje de Emergencia exitosamente'
    });
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
            <div className='row justify-content-center'>
              <div className='col-lg-12 col-sm-12 col-md-12 justify-content-center text-center'>
                <p
                  style={{ fontSize: '16px', color: '#3366cc', fontFamily: ' Roboto' }}
                  className='text-uppercase font-weight-bold'
                >
                  Gestionar Mensaje de Emergencia Sanitaria
                </p>
              </div>
            </div>
            {selecciono && (
              <>
                <div className='row mt-5 mr-5'>
                  <div className='col-lg-6 col-md-6 col-sm-12'>
                    <Form.Item
                      label='Mensaje Actual de Emergencia Sanitaria'
                      name='mensajeemergencia'
                      initialValue={mensajeEmergencia}
                      rules={[{ required: true }]}
                    >
                      <Input.TextArea rows={5} maxLength={450} style={{ width: '360px' }} className='textarea' />
                    </Form.Item>
                  </div>
                </div>
                <div>
                  <Actions />
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
