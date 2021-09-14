import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import Radio, { RadioChangeEvent } from 'antd/es/radio';
import Divider from 'antd/es/divider';

// Utilidades
import { authProvider } from 'app/shared/utils/authprovider.util';
import { ApiService } from 'app/services/Apis.service';
import { IinformatioUser } from 'app/Models/IInformatioUser';

export const SolicitudInfoFormSeccion: React.FC<ISolicitudInfoProps<any>> = (props) => {
  const { name } = authProvider.getAccount();
  const [user, setUser] = useState<IinformatioUser>();

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const [isOtherParentesco, setIsOtherParentesco] = useState(false);
  const onChangeParentesco = (e: RadioChangeEvent) => {
    props.form.resetFields(['solicitudOtherParentesco']);
    setIsOtherParentesco(e.target.value === 'Otro');
  };

  const getListas = useCallback(
    async () => {
      const idUser = await api.getCodeUser();
      const resp = await api.GetInformationUser(idUser);

      setUser(resp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* NOTE: [2021-06-12] Se debe conectar un servicio para cargar el tipo de usuario autenticado y colocar la información segun el usuario autenticado. */
  /* TODO: [2021-06-12] Determinar si es usuario cliente o funcionario. */
  return (
    true && (
      <>
        <Divider orientation='right'>Datos del Solicitante</Divider>
        {/* TODO: [2021-06-12] Determinar si es persona natural o jurídica. */}
        {false ? (
          <>
            <Form.Item label='Identificación' name='solicitudID'>
              <span className='ant-form-text'>CÉDULA DE CIUDADANÍA (CC): 1234567890</span>
            </Form.Item>
            <Form.Item label='Nombres y Apellidos' name='solicitudName'>
              <span className='ant-form-text'>{name.toUpperCase()}</span>
            </Form.Item>
            <Form.Item
              label='Parentesco'
              name='solicitudParentesco'
              initialValue='Cónyuge (Compañero/a Permanente)'
              rules={[{ required: true }]}
            >
              <Radio.Group onChange={onChangeParentesco}>
                <Radio value='Cónyuge (Compañero/a Permanente)'>Cónyuge (Compañero/a Permanente)</Radio>
                <br />
                <Radio value='Abuelo/a'>Abuelo/a</Radio>
                <br />
                <Radio value='Hermano/a'>Hermano/a</Radio>
                <br />
                <Radio value='Hijo/a'>Hijo/a</Radio>
                <br />
                <Radio value='Nieto/a'>Nieto/a</Radio>
                <br />
                <Radio value='Padre / Madre'>Padre / Madre</Radio>
                <br />
                <Radio value='Otro'>Otro</Radio>
              </Radio.Group>
            </Form.Item>
            {isOtherParentesco && (
              <Form.Item
                className='fadeInRight'
                label='Otro... ¿Cúal?'
                name='solicitudOtherParentesco'
                rules={[{ required: true }]}
              >
                <Input allowClear placeholder='Especifique el Parentesco' autoComplete='off' />
              </Form.Item>
            )}
          </>
        ) : (
          <>
            <Form.Item label='Razón Social' name='solicitudRazonSocial'>
              <span className='ant-form-text'>{user?.razonSocial.toUpperCase()}</span>
            </Form.Item>
            {/*   <Form.Item label='Representante Legal' name='solicitudRepresentanteLegal'>
              <span className='ant-form-text'>{name.toUpperCase()}</span>
            </Form.Item> */}
            <Form.Item label='Identificación del Tramitador' name='solicitudIDTramitador'>
              <span className='ant-form-text'>{user?.numeroIdentificacion}</span>
            </Form.Item>
            <Form.Item label='Nombres y Apellidos del Tramitador' name='solicitudIDTramitador'>
              <span className='ant-form-text'>{user?.fullName.toUpperCase()}</span>
            </Form.Item>
          </>
        )}
      </>
    )
  );
};

export const KeysForm = ['solicitudParentesco', 'solicitudOtherParentesco'];

interface ISolicitudInfoProps<T> {
  form: FormInstance<T>;
}
