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

export const ModificarCementerio = ({ props }: any) => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();
  const [l_cementerios, setl_cementerios] = useState<ICementerio[]>([]);
  const [selecciono, setselecciono] = useState<boolean>(false);
  const [RazonC, setRazonC] = useState<String>('');
  const [valores, setvalores] = useState<String>('Name');

  const [[DireccionC, TipoI, NroIdenCE, TelefonoC, NombreRepC, TipoRepC, NroIdenP, Telefono2, Cremacion], setCementerioDatos] =
    useState<[string, string, string, string, string, string, string, string, string]>(['', '', '', '', '', '', '', '', '']);

  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);

  const getListas = useCallback(async () => {
    const Graveyard = await dominioService.get_cementerios_bogota();
    setl_cementerios(Graveyard);
  }, []);

  useEffect(() => {
    getListas();
  }, []);

  const BuscarCementerio = async () => {
    const cementerio: string = form.getFieldValue('cementerio');
    const id = form.getFieldValue('cementerioid');

    if (cementerio == undefined && (id == undefined || id == '')) {
      setselecciono(false);
      Swal.fire({
        icon: 'error',
        title: 'Datos inválidos',
        text: 'Debe seleccionar un cementerio o ingresar un numero de cementerio'
      });
    } else {
      if (valores == 'Name') {
        const valor: string = cementerio;
        const all = await api.GetAllcementerios();

        const result = all.find((cementerio: any) => cementerio.RAZON_S == valor);
        if (result) {
          setCementerioDatos([
            result.DIRECCION + '',
            result.TIPO_I + '',
            result.NROIDENT + '',
            result.TELEFONO_1 + '',
            result.NOMBRE_REP + '',
            result.TIPO_I_REP + '',
            result.NROIDENT_REP + '',
            result.TELEFONO_2 + '',
            result.CREMACION + ''
          ]);
          setselecciono(true);
          setRazonC(result.RAZON_S + '');
        }
      } else {
        const valor: string = id;
        const all = await api.GetAllcementerios();
        const result = all.find((cementerio: any) => cementerio.NROIDENT == parseInt(valor));
        if (result) {
          setCementerioDatos([
            result.DIRECCION + '',
            result.TIPO_I + '',
            result.NROIDENT + '',
            result.TELEFONO_1 + '',
            result.NOMBRE_REP + '',
            result.TIPO_I_REP + '',
            result.NROIDENT_REP + '',
            result.TELEFONO_2 + '',
            result.CREMACION + ''
          ]);
          setRazonC(result.RAZON_S + '');
          setselecciono(true);
        } else {
          setselecciono(false);
          Swal.fire({
            icon: 'error',
            title: 'Datos inválidos',
            text: 'No se encontró el cementerio solicitado'
          });
        }
      }

      form.resetFields(['razon', 'direccion', 'telefono', 'nombrerep', 'tiporep', 'nrorep']);
    }
  };

  const changeRadioButton = (values: any) => {
    setvalores(values.target.value);

    if (values.target.value + '' == 'Name') {
      form.setFieldsValue({ cementerioid: undefined });
    }

    form.resetFields(['razon', 'direccion', 'telefono', 'nombrerep', 'tiporep', 'nrorep']);
    setselecciono(false);
  };

  const onSubmit = async (values: any) => {
    if (selecciono) {
      const valores: string[] = [
        NroIdenCE,
        TipoI,
        values.razon + '',
        values.direccion + '',
        values.telefono + '',
        values.tiporep + '',
        values.nroRep + '',
        Telefono2,
        Cremacion
      ];

      const json = {
        nroident: valores[0],
        tipO_I: valores[1],
        razoN_S: valores[2].toUpperCase(),
        direccion: valores[3].toUpperCase(),
        telefonO_1: valores[4].toUpperCase(),
        tipO_I_REP: valores[5].toUpperCase(),
        nroidenT_REP: valores[6].toUpperCase(),
        nombrE_REP: valores[7].toUpperCase(),
        telefonO_2: valores[8],
        cremacion: valores[9]
      };

      await api.UpdateCementerios(json, NroIdenCE);
      setselecciono(false);
      Swal.fire({
        icon: 'success',

        title: 'Cementerio Modificado',
        text: 'Se ha modificado el Cementerio exitosamente'
      });
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
            <div className='row justify-content-center'>
              <div className='col-lg-12 col-sm-12 col-md-12 justify-content-center text-center'>
                <p
                  style={{ fontSize: '16px', color: '#3366cc', fontFamily: ' Roboto' }}
                  className='text-uppercase font-weight-bold'
                >
                  Modificar Cementerio Oracle
                </p>
              </div>
            </div>
            <div className='row mt-3 justify-content-center text-center'>
              <div className='col-lg-12 col-sm-12 col-md-12'>
                <p style={{ fontSize: '16px', color: '#000', fontFamily: ' Roboto' }}>Buscar por:</p>
                <Radio.Group onChange={changeRadioButton} defaultValue={'Name'}>
                  <Radio value='Name'>Nombre del Cementerio</Radio>
                  <Radio value='Id'>No. Identificación</Radio>
                </Radio.Group>
              </div>
            </div>

            <div className='row mt-5 mr-5'>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <Form.Item label='Cementerios' name='cementerio'>
                  <SelectComponent options={l_cementerios} optionPropkey='RAZON_S' optionPropLabel='RAZON_S' />
                </Form.Item>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12 '>
                <Form.Item label='No. Cementerio' name='cementerioid'>
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
                <Button type='primary' onClick={BuscarCementerio}>
                  Buscar cementerio
                </Button>
              </div>
            </div>

            {selecciono && (
              <>
                <Form.Item label='Razon S' initialValue={RazonC} rules={[{ required: true }]} name='razon'>
                  <Input
                    allowClear
                    placeholder='Razón Social'
                    autoComplete='off'
                    value={RazonC + ''}
                    defaultValue={RazonC + ''}
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
                <Form.Item label='Dirección ' initialValue={DireccionC} rules={[{ required: true }]} name='direccion'>
                  <Input
                    allowClear
                    value={DireccionC}
                    placeholder='Dirección'
                    autoComplete='off'
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z0-9#-]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>
                <Form.Item label='Telefono ' initialValue={TelefonoC} rules={[{ required: true }]} name='telefono'>
                  <Input
                    allowClear
                    value={TelefonoC}
                    placeholder='Telefono'
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

                <Form.Item
                  label='Tipo Documento Representante '
                  initialValue={TipoRepC}
                  rules={[{ required: true }]}
                  name='tiporep'
                >
                  <Input
                    allowClear
                    value={TipoRepC}
                    placeholder='Tipo Documento Representante'
                    autoComplete='off'
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
                <Form.Item
                  label='Nro Documento Representante '
                  initialValue={NroIdenP}
                  rules={[{ required: true }]}
                  name='nroRep'
                >
                  <Input
                    allowClear
                    placeholder='Nro Documento Representante'
                    autoComplete='off'
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Form.Item>
                <Form.Item label='Nombre Representante ' initialValue={NombreRepC} rules={[{ required: true }]} name='nombrerep'>
                  <Input
                    allowClear
                    value={NombreRepC}
                    placeholder='Nombre Representante'
                    autoComplete='off'
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
