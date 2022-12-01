import React from 'react';
import Form, {FormInstance} from 'antd/es/form';
import TextArea from 'antd/es/input/TextArea';

export const TipoServicioFormSeccion: React.FC<ITipoServiciProps<any>> = (props) => {
  return(
    <>
      <Form.Item
        label='Servicios'
        name='servicios'
        rules={[{ required: true }]}
      >
        <TextArea/>
      </Form.Item>
      <Form.Item
        label='Características básicas del servicio:'
        name='caracteristicasBasicasServicio'
        rules={[{ required: true }]}
      >
        <TextArea/>
      </Form.Item>
      <Form.Item
        label='¿Otros Cuales?'
        name='otrosServicios'
        rules={[{ required: false}]}
      >
        <TextArea/>
      </Form.Item>
    </>
  );
}


interface ITipoServiciProps<T> {
  form: FormInstance<T>;
  required: boolean;
  obj: any;
}
