import { Divider, Form, Input } from 'antd';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import React from 'react';

export const ValidationFuntional: React.FC<any> = (propos) => {
  const list: any = [];
  return (
    <>
      <Divider orientation='right'>Resultado de la validacion</Divider>

      <Form.Item label='Tipo Identificación' name='typesolicitudvalid' rules={[{ required: true }]}>
        <SelectComponent options={list} optionPropkey='id' optionPropLabel='descripcion' />
      </Form.Item>
      <Form.Item
        label='Digite la informacion que desar que actualice el ciudadano(a)'
        name='descripcionvalid'
        rules={[{ required: true, max: 140 }]}
      >
        <Input.TextArea
          allowClear
          rows={4}
          placeholder='Digite la Informacion que desar que actualice el ciudadano(a) le llegara al correo
            electronico y estara disponible en la seccion - mis tramites con la opcion de editar el tramite 
          '
          autoComplete='off'
        />
      </Form.Item>
    </>
  );
};
