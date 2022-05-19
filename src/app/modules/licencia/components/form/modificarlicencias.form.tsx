import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Divider from 'antd/es/divider';

//paginas licencias
import { IndividualForm } from 'app/modules/licencia/components/form/individual.form';
import { FetalForm } from 'app/modules/licencia/components/form/fetal.form';

// Componentes

import { ApiService } from 'app/services/Apis.service';

import { authProvider } from 'app/shared/utils/authprovider.util';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import Swal from 'sweetalert2';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import Button from 'antd/es/button';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';

//Redux
import { store } from 'app/redux/app.reducers';
import { UploadOutlined } from '@ant-design/icons';
import { Input, Radio, Switch } from 'antd';
import moment from 'moment';

export const ModificarLicencia = ({ props }: any) => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();

  const [licencia, setLicencia] = useState<boolean>(false);
  const [valores, setvalores] = useState<string>('tramite');
  const [date, setDate] = useState<any>();
  const [time, setTime] = useState<any>();
  const [sexo, setsexo] = useState<any>();
  const [[primerNombre, segundoNombre, primerApellido, segundoApellido], setnombres] = useState<[string, string, string, string]>(
    ['', '', '', '']
  );

  const [certificado, setcertificado] = useState<any>();
  const [isHora, setIsHora] = useState<boolean>(true);
  const [check, setcheck] = useState<boolean>(true);

  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);

  const getListas = useCallback(async () => {}, []);

  useEffect(() => {
    getListas();
  }, []);

  const BuscarSolicitud = async () => {
    const numero: string = form.getFieldValue('numero');
    const id = await api.ObtenerSolicitud(numero, valores);
    console.log(id, ' id');
    if (id == null) {
      Swal.fire({
        icon: 'error',

        title: 'Datos invalidos',
        text: 'No se encontro el número de ' + valores + ', por favor verifiquelo de nuevo'
      });
    } else {
      const solicitud = await api.getLicencia(id);

      setcertificado(solicitud[0].numeroCertificado);
      setDate(moment(solicitud[0].fechaDefuncion));
      setcheck(solicitud[0].sinEstablecer);
      setTime(solicitud[0].hora);
      setsexo(solicitud[0].idSexo);

      setnombres(solicitud[0].persona[0]);

      if (solicitud[0]) console.log(solicitud[0].idTramite);
      //localStorage.setItem('register', JSON.stringify(solicitud));
    }
  };

  const changeRadioButton = (values: any) => {
    setvalores(values.target.value);
  };

  const onSubmit = (values: any) => {};

  const onSubmitFailed = () => {
    setStatus('error');
    store.dispatch(SetResetViewLicence());
  };

  const onChangeSwitch = (check: any) => {
    setIsHora(!check);
  };

  const Actions = () => (
    <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
      <div className='d-flex justify-content-between'>
        <Button type='primary' htmlType='submit'>
          Guardar o Modificar
        </Button>
      </div>
    </Form.Item>
  );

  return (
    <div className='card card-body py-5 mb-4 fadeInTop'>
      <div className='d-lg-flex align-items-start'>
        <Form
          form={form}
          className='mb-4 w-100'
          {...layoutItems}
          style={{ maxWidth: 800 }}
          layout='horizontal'
          onFinish={onSubmit}
          onFinishFailed={onSubmitFailed}
        >
          <Divider orientation='left'>Modificar Licencia</Divider>
          <p>Buscar por:</p>
          <Radio.Group onChange={changeRadioButton} defaultValue={'tramite'}>
            <Radio value='tramite'>Número de tramite</Radio>
            <Radio value='certificado'>Número de Certificado</Radio>
          </Radio.Group>
          <p></p>
          <div className='row'>
            <div className='col-6'>
              <Form.Item label='Número' name='numero'>
                <Input
                  allowClear
                  placeholder='Número'
                  autoComplete='off'
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                />
              </Form.Item>
            </div>
          </div>
          <Button type='primary' onClick={BuscarSolicitud}>
            Buscar Solicitud
          </Button>
          {licencia && (
            <>
              <Form.Item label='Número de Certificado' name='numerocert' rules={[{ required: true }]} initialValue={certificado}>
                <Input
                  allowClear
                  placeholder='Número de Certificado'
                  autoComplete='off'
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                />
              </Form.Item>
              <Form.Item label='Fecha de Fallecimiento' name='dateofdeath' rules={[{ required: true }]} initialValue={date}>
                <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' value={date} />
              </Form.Item>
              <Form.Item label='Sin Establecer' name='check'>
                <Switch onChange={onChangeSwitch} defaultChecked={check} />
              </Form.Item>
              {isHora && (
                <Form.Item label='Hora' name='time' rules={[{ required: isHora }]} initialValue={time}>
                  <DatepickerComponent
                    picker='time'
                    dateDisabledType='default'
                    dateFormatType='time'
                    value={time}
                    placeholder='-- Elija una hora --'
                  />
                </Form.Item>
              )}
              <Form.Item label='Sexo' name='sex' initialValue={sexo} rules={[{ required: true }]}>
                <Radio.Group>
                  <Radio value='259cf2da-6175-4dba-bd55-62723adf0dfa'>MASCULINO</Radio>
                  <Radio value='11c463f3-8135-4545-b58f-3fc748edde94'>FEMENINO</Radio>
                  <Radio value='0347ea5e-691e-44a0-87a5-b22d39f1ff94'>INDETERMINADO</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label='Primer Apellido' name='surname' rules={[{ required: true, max: 50 }]}>
                <Input
                  allowClear
                  placeholder='Primer Apellido'
                  autoComplete='off'
                  type='text'
                  onKeyPress={(event) => {
                    if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                />
              </Form.Item>
              <Form.Item label='Segundo Apellido' name='secondSurname' rules={[{ required: false, max: 50 }]}>
                <Input
                  allowClear
                  placeholder='Segundo Apellido'
                  autoComplete='off'
                  type='text'
                  onKeyPress={(event) => {
                    if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                />
              </Form.Item>
            </>
          )}
        </Form>
      </div>
    </div>
  );
};
interface modificarcementerios {
  prop: any;
}
export const KeysForm = ['statustramite', 'observations'];
