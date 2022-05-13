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

export const ModificarFuneraria = ({ props }: any) => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();
  const [l_Funeraria, setl_Funeraria] = useState<[]>([]);
  const [selecciono, setselecciono] = useState<boolean>(false);
  const [RazonC, setRazonC] = useState<String>('');
  const [valores, setvalores] = useState<String>('Name');

  const [
    [TipoIdF, DireccionC, TelefonoC, NombreRepC, TipoRepC, NroIdenC, NombrePropC, TipoPropC, NroIdenPropC, NroSalas],
    setFunerariaDatos
  ] = useState<[string, string, string, string, string, string, string, string, string, string]>([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  ]);

  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);

  const getListas = useCallback(async () => {
    const Graveyard = await api.GetFunerarias();
    setl_Funeraria(Graveyard);
  }, []);

  useEffect(() => {
    getListas();
  }, []);

  const BuscarCementerio = async () => {
    const funeraria: string = form.getFieldValue('funeraria');
    const id = form.getFieldValue('funerariaid');

    if (funeraria == undefined && (id == undefined || id == '')) {
      setselecciono(false);
      Swal.fire({
        icon: 'error',
        title: 'Datos invalidos',
        text: 'Debe seleccionar una funeraria o ingresar un numero de funeraria'
      });
    } else {
      if (valores == 'Name') {
        const valor: string = funeraria;
        const all = await api.GetFunerarias();

        const result = all.find((funeraria: any) => funeraria.RAZON_S == valor);
        if (result) {
          setFunerariaDatos([
            result.TIPO_I + '',
            result.DIRECCION + '',
            result.TELEFONO_1 + '',
            result.NOMBRE_REP + '',
            result.TIPO_I_REP + '',
            result.NROIDENT_REP + '',
            result.NOMBRE_PROP + '',
            result.TIPO_I_PROP + '',
            result.NROIDENT_PROP + '',
            result.NUM_SALAS + ''
          ]);
          setselecciono(true);
          setRazonC(result.RAZON_S + '');
        }
      } else {
        const valor: string = id;
        const all = await api.GetFunerarias();
        const result = all.find((funeraria: any) => funeraria.NROIDENT == parseInt(valor));
        if (result) {
          setFunerariaDatos([
            result.TIPO_I + '',
            result.DIRECCION + '',
            result.TELEFONO_1 + '',
            result.NOMBRE_REP + '',
            result.TIPO_I_REP + '',
            result.NROIDENT_REP + '',
            result.NOMBRE_PROP + '',
            result.TIPO_I_PROP + '',
            result.NROIDENT_PROP + '',
            result.NUM_SALAS + ''
          ]);
          setRazonC(result.RAZON_S + '');
          setselecciono(true);
        } else {
          setselecciono(false);
          Swal.fire({
            icon: 'error',
            title: 'Datos invalidos',
            text: 'No se encontro la funeraria solicitada'
          });
        }
      }

      form.resetFields([
        'tipoidf',
        'razon',
        'direccion',
        'telefono',
        'nombreprop',
        'tipoprop',
        'nroprop',
        'nrosalas',
        'nombrerep',
        'tiporep',
        'nrorep'
      ]);
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
          <Divider orientation='left'>Modificar Funeraria</Divider>
          <p>Buscar por:</p>
          <Radio.Group onChange={changeRadioButton} defaultValue={'Name'}>
            <Radio value='Name'>Nombre de la Funeraria</Radio>
            <Radio value='Id'>No. Identificación</Radio>
          </Radio.Group>
          <p></p>
          <div className='row'>
            <div className='col-6 '>
              <Form.Item label='Funerarias' name='funeraria'>
                <SelectComponent options={l_Funeraria} optionPropkey='RAZON_S' optionPropLabel='RAZON_S' />
              </Form.Item>
            </div>
            <div className='col-6'>
              <Form.Item label='Número de Funeraria' name='funerariaid'>
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
              <Form.Item label='Tipo Id Funeraria' initialValue={TipoIdF} name='tipoidf'>
                <Input
                  allowClear
                  placeholder='Razón Social'
                  autoComplete='off'
                  value={TipoIdF + ''}
                  onKeyPress={(event) => {
                    if (!/[a-zA-Z]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                />
              </Form.Item>

              <Form.Item label='Razon S' initialValue={RazonC} name='razon'>
                <Input
                  allowClear
                  placeholder='Razón Social'
                  autoComplete='off'
                  value={RazonC + ''}
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
              <Form.Item label='Nombre Propietario ' initialValue={NombrePropC} name='nombreprop'>
                <Input
                  allowClear
                  value={NombrePropC}
                  placeholder='Nombre Propietario'
                  autoComplete='off'
                  onKeyPress={(event) => {
                    if (!/[a-zA-Z ]]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                />
              </Form.Item>
              <Form.Item label='Tipo Documento Propietario ' initialValue={TipoPropC} name='tipoprop'>
                <Input
                  allowClear
                  value={TipoPropC}
                  placeholder='Tipo Documento Propietario'
                  autoComplete='off'
                  onKeyPress={(event) => {
                    if (!/[a-zA-Z ]]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                />
              </Form.Item>
              <Form.Item label='Nro Documento Propietario ' initialValue={NroIdenPropC} name='nroprop'>
                <Input
                  allowClear
                  placeholder='Nro Documento Propietario'
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
              <Form.Item label='Nro SalasFuneraria ' initialValue={NroSalas} name='nrosalas'>
                <Input
                  allowClear
                  placeholder='Nro Salas Funeraria'
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
                    if (!/[a-zA-Z ]]/.test(event.key)) {
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
                    if (!/[a-zA-Z ]]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                />
              </Form.Item>
              <Form.Item label='Nro Documento Representante ' initialValue={NroIdenC} name='nrorep'>
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
