import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import Divider from 'antd/es/divider';
import '../../../../../../../css/estilos.css';
// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';

//Redux
import { store } from 'app/redux/app.reducers';
import { SetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';

export const GestionTramite: React.FC<gestiontramite> = (props) => {
  const { type, idSolicitud, idTramite, valor, registrado } = props;
  const [mostrar, setmostrar] = useState<boolean>(false);
  const [tipos, settipos] = useState<any[]>([]);
  const [observacion, setobservacion] = useState<boolean>(true);

  const getListas = useCallback(async () => {}, []);

  const onChange = (value: any) => {
    if (value === '3cd0ed61-f26b-4cc0-9015-5b497673d275') {
      store.dispatch(SetViewLicence(false));
      setobservacion(false);
    } else {
      store.dispatch(SetViewLicence(true));
      setobservacion(true);
    }
  };

  useEffect(() => {
    getListas();
  }, []);

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
            <p style={{ fontSize: '16px', color: '#3366cc', fontFamily: ' Roboto' }} className='text-uppercase font-weight-bold'>
              Aprobar / Negar {valor}
            </p>
          </div>
        </div>

        <div className='row'>
          <div className='col-lg-12 col-sm-12 col-md-12 ' style={{ marginLeft: '-10px' }}>
            <label htmlFor=''>Tipo Seguimiento</label>
            <Form.Item label='' name='validFunctionaltype' rules={[{ required: true }]}>
              <SelectComponent
                onChange={onChange}
                options={type}
                optionPropkey='id'
                optionPropLabel='descripcion'
                style={{ width: '360px' }}
                className='tipo_s'
              />
            </Form.Item>
          </div>
        </div>

        <div className='row mt-2 prueba'>
          <div className='col-lg-12 col-sm-12 col-md-12' style={{ marginLeft: '-10px' }}>
            <label htmlFor=''>Observaciones</label>
            <Form.Item label='' name='observations' rules={[{ required: observacion }]}>
              <Input.TextArea rows={5} maxLength={500} style={{ width: '360px' }} className='textarea' />
            </Form.Item>
          </div>
        </div>
      </div>
    </>
  );
};
interface gestiontramite {
  idTramite: string;
  idSolicitud: string;
  type: any;
  registrado: boolean;
  valor: string;
}
export const KeysForm = ['statustramite', 'observations'];
