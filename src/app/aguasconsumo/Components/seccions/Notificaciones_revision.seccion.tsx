import React, { useCallback, useEffect, useState } from 'react';
import Form, { FormInstance } from 'antd/es/form';
import { authProvider } from '../../../shared/utils/authprovider.util';
import { ApiService } from '../../../services/Apis.service';
import { SelectComponent } from '../../../shared/components/inputs/select.component';
import Button from 'antd/es/button';
import { Input, Modal } from 'antd';
import axios from 'axios';

export const TipoNotificacion: React.FC<TipoNotificacion<any>> = (props) => {
  const { obj, prop } = props;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const [l_tipoNotificacion, setlTipoModificacion] = useState<any[]>([]);
  //const [l_tipoNotificacionSeleccion, setlTipoModificacionSeleccion] = useState<any>([]);

  const [body, setlBody] = useState<string>('');
  const [title, setlTitle] = useState<string>('');

  const getListas = useCallback(async () => {
    const tipoNotificaciones = await api.getTipoNotificaciones();

    setlTipoModificacion(tipoNotificaciones);
    // setlTipoModificacionSeleccion(tipoNotificaciones[0]);
  }, []);

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeNotificacion = async (value: any) => {
    props.form.setFieldsValue({ notificacion: undefined });
    const notificacion = await api.getTipoNotificaciones();

    setlTipoModificacion(notificacion);
  };

  const vistaPrevia = async () => {
    // const formato = await api.getFormatoAguas('655456F2-1B4D-4027-BE41-F9CE786B5380');
    const path = 'BFF184AD-107F-4ACD-8891-A0AF34793C0A';
    const formato = await axios.get(`https://localhost:5001/api/Formatos/getByIdPlantilla/${path}`, {
      responseType: 'json'
    });
    //console.log(formato.data['cuerpo']);
    let body0: string = formato.data['cuerpo'];
    let indice1 = body0.indexOf('Tahoma,sans-serif;color:#666;font-size:18px; text-align: justify;">');

    let indice2 = body0.indexOf('</p>');

    setlBody(body0.substring(indice1 + 67, indice2));
    setlTitle(formato.data['asuntoNotificacion']);

    //console.log(indice1 + 67);
    //console.log(indice2);
    //console.log(body);

    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className='row mt-3'>
        <div className='col-lg-12 col-sm-12 col-md-12'>
          <div className='info-tramite mt-2'>
            <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Notificaciones generales de revisión. <br /> <small style={{ color: '#000' }}>* Campos Obligatorios</small>
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
            <Input.TextArea maxLength={300} className='form-control gov-co-form-control' style={{ width: '300px' }} />
          </Form.Item>
        </div>
      </div>
      <Modal
        title={<p className='text-center text-dark text-uppercase mb-0 titulo'>Vista previa</p>}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1000}
        okButtonProps={{ hidden: true }}
        cancelText='Cerrar'
      >
        <div style={{ padding: 0, margin: 0 }}>
          <header style={{ backgroundColor: '#0072c6', marginTop: 0, padding: '20px' }}>
            <h1
              style={{
                lineHeight: '20pt',
                fontFamily: 'Segoe UI Light',
                fontSize: '18pt',
                color: '#ffffff',
                fontWeight: 'normal',
                textAlign: 'center',
                marginTop: 0,
                textTransform: 'uppercase'
              }}
            >
              {title}
            </h1>
          </header>
          <section style={{ padding: '1px', margin: '0 15px' }}>
            <div>
              <p style={{ fontFamily: 'Segoe UI,Tahoma,sans-serif', color: '#666', fontSize: '18px', textAlign: 'justify' }}>
                {body}
              </p>
            </div>
            <div>
              <p style={{ fontFamily: 'Segoe UI,Tahoma,sans-serif', color: '#666', fontSize: '18px', textAlign: 'justify' }}>
                Atentamente, Salud Capital
              </p>
            </div>
          </section>
          <footer
            style={{
              borderBottom: '1px solid #e3e3e3',
              borderTop: '1px solid #e3e3e3',
              padding: '20px 0',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ width: '40%', height: 'auto', display: 'flex', justifyContent: 'left' }}>
              <p
                style={{
                  fontFamily: 'Segoe UI,Tahoma,sans-serif',
                  margin: '0px 0px 0px 30px',
                  color: '#666',
                  fontSize: '10px',
                  textAlign: 'justify',
                  width: '50%'
                }}
              >
                Este mensaje se envió desde una dirección de correo electrónico no supervisada. No responda a este mensaje.
              </p>
            </div>
            <div style={{ width: '40%', height: 'auto', display: 'flex', justifyContent: 'center' }}>
              <img
                src='https://ci3.googleusercontent.com/proxy/ZpxLDJuQPMcU2hTY6tq8Wi0alaC3_6JiA9bKxMUbac0Lv-2fcRMkltE5gWgRrUynLheRSum3JMAGbW9FzeuOWjuE2UrXo6FNCvO8nBScaM9kiuc1YtD-n35UQuvCf02V7sXA6ZjmmWn95r585LfAzNifc0wRs5rGiN9KpBHB4c5uPJRg0JfPBzuKRLhOgdkJTpkJO-tw5p37nwwoUyaG=s0-d-e1-ft#https://aadcdn.msauthimages.net/dbd5a2dd-2e-tcdtzyzrfsl01uzp7pjmqwdsq0tlkufmmtftnkc4/logintenantbranding/0/bannerlogo?ts=637625143347821803'
                alt='logo'
              />
            </div>
          </footer>
        </div>
      </Modal>
      <div className='row mt-4'>
        <div className='col-lg-8 col-md-8 col-sm-12 mt-2'>
          <Button
            className='ml-3 float-right button btn btn-default'
            style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
            type='primary'
            htmlType='submit'
            onClick={vistaPrevia}
          >
            Ver vista previa
          </Button>
          <Button
            className='mr-3 float-right button btn btn-default'
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
