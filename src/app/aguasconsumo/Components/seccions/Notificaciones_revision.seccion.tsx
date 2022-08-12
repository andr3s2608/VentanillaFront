import React, { useCallback, useEffect, useState } from 'react';
import Form, { FormInstance } from 'antd/es/form';
import { authProvider } from '../../../shared/utils/authprovider.util';
import { ApiService } from '../../../services/Apis.service';
import { SelectComponent } from '../../../shared/components/inputs/select.component';
import Button from 'antd/es/button';
import { Input, Modal } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';

export const TipoNotificacion: React.FC<TipoNotificacion<any>> = (props) => {
  const { obj, prop } = props;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const [l_tipoNotificacion, setlTipoModificacion] = useState<any[]>([]);
  const [idPlantilla, setIdPlantilla] = useState<string>('');
  const [isvistaPrevia, setIsVistaPrevia] = useState<boolean>(false);

  const [body, setlBody] = useState<string>('');
  const [title, setlTitle] = useState<string>('');

  const getListas = useCallback(async () => {
    const tipoNotificaciones = await api.getTipoNotificaciones();

    const filter = tipoNotificaciones.filter(function (f: { idTipoNotificacion: string }) {
      return (
        f.idTipoNotificacion != '6f8c18fe-90c2-40d7-baf6-e9c1c7a67e09' &&
        f.idTipoNotificacion != '56099d01-9f35-42d9-9a3c-fb4f3e48c73b' &&
        f.idTipoNotificacion != '6f8c18fe-69C2-40d7-baf6-e9c1c7a67e09'
      );
    });

    setlTipoModificacion(tipoNotificaciones);
    // setlTipoModificacionSeleccion(tipoNotificaciones[0]);
  }, []);

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeNotificacion = async (value: any) => {
    var x = l_tipoNotificacion.find((t) => t.idTipoNotificacion == value);
    setIdPlantilla(x['idPlantilla']);
    props.form.setFieldsValue({ notificacion: undefined });
    const notificacion = await api.getTipoNotificaciones();
    setIsVistaPrevia(true);
    setlTipoModificacion(notificacion);
  };

  function agregarValoresDinamicos(HTML: string, llavesAReemplazar: string[], valoresDinamicos: string[]): string {
    let nuevoHTML = HTML;

    for (let index = 0; index < llavesAReemplazar.length; index++) {
      nuevoHTML = nuevoHTML.replace(llavesAReemplazar[index], valoresDinamicos[index]);
    }

    return nuevoHTML;
  }

  const notificar = async () => {
    if (idPlantilla == '') {
      Swal.fire({
        icon: 'error',
        title: 'Datos inválidos',
        text: `Debe seleccionar un tipo de notificación`
      });
    } else {
      const formato = await api.getFormatoAguas(idPlantilla);
      const control: string = formato['asuntoNotificacion'];
      switch (control) {
        case 'Notificación de Desistimiento':
          await api.sendEmail({
            to: obj.correoElectronico,
            subject: 'Notificación de Desistimiento',
            body: formato['cuerpo']
          });
          Swal.fire({
            icon: 'success',
            title: 'Notificación exitosa',
            text: `Se ha realizado la notificación de subsanación`
          });
          break;
        case 'Notificación de subsanación':
          await api.sendEmail({
            to: obj.correoElectronico,
            subject: 'Notificación de subsanación',
            body: formato['cuerpo']
          });
          Swal.fire({
            icon: 'success',
            title: 'Notificación exitosa',
            text: `Se ha realizado la notificación de subsanación`
          });
          break;
        case 'Notificación de visita en campo':
          await api.sendEmail({
            to: obj.correoElectronico,
            subject: 'Notificación de visita en campo',
            body: formato['cuerpo']
          });
          Swal.fire({
            icon: 'success',
            title: 'Notificación exitosa',
            text: `Se ha realizado la notificación de visita en campo`
          });
          break;

        case 'Notificación Aprobación Autoridad Ambiental':
          const certificadoAutoridad = await api.getCertificadoAguas('2');

          await api.sendEmailAttachment({
            to: obj.correoElectronico,
            subject: 'Notificación Aprobación Autoridad Ambiental',
            body: agregarValoresDinamicos(
              formato['cuerpo'],
              ['~:~sistema-abastecimiento~:~', '~:~numero-resolucion~:~', '~:~fecha~:~'],
              [
                obj.fuenteabastecimientojson[0].nombrefuenteabastecimiento,
                obj.renovafuentejson[0].numeroResolucion,
                obj.renovafuentejson[0].fechaResolucion.substring(0, 10)
              ]
            ),
            attachment: certificadoAutoridad,
            AttachmentTitle: 'Autorización sanitaria para el tratamiento de aguas.pdf'
          });
          Swal.fire({
            icon: 'success',
            title: 'Notificación exitosa',
            text: `Se ha realizado la notificación Aprobación Autoridad Ambiental`
          });
          break;

        case 'Notificación Aprobación al Ciudadano':
          const certificadoCiudadano = await api.getCertificadoAguas('4');

          await api.sendEmailAttachment({
            to: obj.correoElectronico,
            subject: 'Notificación Aprobación al Ciudadano',
            body: agregarValoresDinamicos(
              formato['cuerpo'],
              ['~:~sistema-abastecimiento~:~', '~:~numero-resolucion~:~', '~:~fecha~:~'],
              [
                obj.fuenteabastecimientojson[0].nombrefuenteabastecimiento,
                obj.renovafuentejson[0].numeroResolucion,
                obj.renovafuentejson[0].fechaResolucion.substring(0, 10)
              ]
            ),
            attachment: certificadoCiudadano,
            AttachmentTitle: 'Autorización sanitaria para el tratamiento de aguas.pdf'
          });
          Swal.fire({
            icon: 'success',
            title: 'Notificación exitosa',
            text: `Se ha realizado la notificación Aprobación al Ciudadano`
          });
          break;

        case 'Notificación Recordatorio de Subsanación':
          const dias = await api.getConstantesAguas('9124A97B-C2BD-46A0-A8B3-1AC702A06C82');

          await api.sendEmail({
            to: obj.correoElectronico,
            subject: 'Notificación Recordatorio de Subsanación',
            body: agregarValoresDinamicos(formato['cuerpo'], ['~:~dias~:~'], [dias['valorConstante']])
          });
          Swal.fire({
            icon: 'success',
            title: 'Notificación exitosa',
            text: `Se ha realizado la notificación Recordatorio de Subsanación`
          });
          break;

        default:
          break;
      }
    }
  };

  const vistaPrevia = async () => {
    if (idPlantilla == '') {
      Swal.fire({
        icon: 'error',
        title: 'Datos inválidos',
        text: `Debe seleccionar un tipo de notificación`
      });
    } else {
      const formato = await api.getFormatoAguas(idPlantilla);

      let body0: string = formato['cuerpo'];
      let indice1 = body0.indexOf('Tahoma,sans-serif;color:#666;font-size:18px; text-align: justify;">');

      let indice2 = body0.indexOf('</p>');

      setlBody(body0.substring(indice1 + 67, indice2));

      const control: string = formato['asuntoNotificacion'];
      switch (control) {
        case 'Notificación Aprobación Autoridad Ambiental':
          setlBody(
            agregarValoresDinamicos(
              body0.substring(indice1 + 67, indice2),
              ['~:~sistema-abastecimiento~:~', '~:~numero-resolucion~:~', '~:~fecha~:~'],
              [
                obj.fuenteabastecimientojson[0].nombrefuenteabastecimiento,
                obj.renovafuentejson[0].numeroResolucion,
                obj.renovafuentejson[0].fechaResolucion.substring(0, 10)
              ]
            )
          );
          break;

        case 'Notificación Aprobación al Ciudadano':
          setlBody(
            agregarValoresDinamicos(
              body0.substring(indice1 + 67, indice2),
              ['~:~sistema-abastecimiento~:~', '~:~numero-resolucion~:~', '~:~fecha~:~'],
              [
                obj.fuenteabastecimientojson[0].nombrefuenteabastecimiento,
                obj.renovafuentejson[0].numeroResolucion,
                obj.renovafuentejson[0].fechaResolucion.substring(0, 10)
              ]
            )
          );
          break;

        case 'Notificación Recordatorio de Subsanación':
          const dias = await api.getConstantesAguas('9124A97B-C2BD-46A0-A8B3-1AC702A06C82');
          setlBody(agregarValoresDinamicos(body0.substring(indice1 + 67, indice2), ['~:~dias~:~'], [dias['valorConstante']]));

          break;

        default:
          break;
      }
      setlTitle(formato['asuntoNotificacion']);

      setIsModalVisible(true);
    }
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
            htmlType='button'
            onClick={vistaPrevia}
          >
            Ver vista previa
          </Button>
          <Button
            className='mr-3 float-right button btn btn-default'
            type='primary'
            htmlType='button'
            style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
            onClick={notificar}
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
