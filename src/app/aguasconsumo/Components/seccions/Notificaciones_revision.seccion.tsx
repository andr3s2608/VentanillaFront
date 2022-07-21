import React, {useCallback, useEffect, useState} from "react";
import Form, {FormInstance} from "antd/es/form";
import {authProvider} from "../../../shared/utils/authprovider.util";
import {ApiService} from "../../../services/Apis.service";
import {SelectComponent} from "../../../shared/components/inputs/select.component";
import Button from "antd/es/button";


export const TipoNotificacion: React.FC<TipoNotificacion<any>> = (props) => {
  const { obj, prop } = props;

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const [l_tipoNotificacion, setlTipoModificacion] = useState<any[]>([]);


  const getListas = useCallback(
    async () => {
      const tipoNotificaciones = await api.getTipoNotificaciones();

      setlTipoModificacion(tipoNotificaciones);
      },
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeNotificacion = async (value: any) => {
    props.form.setFieldsValue({ notificacion: undefined });
    const notificacion = await api.getTipoNotificaciones();

    setlTipoModificacion(notificacion);
  };


  return (
    <>

      <div className='row mt-3'>
        <div className='col-lg-12 col-sm-12 col-md-12'>
          <div className='info-tramite mt-2'>
            <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Notificaciones generales de revisión. <br />{' '}
              <small style={{ color: '#000' }}>* Campos Obligatorios</small>
            </p>
          </div>
        </div>
      </div>

      <div className='col-lg-4 col-sm-12 col-md-4'>
        <div className='form-group gov-co-form-group '>
          <label className='text'>
            <span className='required'>* </span> Tipo de notificación
          </label>
          <div className='gov-co-dropdown'>
            <Form.Item name='notificacion' rules={[{ required: false }]}>
              <SelectComponent
                options={l_tipoNotificacion}
                optionPropkey='idTipoNotificacion'
                optionPropLabel='nombre'
                onChange={onChangeNotificacion}
              />
            </Form.Item>
          </div>
        </div>
      </div>

      <div className='col-lg-3 col-md-3 col-sm-12'>
        <div className='form-group gov-co-form-group'>
          <p>Descripción de la notificacion</p>
          <Form.Item name='descripcionNotificacion' initialValue={''}>
            <input
              type='text'
              maxLength={300}
              className='form-control gov-co-form-control'
              onKeyPress={(event) => {
                if (!/[a-zA-Z0-9 ]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onPaste={(event) => {
                event.preventDefault();
              }}
            />
          </Form.Item>
        </div>
      </div>


      <div className='row mt-4'>
        <div className='col-lg-8 col-md-8 col-sm-12 mt-2'>
          <Button
            className='ml-3 float-right button btn btn-default'
            style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
            type='primary'
            htmlType='submit'
          >
            Ver vista previa
          </Button>
          <Button className='mr-3 float-right button btn btn-default'
                  type='primary'
                  htmlType='button'
                  style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
          >
            Notificar
          </Button>
        </div>
      </div>

    </>
  );
};

interface TipoNotificacion<T> {
  form: FormInstance<T>;
  obj: any;
  prop: any;
}
