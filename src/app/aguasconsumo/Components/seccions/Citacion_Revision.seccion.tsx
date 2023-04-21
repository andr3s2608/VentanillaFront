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
  const { obj, tipo, prop } = props;

  const [modificar, setmodificar] = useState<boolean>();
  const [mostrar, setmostrar] = useState<boolean>(false);
  const [fecha, setfecha] = useState<any>();
  const [funcionario, setfuncionario] = useState<any>();
  const [observacion, setobservacion] = useState<any>();
  const [l_usuarios, setLl_usuarios] = useState<any[]>([]);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const getListas = useCallback(async () => {
    const subredes: any = localStorage.getItem('subredes');
    setfuncionario(obj.idSubred);
    if (obj.citacion[0] != undefined) {
      const date = obj.citacion[0].fechaCitacion;

      setfecha(moment(date));
      //setfuncionario(obj?.citacion[0].idUsuarioCitacion);
      setobservacion(obj?.citacion[0].observacionCitacion);
    }
    setmostrar(true);
    setLl_usuarios(JSON.parse(subredes));
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
      {mostrar && (
        <>
          <div className='col-lg-5 col-sm-4 col-md-5 mt-2 ml-3 '>
            <div className='panel-search'>
              <p className='text'>
                <span className='required'>*</span> Fecha de citación
              </p>
              <Form.Item initialValue={modificar ? fecha : null} name='date' rules={[{ required: !modificar }]}>
                <DatepickerComponent
                  className='datepickercita'
                  picker='date'
                  dateDisabledType='after'
                  dateFormatType='default'
                  value={fecha}
                  disabled={modificar}
                />
              </Form.Item>
            </div>
          </div>
          <div className='col-lg-5 col-sm-4 col-md-5 mt-2'>
            <div className='panel-search'>
              <div className='form-group gov-co-form-group mr-4'>
                <div className='gov-co-dropdown'>
                  <p className='text'>
                    <span className='required'></span> Subred
                  </p>
                  <Form.Item initialValue={funcionario} name='funcionario' rules={[{ required: false }]}>
                    <SelectComponent
                      options={l_usuarios}
                      defaultValue={funcionario}
                      optionPropkey='idSubRed'
                      optionPropLabel='zona'
                      disabled={modificar}
                    />
                  </Form.Item>
                </div>
              </div>
              {tipo == 'Funcionario' && (
                <>
                  <div className='col-md-6 col-lg-6 col-sm-12 ml-3'>
                    <Button
                      className='mr-3 float-right button btn btn-default'
                      type='primary'
                      style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                      onClick={() => {
                        prop()
                      }}
                    >
                      Reasignar
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className='col-lg-11 col-sm-12 col-md-11 mt-3 ml-3'>
            <p className='text'>
              <span className='required'>*</span> Observaciones Adicionales
            </p>

            <div className='form-group gov-co-form-group'>
              <Form.Item initialValue={modificar ? observacion : ''} name='observationsCitacion' rules={[{ required: false }]}>
                <Input.TextArea
                  disabled={modificar}
                  defaultValue={observacion}
                  rows={5}
                  maxLength={230}
                  value={''}
                  style={{ width: '300px' }}
                />
              </Form.Item>
            </div>
          </div>
        </>
      )}


    </>
  );
};
/*
    {tipo == 'Funcionario' && (
      <>
        <div className='col-md-6 col-lg-6 col-sm-12 ml-3'>
          <p className='text'>
            <span></span> Cargar archivo
          </p>
          <Form.Item label='' name='cargarArchivo' rules={[{ required: false }]}>
            <Upload name='cargarArchivo' maxCount={1} beforeUpload={() => false} listType='text' accept='application/pdf'>
              <Button icon={<UploadOutlined />}>Cargar archivo</Button>
            </Upload>
          </Form.Item>
        </div>
      </>
    )}
    */
interface DatosCitacion<T> {
  form: FormInstance<T>;
  obj: any;
  tipo: string;
  prop: any;
}
