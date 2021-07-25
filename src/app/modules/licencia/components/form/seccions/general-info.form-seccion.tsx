// Antd
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Radio from 'antd/es/radio';
import Divider from 'antd/es/divider';

// Components
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import Switch from 'antd/es/switch';
import React, { useCallback, useEffect, useState } from 'react';

export const GeneralInfoFormSeccion = () => {
  const [isHora, setIsHora] = useState<boolean>(true);

  const onChangeSwitch = (check: any) => {
    setIsHora(!check);
  };

  return (
    <>
      <Form.Item label='Número de Certificado' name='certificado' rules={[{ required: true, max: 9 }]}>
        <Input allowClear placeholder='Número de Certificado' autoComplete='off' />
      </Form.Item>

      <Divider orientation='right'>Información General</Divider>

      <Form.Item label='Fecha Defunción' name='date' rules={[{ required: true }]}>
        <DatepickerComponent picker='date' dateDisabledType='before' dateFormatType='default' />
      </Form.Item>

      <Form.Item label='Sin Establecer' name='check'>
        <Switch onChange={onChangeSwitch} />
      </Form.Item>

      {isHora && (
        <Form.Item label='Hora' name='time' rules={[{ required: isHora }]}>
          <DatepickerComponent picker='time' dateDisabledType='default' dateFormatType='time' />
        </Form.Item>
      )}

      <Form.Item label='Sexo' name='sex' initialValue='M' rules={[{ required: true }]}>
        <Radio.Group>
          <Radio value='M'>MASCULINO</Radio>
          <Radio value='F'>FEMENINO</Radio>
          <Radio value=' '>INDETERMINADO</Radio>
        </Radio.Group>
      </Form.Item>
    </>
  );
};

export const KeysForm = ['certificado', 'date', 'time', 'sex'];
