import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import Radio, { RadioChangeEvent } from 'antd/es/radio';
import Divider from 'antd/es/divider';

// Utilidades
import { authProvider } from 'app/shared/utils/authprovider.util';
import { ApiService } from 'app/services/Apis.service';
import { IinformatioUser } from 'app/inhumacioncremacion/Models/IInformatioUser';

// Componentes

export const SolicitudInfoFormSeccion: React.FC<ISolicitudInfoProps<any>> = (props) => {
  const { name } = authProvider.getAccount();
  const [nroiden, setNroiden] = useState<any>();
  const [user, setUser] = useState<IinformatioUser>({
    tipoIdentificacion: 0,
    numeroIdentificacion: 0,
    fullName: '',
    razonSocial: '',
    email: '',
    primerNombre: '',
    primerApellido: ''
  });
  const { obj, prop, form } = props;

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const [isOtherParentesco, setIsOtherParentesco] = useState(false);
  const onChangeParentesco = (e: RadioChangeEvent) => {
    props.form.resetFields(['solicitudOtherParentesco']);
    setIsOtherParentesco(e.target.value === 'Otro');
  };

  const getListas = useCallback(
    async () => {
      const funeraria = await api.GetFunerarias();
      const infouser: any = localStorage.getItem('infouser');
      const info: any = JSON.parse(infouser);

      setUser(info);
      const existefuneraria = funeraria.filter((i: { RAZON_S: string }) => i.RAZON_S == info.razonSocial);

      setNroiden(existefuneraria.NROIDENT);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validPerson = (): boolean => {
    const { razonSocial } = user;
    if (razonSocial != null) {
      return true;
    }
    return false;
  };
  const validFun = (): boolean => {
    if (nroiden == undefined) {
      return false;
    }
    return true;
  };
  var emailsolicitantevalidacion = false;
  const getData = (rowData: any) => {
    emailsolicitantevalidacion = rowData;

    prop(emailsolicitantevalidacion);
  };

  /* NOTE: [2021-06-12] Se debe conectar un servicio para cargar el tipo de usuario autenticado y colocar la información segun el usuario autenticado. */
  /* TODO: [2021-06-12] Determinar si es usuario cliente o funcionario. */

  const onChange = (value: any, tipo: String) => {
    prop(value, tipo);
  };

  const cambioemailFUN = (e: any) => {
    let campo = e;

    const emailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    //Se muestra un texto a modo de ejemplo, luego va a ser un icono

    if (emailRegex.test(campo)) {
      //setValidEmailFUN(true);
      onChange(true, '1');
    } else {
      //setValidEmailFUN(false);
      onChange(false, '1');
    }
  };

  return (
    true && (
      <>
        <Divider orientation='right'>DATOS DEL {validPerson() && ('FUNERARIA Y/O SOLICITANTE')} SOLICITANTE Y/O FUNERARIA</Divider>
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
              label='Parentesco xx'
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
            {validPerson() && (
              <>
                <Form.Item label='Razón Social' name='solicitudRazonSocial'>
                  <span className='ant-form-text'>{user?.razonSocial.toUpperCase()}</span>
                </Form.Item>
                {validFun() && (
                  <Form.Item label='Consecutivo' name='consecutivoInterno'>
                    <span className='ant-form-text'>{nroiden}</span>
                  </Form.Item>
                )}
              </>
            )}
            {/*   <Form.Item label='Representante Legal' name='solicitudRepresentanteLegal'>
              <span className='ant-form-text'>{name.toUpperCase()}</span>
            </Form.Item> */}
            <Form.Item label={validPerson() ? 'Nit' : 'CC'} name='solicitudIDTramitador'>
              <span className='ant-form-text'>{user?.numeroIdentificacion}</span>
            </Form.Item>
            <Form.Item label={validPerson() ? 'Nombre del Representante Legal' : 'Nombre del Solicitante'} name='solicitudIDTramitador'>
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
  obj: any;
  prop: any;
}

type TypeLugarFuneraria = 'Dentro de Bogotá';
