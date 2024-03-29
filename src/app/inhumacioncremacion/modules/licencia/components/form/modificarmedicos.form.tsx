import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';

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
import { Input } from 'antd';
import moment from 'moment';

export const ModificarMedico = ({ props }: any) => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();
  const [encontro, setEncontro] = useState<boolean>(false);

  const [[nombre, apellidos, tipoid, nroid, fechanac, sitioexp], setmedico] = useState<
    [string, string, string, string, any, string]
  >(['', '', '', '', , '']);

  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);

  const getListas = useCallback(async () => {}, []);

  useEffect(() => {
    getListas();
  }, []);

  const BuscarMedico = async () => {
    const numero: string = form.getFieldValue('numeroid');

    const id = await api.getMedico(numero);

    if (id == null) {
      Swal.fire({
        icon: 'error',

        title: 'Datos inválidos',
        text: 'No se encontró el número de  identificación del medico'
      });
      setEncontro(false);
    } else {
      setmedico([
        id.resultado1[0].NOMBRES + '',
        id.resultado1[0].APELLIDOS + '',
        id.resultado1[0].TIPO_I + '',
        id.resultado1[0].NROIDENT + '',
        moment(id.resultado1[0].FECHA_NACIMIENTO),
        id.resultado1[0].SITIO_EXP_IDENT + ''
      ]);

      form.resetFields(['name', 'tipoid', 'date', 'sitio', 'numeroidform']);
      setEncontro(true);
      //localStorage.setItem('register', JSON.stringify(solicitud));
    }
  };

  const onSubmit = async (values: any) => {
    const valores: string[] = [
      values.tipoid + '',
      values.numeroidform + '',
      values.name + '',
      values.surname + '',
      values.sitio + ''
    ];

    const formatDate = 'yyyy/MM/DD hh:mm:ss';
    const json = {
      tipO_I: valores[0].toUpperCase(),
      nroident: valores[1],
      nombres: valores[2].toUpperCase(),
      apellidos: valores[3].toUpperCase(),
      sitiO_EXP_IDENT: valores[4].toUpperCase(),
      fechA_NACIMIENTO: moment(values.date).format(formatDate)
    };

    await api.UpdateProfesionalesSalud(json, valores[1]);
    setEncontro(false);
    Swal.fire({
      icon: 'success',

      title: 'Profesional de la salud modificado',
      text: 'Se ha modificado el profesional de la salud  exitosamente'
    });
  };

  const onSubmitFailed = () => {
    setStatus('error');
    store.dispatch(SetResetViewLicence());
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
                  Modificar Medicos Oracle
                </p>
              </div>
            </div>
            <div className='row mt-3 justify-content-center text-center'>
              <div className='col-lg-6 col-sm-12 col-md-6'>
                <Form.Item label='Número' name='numeroid'>
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

            <div className='row ml-5'>
              <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
                <Button type='primary' onClick={BuscarMedico}>
                  Buscar Medico
                </Button>
              </div>
            </div>
            {encontro && (
              <>
                <Form.Item
                  label='Tipo de Identificación'
                  name='tipoid'
                  rules={[{ required: true, max: 50 }]}
                  initialValue={tipoid}
                >
                  <Input
                    allowClear
                    placeholder='Tipo de Identificación'
                    autoComplete='off'
                    type='text'
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>
                <Form.Item label='Número de Identificación' name='numeroidform' initialValue={nroid} rules={[{ required: true }]}>
                  <Input
                    allowClear
                    placeholder='Número de Identificación'
                    autoComplete='off'
                    onKeyPress={(event) => {
                      if (!/[0-9a-zA-Z-]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>
                <Form.Item label='Nombres' name='name' rules={[{ required: true, max: 50 }]} initialValue={nombre}>
                  <Input
                    allowClear
                    placeholder='Nombres'
                    autoComplete='off'
                    type='text'
                    onKeyPress={(event) => {
                      if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>
                <Form.Item label='Apellidos' name='surname' rules={[{ required: true, max: 50 }]} initialValue={apellidos}>
                  <Input
                    allowClear
                    placeholder='Apellidos'
                    autoComplete='off'
                    type='text'
                    onKeyPress={(event) => {
                      if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>
                <Form.Item label='Fecha de Nacimiento' name='date' rules={[{ required: true }]} initialValue={fechanac}>
                  <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' value={fechanac} />
                </Form.Item>

                <Form.Item label='Sitio de Expedición' name='sitio' rules={[{ required: true, max: 50 }]} initialValue={sitioexp}>
                  <Input
                    allowClear
                    placeholder='Primer Apellido'
                    autoComplete='off'
                    type='text'
                    onKeyPress={(event) => {
                      if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ ]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>
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
