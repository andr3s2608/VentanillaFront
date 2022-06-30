import { Button, Form, FormInstance, Input, Upload } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

export const CitacionRevision: React.FC<DatosCitacion<any>> = (props) => {
  const { obj, tipo } = props;

  const date = obj?.citacion[0].fechaCitacion != undefined ? moment(obj?.fechaCitacion) : null;

  const [modificar, setmodificar] = useState<boolean>();
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
            Citación de revisión . <br /> <small style={{ color: '#000' }}>* Campos Obligatorios</small>
          </p>
        </div>
      </div>
      <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
        <div className='panel-search'>
          <Form.Item label='fecha de citación' name='date' initialValue={date} rules={[{ required: !modificar }]}>
            <DatepickerComponent
              picker='date'
              dateDisabledType='before'
              dateFormatType='default'
              value={date}
              disabled={modificar}
            />
          </Form.Item>
        </div>
      </div>
      <div className='col-lg-4 col-sm-4 col-md-4 mt-2'>
        <div className='panel-search'>
          <div className='form-group gov-co-form-group ml-2'>
            <div className='gov-co-dropdown'>
              <Form.Item
                label='Funcionario'
                initialValue={obj?.idUsuarioCitacion}
                name='funcionario'
                rules={[{ required: !modificar }]}
              >
                <SelectComponent
                  options={l_usuarios}
                  defaultValue={obj?.citacion[0].idUsuarioCitacion ?? 'vacio'}
                  optionPropkey='oid'
                  optionPropLabel='fullName'
                  disabled={modificar}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </div>
      <div className='col-lg-8 col-sm-12 col-md-8 mt-3'>
        <p className='ml-2'>Observaciones Adicionales</p>

        <div className='form-group gov-co-form-group'>
          <Form.Item
            initialValue={obj?.citacion[0].observacionCitacion ?? ''}
            name='observationsCitacion'
            rules={[{ required: false }]}
          >
            <Input.TextArea disabled={modificar} rows={5} maxLength={230} value={''} style={{ width: '360px' }} />
          </Form.Item>
        </div>
      </div>

      {tipo == 'Funcionario' && (
        <Form.Item label='' name='cargarArchivo' rules={[{ required: true }]}>
          <Upload name='cargarArchivo' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
            <Button icon={<UploadOutlined />}>Cargar archivo</Button>
          </Upload>
        </Form.Item>
      )}
    </>
  );
};

interface DatosCitacion<T> {
  form: FormInstance<T>;
  obj: any;
  tipo: string;
}
