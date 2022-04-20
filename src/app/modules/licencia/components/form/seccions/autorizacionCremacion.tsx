import React from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';

import Divider from 'antd/es/divider';

// Componentes

import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { type } from 'os';
import { TypeLicencia } from 'app/shared/utils/types.util';

export const AutorizacionCremacion: React.FC<AutorizacionCremacionProps<any>> = (props) => {
  //#endregion
  const { tipoLicencia } = props;

  return (
    <>
      {tipoLicencia !== 'Cremación' && (
        <>
          <Divider orientation='right'>Autorización cremación del fiscal y medicina legal</Divider>

          <Form.Item label='Nombres y Apellidos' name='firtNameAndLastName' rules={[{ required: true }]}>
            <Input allowClear placeholder='Nombres y Apellidos' autoComplete='off' />
          </Form.Item>
          <Form.Item label='Fiscal No.' name='fiscal' rules={[{ required: true, max: 5 }]}>
            <Input allowClear placeholder='Fiscal No.' autoComplete='off' type='number' />
          </Form.Item>
          <Form.Item label='No. Oficio de medicina legal' name='medicinalegal' rules={[{ required: true, max: 6 }]}>
            <Input allowClear placeholder='No. Oficio de medicina legal' autoComplete='off' type='number' />
          </Form.Item>
          <Form.Item label='Fecha Oficio de Medicina Legal' name='fecha' rules={[{ required: true }]}>
            <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' />
          </Form.Item>
        </>
      )}
    </>
  );
};

interface AutorizacionCremacionProps<T> {
  form?: FormInstance<T>;
  tipoLicencia: TypeLicencia;
}
