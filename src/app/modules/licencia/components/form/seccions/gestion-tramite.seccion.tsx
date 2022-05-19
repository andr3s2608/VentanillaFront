import React from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import Divider from 'antd/es/divider';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';

//Redux
import { store } from 'app/redux/app.reducers';
import { SetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';

export const GestionTramite: React.FC<gestiontramite> = (props) => {
  const { type, idSolicitud, idTramite } = props;

  const onChange = (value: any) => {
    if (value === '3cd0ed61-f26b-4cc0-9015-5b497673d275') {
      store.dispatch(SetViewLicence(false));
    } else {
      store.dispatch(SetViewLicence(true));
    }
  };

  return (
    <>
      <div className='ant-container d-flex justify-content-center w-100 mt-3'>
        <div className='ant-row text-center'>
          <div className='ant-col-12 ant-col-md-12 ant-col-lg-12 ant-col-ant-col-sm-12'>
            <Divider orientation='left'>Aprobar / Negar Licencia Inhumación</Divider>
          </div>
        </div>
      </div>
      <Form.Item label='Tipo Seguimiento' name='validFunctionaltype' rules={[{ required: true }]}>
        <SelectComponent onChange={onChange} options={type} optionPropkey='id' optionPropLabel='descripcion' />
      </Form.Item>
      <Form.Item label='Observaciones.' name='observations' rules={[{ required: true }]}>
        <Input.TextArea style={{ width: 500 }} />
      </Form.Item>
    </>
  );
};
interface gestiontramite {
  idTramite: string;
  idSolicitud: string;
  type: any;
}
export const KeysForm = ['statustramite', 'observations'];
