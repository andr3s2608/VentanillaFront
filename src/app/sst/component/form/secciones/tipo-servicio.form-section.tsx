import React from 'react';
import Form, {FormInstance} from 'antd/es/form';
import TextArea from 'antd/es/input/TextArea';
import Divider from 'antd/es/divider';

export const TipoServicioFormSeccion: React.FC<ITipoServiciProps<any>> = (props) => {
  return(
    <>

      <Divider orientation='right'> Tipos de servicio a prestar </Divider>
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
