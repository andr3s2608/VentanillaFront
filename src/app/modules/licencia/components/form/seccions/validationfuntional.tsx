import { Divider, Form, Input } from 'antd';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import React, { useState } from 'react';
import Button from 'antd/es/button';
import { ApiService } from 'app/services/Apis.service';

export const ValidationFuntional: React.FC<validationFuncional> = (props) => {
  const { type, idSolicitud, idTramite } = props;
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const onChange = (value: any) => {
    if (value === '3cd0ed61-f26b-4cc0-9015-5b497673d275') {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  };
  const api = new ApiService('');
  const onPrev = () => api.GeneratePDF(idSolicitud);

  return (
    <>
      <Divider orientation='right'>Resultado de la validacion</Divider>

      <Form.Item label='Tipo Seguimiento' name='validFunctionaltype' rules={[{ required: true }]}>
        <SelectComponent onChange={onChange} options={type} optionPropkey='id' optionPropLabel='descripcion' />
      </Form.Item>
      <Form.Item label='Detalle' name='descripcionvalidfuncional' rules={[{ required: true, max: 140 }]}>
        <Input.TextArea
          allowClear
          rows={4}
          placeholder='Digite la Informacion que desar que actualice el ciudadano(a) le llegara al correo
            electronico y estara disponible en la seccion - mis tramites con la opcion de editar el tramite 
          '
          autoComplete='off'
        />
      </Form.Item>
      {isDisable ? (
        <Form.Item>
          <div className='d-flex flex-end ant-col-md-24'>
            <Button type='dashed' htmlType='button' onClick={onPrev}>
              Previsualizar
            </Button>
          </div>
        </Form.Item>
      ) : null}
    </>
  );
};

interface validationFuncional {
  idTramite: string;
  idSolicitud: string;
  type: any;
}
