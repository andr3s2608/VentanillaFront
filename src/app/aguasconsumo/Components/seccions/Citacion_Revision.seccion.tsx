import { Button, Form, FormInstance, Input, Upload } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../../../../css/estilos.css';
export const CitacionRevision: React.FC<DatosCitacion<any>> = (props) => {
  const { obj, tipo } = props;

  const [modificar, setmodificar] = useState<boolean>();
  const [fecha, setfecha] = useState<any>();
  const [funcionario, setfuncionario] = useState<any>();
  const [observacion, setobservacion] = useState<any>();
  const [l_usuarios, setLl_usuarios] = useState<any[]>([]);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const getListas = useCallback(async () => {
    const lusuarios = await api.getFuncionarios();
    const usuarios: any[] = [];
    usuarios.push({ idPersona: 'vacio', fullName: 'No Asignar', oid: 'vacio' });

    for (let index = 0; index < lusuarios.length; index++) {
      usuarios.push(lusuarios.at(index));
    }

    if (obj.citacion != undefined) {
      const date = obj?.citacion[0].fechaCitacion != undefined ? moment(obj?.citacion[0].fechaCitacion) : null;

      setfecha(date);
      setfuncionario(obj?.citacion[0].idUsuarioCitacion);
      setobservacion(obj?.citacion[0].observacionCitacion);
    }

    setLl_usuarios(usuarios);
    if (tipo != 'Funcionario') {
      setmodificar(true);
    } else {
      setmodificar(false);
    }
  }, []);

  useEffect(() => {
    getListas();
  }, []);

  return (
    <>
      <div className='col-lg-12 col-sm-12 col-md-12 mt-4'>
        <div className='info-tramite mt-2'>
          <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Citación de revisión . <br />{' '}
            <small style={{ color: '#000' }}>
              <span className='required'>*</span> Campos Obligatorios
            </small>
          </p>
        </div>
      </div>
      <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
        <div className='panel-search'>
          <p className='text'>
            <span className='required'>*</span> fecha de citación
          </p>
          <Form.Item name='date' initialValue={fecha} rules={[{ required: !modificar }]}>
            <DatepickerComponent
              picker='date'
              dateDisabledType='before'
              dateFormatType='default'
              value={fecha}
              disabled={modificar}
            />
          </Form.Item>
        </div>
      </div>
      <div className='col-lg-4 col-sm-4 col-md-4 mt-2'>
        <div className='panel-search'>
          <div className='form-group gov-co-form-group ml-2'>
            <div className='gov-co-dropdown'>
              <p className='text'>
                <span className='required'>*</span> Funcionario
              </p>
              <Form.Item initialValue={funcionario ?? 'vacio'} name='funcionario' rules={[{ required: !modificar }]}>
                <SelectComponent
                  options={l_usuarios}
                  defaultValue={funcionario}
                  optionPropkey='oid'
                  optionPropLabel='fullName'
                  disabled={modificar}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </div>
      <div className='col-lg-11 col-sm-12 col-md-11 mt-3 ml-1'>
        <p className='text'>
          <span className='required'>*</span> Observaciones Adicionales
        </p>

        <div className='form-group gov-co-form-group'>
          <Form.Item initialValue={observacion ?? ''} name='observationsCitacion' rules={[{ required: false }]}>
            <Input.TextArea disabled={modificar} rows={5} maxLength={230} value={''} style={{ width: '360px' }} />
          </Form.Item>
        </div>
      </div>
      <div className='col-md-6 col-lg-6 col-sm-12 ml-1'>
        {tipo == 'Funcionario' && (
          <Form.Item label='' name='cargarArchivo' rules={[{ required: true }]}>
            <Upload name='cargarArchivo' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
              <Button icon={<UploadOutlined />}>Cargar archivo</Button>
            </Upload>
          </Form.Item>
        )}
      </div>
    </>
  );
};

interface DatosCitacion<T> {
  form: FormInstance<T>;
  obj: any;
  tipo: string;
}
