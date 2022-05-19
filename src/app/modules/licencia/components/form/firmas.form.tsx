import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';

import Divider from 'antd/es/divider';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import Upload from 'antd/es/upload';
import Button from 'antd/es/button';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';

//Redux
import { store } from 'app/redux/app.reducers';
import { UploadOutlined } from '@ant-design/icons';

export const GestionFirma = ({ props }: any) => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();
  const [selecciono, setselecciono] = useState<boolean>(false);
  const [l_funcionarios, setl_funcionarios] = useState<any>([]);
  const [nroident, setnroident] = useState<string>('');

  const [emailfun, setemailfun] = useState<string>('');
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);

  const getListas = useCallback(async () => {
    const funcionarios = await api.getFuncionarios();
    setl_funcionarios(funcionarios);
  }, []);

  useEffect(() => {
    getListas();
  }, []);

  const Onchange = async (id: string) => {
    const busqueda = await api.GetInformationUser(id);

    const { email } = busqueda;
    setnroident(busqueda.numeroIdentificacion + '');
    setemailfun(email);
    setselecciono(true);
  };
  const onSubmit = async (values: any) => {
    let idUsuario = l_funcionarios.filter((x: { idPersona: string }) => x.idPersona == values.funcionario)[0]['oid'];
    //getBase64(values.funcionariofirma.file);

    let reader = new FileReader();
    reader.readAsDataURL(values.funcionariofirma.file);
    reader.onload = async function () {
      await api.agregarFirma({
        iD_Usuario: idUsuario,
        firma: reader.result
      });
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
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
          <Divider orientation='left'>Añadir o Modificar Firmas</Divider>
          <Form.Item label='Funcionario' name='funcionario' rules={[{ required: true }]}>
            <SelectComponent options={l_funcionarios} optionPropkey='idPersona' optionPropLabel='fullName' onChange={Onchange} />
          </Form.Item>
          {selecciono && (
            <>
              <Form.Item label={'Número de Identificacion'} name='funcionarioid'>
                <span className='ant-form-text'>{nroident}</span>
              </Form.Item>
              <Form.Item label={'Email'} name='funcionarioemail'>
                <span className='ant-form-text'>{emailfun}</span>
              </Form.Item>
            </>
          )}

          <Form.Item label='Firma' name='funcionariofirma'>
            <Upload name='funcionariofirmaimg' maxCount={1} beforeUpload={() => false} listType='picture' accept='image/*'>
              <Button icon={<UploadOutlined />}>Seleccionar imagen</Button>
            </Upload>
          </Form.Item>
          <div>
            <Actions />
          </div>
        </Form>
      </div>
    </div>
  );
};
interface gestionfirma {
  prop: any;
}
export const KeysForm = ['statustramite', 'observations'];
