import logo from '../../../../src/assets/images/aguas/alcadia.png';
import '../../../css/estilos.css';
import profile from '../../../../src/assets/images/aguas/profile.png';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';
import { Form, Input } from 'antd';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import { DatosSolicitante } from './seccions/DatosSolicitante.seccion';
import { UbicacionPersona } from './seccions/Ubicacion.seccion';
import { IRegistroSolicitudPrimeraVez } from 'app/aguasconsumo/Components/Models/IRegistroSolicitudPrimeraVez';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import {
  dominioService,
  ETipoDominio,
  IBarrio,
  IDepartamento,
  IDominio,
  ILocalidad,
  IMunicipio,
  IUpz
} from 'app/services/dominio.service';
import React, { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';

import Swal from 'sweetalert2';

export const Servicios = () => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();
  const [temporalvalor, settemporal] = useState<boolean>(false);
  const [l_tramites, setLtramites] = useState<any[]>([]);
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);
  const history = useHistory();

  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
  const idlocalidad = '0e2105fb-08f8-4faf-9a79-de5effa8d198';

  //validacion campos
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(5);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{5,10}');
  const [tipocampovalidacion, setTipocampovalidacion] = useState<any>(/[0-9]/);
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [campo, setCampo] = useState<string>('Numéricos');
  const [sininformacion, setsininformacion] = useState<boolean>(false);
  //
  const [rol, setrol] = useState<any>();

  const getListas = useCallback(
    async () => {
      const tramites = await api.getTipoTramites();
      const rolesstorage: any = localStorage.getItem('roles');

      const [permiso] = JSON.parse(rolesstorage);

      setrol(permiso.rol);

      setLtramites(tramites);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const onSubmit = async (values: any) => {
    setStatus(undefined);
    const usuario = api.getIdUsuario();

    const dep = values.departamento;
    var mun = values.municipio;
    switch (dep) {
      case '31b870aa-6cd0-4128-96db-1f08afad7cdd':
        mun = '31211657-3386-420a-8620-f9C07a8ca491';
        break;
    }
    let tipo = '';
    if (temporalvalor) {
      tipo = 'A4530F22-1038-48CC-9F57-938392DACCB8';
    } else {
      tipo = 'B1BA9304-C16B-43F0-9AFA-E92D7B7F3DF9';
    }

    const json: IRegistroSolicitudPrimeraVez<any> = {
      solicitud: {
        idTipoSolicitud: tipo,
        numeroRadicado: 0,
        idUsuario: usuario,
        idPersona: '00000000-0000-0000-0000-000000000000',
        idUbicacion: '00000000-0000-0000-0000-000000000000',

        idTipoTramite: values.tipotramite,

        temporal: temporalvalor,

        persona: {
          idPersona: '00000000-0000-0000-0000-000000000000',
          tipoIdentificacion: values.IDType,
          numeroIdentificacion: values.IDNumber,
          primerNombre: values.name,
          segundoNombre: values.secondname,
          primerApellido: values.surname,
          segundoApellido: values.secondsurname,
          telefonoContacto: values.telefono,
          celularContacto: values.telefono2,
          correoElectronico: values.email,
          idTipoPersona: values.persona,
          tipoDocumentoRazon: values?.IDTypeRazon ?? '',
          nit: values?.IDNumberRazon ?? '',
          razonSocial: values?.nombreEntidad ?? ''
        },

        ubicacion: {
          idUbicacion: '00000000-0000-0000-0000-000000000000',
          direccion: values.direccion,
          departamento: values.departamento,
          municipio: mun,
          localidad: values?.localidad ?? '00000000-0000-0000-0000-000000000000',
          vereda: '',
          sector: '',
          upz: '00000000-0000-0000-0000-000000000000',
          barrio: '00000000-0000-0000-0000-000000000000',
          observacion: ''
        }
      }
    };

    const nrorad = await api.AddSolicitudPrimera(json);

    Swal.fire({
      icon: 'success',

      title: 'Solicitud Creada',
      text: `Se ha creado la Solicitud exitosamente con número de radicado ${nrorad}`
    });

    history.push('/tramites-servicios-aguas');
  };

  const onSubmitFailed = () => setStatus('error');

  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body'>
          <Form form={form} {...layoutItems} layout='horizontal' onFinish={onSubmit} onFinishFailed={onSubmitFailed}>
            <section className='info-panel'>
              <div className='container'>
                <div className='row mt-2'>
                  <div className='col-lg-6 col-sm-12 col-md-6'>
                    <div className='info-secion prueba_seccion'>
                      <nav aria-label='breadcrumb'>
                        <ol className='breadcrumb'>
                          <li className='breadcrumb-item'>
                            <a href='#'>Inicio</a>
                          </li>
                          <li className='breadcrumb-item'>
                            <a href='#'>Bandeja de entrada</a>
                          </li>
                          <li className='breadcrumb-item active' aria-current='page'>
                            Revisar solicitud
                          </li>
                        </ol>
                      </nav>
                    </div>
                  </div>
                </div>
                <section className='panel-menu'>
                  <div className='container'>
                    <div className='row'>
                      <div className='col-lg-12 col-md-12 ml-4 col-sm-12 panel_menu'>
                        <div className='ubi-menu' style={{ marginLeft: '-12px' }}>
                          <nav className='nav panel'>
                            <a className='nav-link active' href='#'>
                              1. Solicitar revisión
                            </a>
                            <a className='nav-link' href='#'>
                              2. Crear Solicitud
                            </a>
                            <a className='nav-link' href='#'>
                              3. En gestión
                            </a>
                            <a className='nav-link disabled' href='#'>
                              4. Respuesta
                            </a>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <div className='row mt-5'>
                  <div className='col-lg-12 col-md-12 tramite tramite_titulo'>
                    <div className='info-tramite mt-3 ml-5'>
                      <p>Trámite: Autorización sanitaria para la concesión de aguas para el consumo humano.</p>
                    </div>
                  </div>
                </div>
                <div className='row primera_seccion'>
                  <div className='col-lg-12 col-sm-12 col-md-12'>
                    <div className='info-tramite mt-2'>
                      <p className='ml-3 mt-5' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        <br /> Datos de la solicitud. <br />
                        <small style={{ color: '#000' }}>
                          <span className='required'>*</span> Campos Obligatorios
                        </small>
                      </p>
                    </div>
                  </div>
                  <div className='col-lg-6 col-sm-6 col-md-6 mt-2 ml-2'>
                    <div className='panel-search'>
                      <div className='form-group gov-co-form-group'>
                        <p className='text'>
                          <span className='required'>*</span> Tipo de tramite
                        </p>
                        <Form.Item
                          name='tipotramite'
                          initialValue={'301d61c3-7685-4151-9dc5-1bdf5a88831a'}
                          rules={[{ required: true }]}
                        >
                          <SelectComponent
                            options={l_tramites}
                            defaultValue={'301d61c3-7685-4151-9dc5-1bdf5a88831a'}
                            optionPropkey='idTipoTramite'
                            optionPropLabel='descripcion'
                            className='mr-5 option'
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row mt-5 primeros_campos'>
                  <DatosSolicitante form={form} obj={null} tipo={'coordinador'} habilitar={true} />
                </div>
                <div className='row mt-5 ml-2 '>
                  <UbicacionPersona form={form} obj={null} tipo={null} vista={'servicios'} />
                </div>
                <div className='row mt-3 acciones'>
                  <div className='col-lg-8 col-md-8 col-sm-12 mt-4'>
                    <div className='accion ml-4 botnoes'>
                      <Button
                        className='ml-4 float-right button btn btn-default'
                        style={{ backgroundColor: '#BABABA', border: '2px solid #BABABA', color: '#000' }}
                        type='primary'
                        htmlType='submit'
                      >
                        Enviar
                      </Button>

                      <Button
                        className='mr-3 float-right button btn btn-default cancelar'
                        style={{ backgroundColor: '#BABABA', border: '2px solid #BABABA', color: '#000' }}
                        onClick={() => {
                          history.push('/tramites-servicios-aguas');
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Form>
        </div>
      </div>
    </div>
  );
};
