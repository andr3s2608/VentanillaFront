import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';

import Divider from 'antd/es/divider';

// Componentes

import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { dominioService, ETipoDominio, IDominio } from 'app/services/dominio.service';

export const GestionTramite: React.FC<gestiontramite> = (props) => {
  const { type, idSolicitud, idTramite } = props;

  const [isDisable, setIsDisable] = useState<boolean>(false);
  const onChange = (value: any) => {
    if (value === '3cd0ed61-f26b-4cc0-9015-5b497673d275') {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  };

  return (
    <>
      <Divider orientation='left'>Aprobar / Negar Licencia Inhumación</Divider>

      <Form.Item label='Tipo Seguimiento' name='validFunctionaltype' rules={[{ required: true }]}>
        <SelectComponent onChange={onChange} options={type} optionPropkey='id' optionPropLabel='descripcion' />
      </Form.Item>
      <Form.Item label='Observaciones.' name='Observations' rules={[{ required: true }]}>
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
