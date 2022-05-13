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

  const [[DireccionC, TelefonoC, NombreRepC, TipoRepC, NroIdenC], setCementerioDatos] = useState<
    [string, string, string, string, string]
  >(['', '', '', '', '']);

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
        title: 'Datos invalidos',
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
            result.TELEFONO_1 + '',
            result.NOMBRE_REP + '',
            result.TIPO_I_REP + '',
            result.NROIDENT_REP + ''
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
            result.TELEFONO_1 + '',
            result.NOMBRE_REP + '',
            result.TIPO_I_REP + '',
            result.NROIDENT_REP + ''
          ]);
          setRazonC(result.RAZON_S + '');
          setselecciono(true);
        } else {
          setselecciono(false);
          Swal.fire({
            icon: 'error',
            title: 'Datos invalidos',
            text: 'No se encontro el cementerio solicitado'
          });
        }
      }

      form.resetFields(['razon', 'direccion', 'telefono', 'nombrerep', 'tiporep', 'nrorep']);
    }
  };

  const changeRadioButton = (values: any) => {
    setvalores(values.target.value);
  };

  const onSubmit = (values: any) => {
    if (selecciono) {
      console.log(values.razon);
    }
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
          <Divider orientation='left'>Modificar Cementerio</Divider>
          <p>Buscar por:</p>
          <Radio.Group onChange={changeRadioButton} defaultValue={'Name'}>
            <Radio value='Name'>Nombre del Cementerio</Radio>
            <Radio value='Id'>No. Identificación</Radio>
          </Radio.Group>
          <p></p>
          <div className='row'>
            <div className='col-6 '>
              <Form.Item label='Cementerios' name='cementerio'>
                <SelectComponent options={l_cementerios} optionPropkey='RAZON_S' optionPropLabel='RAZON_S' />
              </Form.Item>
            </div>
            <div className='col-6'>
              <Form.Item label='Número de Cementerio' name='cementerioid'>
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

          <Button type='primary' onClick={BuscarCementerio}>
            Buscar cementerio
          </Button>

          {selecciono && (
            <>
              <Form.Item label='Razon S' initialValue={RazonC} name='razon'>
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
              <Form.Item label='Dirección ' initialValue={DireccionC} name='direccion'>
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
              <Form.Item label='Telefono ' initialValue={TelefonoC} name='telefono'>
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
              <Form.Item label='Nombre Representante ' initialValue={NombreRepC} name='nombrerep'>
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
              <Form.Item label='Tipo Documento Representante ' initialValue={TipoRepC} name='tiporep'>
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
              <Form.Item label='Nro Documento Representante ' initialValue={NroIdenC} name='nroRep'>
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
            </>
          )}

          <div>
            <Actions />
          </div>
        </Form>
      </div>
    </div>
  );
};
interface modificarcementerios {
  prop: any;
}
export const KeysForm = ['statustramite', 'observations'];
