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

      const mysRoles = await api.GetRoles();
      const [permiso] = mysRoles;

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

  const cambiodocumento = (value: any) => {
    const valor: string = value;
    const valorupper = valor.toUpperCase();
    setsininformacion(false);

    if (valorupper == 'C087D833-3CFB-460F-AA78-E5CF2FE83F25') {
      form.setFieldsValue({ IDNumber: undefined });
      setLongitudminima(5);
      setLongitudmaxima(15);
      setTipocampo('[a-zA-Z0-9]{5,15}');
      setTipocampovalidacion(/[a-zA-Z0-9]/);
      setTipodocumento('Sin Información');
      setCampo('AlfaNuméricos(Numéros y letras)');
      setsininformacion(true);
    } else {
      if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C7902E') {
        setLongitudminima(2);
        setLongitudmaxima(10);
        setTipocampo('[0-9]{2,10}');
        setTipocampovalidacion(/[0-9]/);
        setCampo('Numéricos');
        setTipodocumento('Tipo de Protocolo');
        form.setFieldsValue({ IDNumber: '8001508610' });
      } else {
        form.setFieldsValue({ IDNumber: undefined });
        if (valorupper == '7C96A4D3-A0CB-484E-A01B-93BC39C2552E') {
          setLongitudminima(5);
          setLongitudmaxima(10);
          setTipocampo('[0-9]{5,10}');
          setTipocampovalidacion(/[0-9]/);
          setCampo('Numéricos');
          setTipodocumento('Cédula de Ciudadanía');
        } else {
          if (valorupper == 'AC3629D8-5C87-46CE-A8E2-530B0495CBF6') {
            setLongitudminima(10);
            setLongitudmaxima(11);
            setTipocampo('[0-9]{10,11}');
            setTipocampovalidacion(/[0-9]/);
            setCampo('Numéricos');
            setTipodocumento('Tarjeta de Identidad ');
          } else {
            if (valorupper == '2491BC4B-8A60-408F-9FD1-136213F1E4FB') {
              setLongitudminima(15);
              setLongitudmaxima(15);
              setTipocampo('[0-9]{15,15}');
              setTipocampovalidacion(/[0-9]/);
              setCampo('Numéricos');
              setTipodocumento('Permiso Especial de Permanencia');
            } else {
              if (valorupper == 'FFE88939-06D5-486C-887C-E52D50B7F35D' || valorupper == '71F659BE-9D6B-4169-9EE2-E70BF0D65F92') {
                setLongitudminima(10);
                setLongitudmaxima(11);
                setTipocampo('[a-zA-Z0-9]{10,11}');
                setTipocampovalidacion(/[a-zA-Z0-9]/);
                setCampo('AlfaNuméricos(Numéros y letras)');
                setTipodocumento('Registro Civil de Nacimiento y Numero único de identificacíon personal');
              } else {
                setLongitudminima(6);
                setLongitudmaxima(10);
                setTipocampo('[a-zA-Z0-9]{6,10}');
                setTipocampovalidacion(/[a-zA-Z0-9]/);
                setCampo('AlfaNuméricos(Numéros y letras)');
                setTipodocumento('Pasaporte , Cédula de Extranjería y  Tarjeta de Extranjería ');
              }
            }
          }
        }
      }
    }
  };

  const onSubmit = async (values: any) => {
    setStatus(undefined);

    const dep = values.departamento;
    var mun = values.municipio;
    switch (dep) {
      case '31b870aa-6cd0-4128-96db-1f08afad7cdd':
        mun = '31211657-3386-420a-8620-f9C07a8ca491';
        break;
    }

    const json: IRegistroSolicitudPrimeraVez<any> = {
      solicitud: {
        idTipoSolicitud: 'B1BA9304-C16B-43F0-9AFA-E92D7B7F3DF9',

        numeroRadicado: 0,
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
          vereda: values.vereda,
          sector: values.sector,
          upz: '00000000-0000-0000-0000-000000000000',
          barrio: '00000000-0000-0000-0000-000000000000',
          observacion: values.observations
        }
      }
    };

    await api.AddSolicitudPrimera(json);

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
                <div className='row mt-5'>
                  <div className='col-lg-6 col-md-6 col-sm-6'>
                    <div className='img-bogota '>
                      <img src={logo} alt='logo' className='img-fluid float-end mr-2' />
                    </div>
                  </div>
                  <div className='col-lg-6 col-md-6 col-sm-6'>
                    <div className='img-profile'>
                      <img src={profile} alt='logo' className='img-fluid float-end mr-2' />
                      <div className='info-usuario'>
                        <Form.Item>
                          <span className='ant-form-text mr-2 text'>{rol}</span>
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row mt-2'>
                  <div className='col-lg-6 col-sm-12 col-md-6'>
                    <div className='info-secion'>
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
                      <div className='col-lg-12 col-md-12 ml-4 col-sm-12 '>
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
                  <div className='col-lg-12 col-md-12'>
                    <div className='info-tramite mt-3 ml-3'>
                      <p>Trámite: Autorización sanitaria para la concesión de aguas para el consumo humano.</p>
                    </div>
                  </div>
                </div>
                <div className='row'>
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
                      <div className='form-group gov-co-form-group ml-2'>
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
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row mt-5 ml-2'>
                  <DatosSolicitante form={form} obj={null} />
                </div>
                <div className='row mt-5 ml-2'>
                  <UbicacionPersona form={form} obj={null} tipo={null} />
                </div>
                <div className='row mt-3 '>
                  <div className='col-lg-8 col-md-8 col-sm-12 mt-4'>
                    <div className='accion ml-4'>
                      <Button
                        className='ml-4 float-right button btn btn-default'
                        style={{ backgroundColor: '#BABABA', border: '2px solid #BABABA', color: '#000' }}
                        type='primary'
                        htmlType='submit'
                      >
                        Enviar
                      </Button>
                      <Button
                        className='float-right button btn btn-default'
                        style={{ backgroundColor: '#BABABA', border: '2px solid #BABABA', color: '#000' }}
                        type='primary'
                        htmlType='submit'
                        onClick={() => {
                          settemporal(true);
                        }}
                      >
                        Guardar
                      </Button>
                      <button className='mr-3 float-right button btn btn-default' style={{ backgroundColor: '#BABABA' }}>
                        Cancelar
                      </button>
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
