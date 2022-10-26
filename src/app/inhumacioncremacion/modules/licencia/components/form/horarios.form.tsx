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

export const HorariosGestion = ({ props }: any) => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();
  const [selecciono, setselecciono] = useState<boolean>(false);
  const [iniciosem, setiniciosem] = useState<any>();
  const [finsem, setfinsem] = useState<any>();
  const [iniciofinde, setiniciofinde] = useState<any>();
  const [finfinde, setfinfinde] = useState<any>();
  const [MensajeHorario, setMensajeHorario] = useState<string>('');



  const { setStatus } = useStepperForm<any>(form);

  const getListas = useCallback(async () => {
    let HoraInicioAtencion_LV = await api.getCostante('5DF03735-503B-4D22-8169-E4FCDD19DA26');
    let HoraFinAtencion_LV = await api.getCostante('818AA32D-C90D-45D0-975F-486D069F7CB1');
    let HoraInicioAtencion_SD = await api.getCostante('CE62162E-5E79-4E05-AEDE-276B6C89D886');
    let HoraFinAtencion_SD = await api.getCostante('A196007F-BCCB-4160-B345-1F8605949E46');
    const Mensaje = await api.getCostante('39CFA0CE-7DD0-4B0C-D7EF-08DAA1635794');

    setMensajeHorario(Mensaje);
    setiniciosem(ObtenerHora(HoraInicioAtencion_LV.valor + ''));
    setfinsem(ObtenerHora(HoraFinAtencion_LV.valor + ''));
    setiniciofinde(ObtenerHora(HoraInicioAtencion_SD.valor + ''));
    setfinfinde(ObtenerHora(HoraFinAtencion_SD.valor + ''));
    setselecciono(true);
  }, []);

  const ObtenerHora = (values: string) => {
    const inicio: number = parseInt(values.substring(0, values.lastIndexOf(':')));
    const fin: number = parseInt(values.substring(values.lastIndexOf(':') + 1, values.length));

    const date = moment
      .utc()
      .hour(inicio) // numbers from 0 to 23
      .minute(fin); // numbers from 0 to 59
    return date;
  };

  const AsignarCero = (values: string) => {
    const inicio: number = parseInt(values.substring(0, values.lastIndexOf(':')));
    const fin: String = values.substring(values.lastIndexOf(':'), values.length);

    let valor = '';
    if (inicio < 10) {
      valor = '0' + inicio + fin;
    } else {
      valor = '' + inicio + fin;
    }

    return valor;
  };
  useEffect(() => {
    getListas();
  }, []);

  const onSubmit = async (values: any) => {
    const iniciolv = AsignarCero(moment(values.iniciosemana).format('LT'));
    const finlv = AsignarCero(moment(values.finsemana).format('LT'));
    const iniciosd = AsignarCero(moment(values.iniciofinsemana).format('LT'));
    const finsd = AsignarCero(moment(values.findesemana).format('LT'));

    const Mensaje = values.mensajehorario;


    await api.ModificarConstante('5DF03735-503B-4D22-8169-E4FCDD19DA26', iniciolv, '0');
    await api.ModificarConstante('818AA32D-C90D-45D0-975F-486D069F7CB1', finlv, '1');
    await api.ModificarConstante('CE62162E-5E79-4E05-AEDE-276B6C89D886', iniciosd, '1');
    await api.ModificarConstante('A196007F-BCCB-4160-B345-1F8605949E46', finsd, '1');
    await api.ModificarConstante('39CFA0CE-7DD0-4B0C-D7EF-08DAA1635794', Mensaje, '1');
    Swal.fire({
      icon: 'success',
      title: 'Horario Modificado',
      text: 'Se han modificado los horarios de atención y el mensaje exitosamente'
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
                  Gestionar Horarios de Atención
                </p>
              </div>
            </div>
            {selecciono && (
              <>
                <div className='row mt-5 mr-5'>
                  <div className='col-lg-6 col-md-6 col-sm-12'>
                    <Form.Item
                      label='Hora de Inicio y fin (Semana)'
                      name='iniciosemana'
                      initialValue={iniciosem}
                      rules={[{ required: true }]}
                    >
                      <DatepickerComponent
                        picker='time'
                        dateDisabledType='default'
                        dateFormatType='time'
                        value={iniciosem}
                        placeholder='-- Elija una hora --'
                      />
                    </Form.Item>
                  </div>
                  <div className='col-lg-6 col-md-6 col-sm-12 '>
                    <Form.Item label='Hasta' name='finsemana' initialValue={finsem} rules={[{ required: true }]}>
                      <DatepickerComponent
                        picker='time'
                        dateDisabledType='default'
                        value={finsem}
                        dateFormatType='time'
                        placeholder='-- Elija una hora --'
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className='row mt-5 mr-5'>
                  <div className='col-lg-6 col-md-6 col-sm-12'>
                    <Form.Item
                      label='Hora de Inicio y fin (Fin de Semana)'
                      initialValue={iniciofinde}
                      name='iniciofinsemana'
                      rules={[{ required: true }]}
                    >
                      <DatepickerComponent
                        picker='time'
                        dateDisabledType='default'
                        value={iniciofinde}
                        dateFormatType='time'
                        placeholder='-- Elija una hora --'
                      />
                    </Form.Item>
                  </div>
                  <div className='col-lg-6 col-md-6 col-sm-12 '>
                    <Form.Item label='Hasta ' name='findesemana' initialValue={finfinde} rules={[{ required: true }]}>
                      <DatepickerComponent
                        picker='time'
                        dateDisabledType='default'
                        value={finfinde}
                        dateFormatType='time'
                        placeholder='-- Elija una hora --'
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className='col-lg-6 col-md-6 col-sm-12'>
                  <Form.Item
                    label='Mensaje Actual de Horario de Atencion'
                    name='mensajehorario'
                    initialValue={MensajeHorario}
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea rows={5} maxLength={200} style={{ width: '360px' }} className='textarea' />
                  </Form.Item>
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
