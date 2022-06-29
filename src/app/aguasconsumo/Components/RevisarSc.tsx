import logo from '../../../../src/assets/images/aguas/alcadia.png';
import '../../../../src/scss/antd/App.css';
import profile from '../../../../src/assets/images/aguas/profile.png';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';
import { Form, Input } from 'antd';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import { DatosSolicitante } from './seccions/DatosSolicitante.seccion';
import { UbicacionPersona } from './seccions/Ubicacion.seccion';
import { DatosSolicitud } from './seccions/Datos_Solicitud.seccion';
import { IRegistroSolicitudCitacion } from 'app/aguasconsumo/Components/Models/IRegistroSolicitudCitacion';
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
import { EditAguas } from './edit/Aguas';

export const RevisarSc = () => {
  const objJson: any = EditAguas();

  const [l_tipos_documento, setListaTipoDocumento] = useState<IDominio[]>([]);
  const history = useHistory();
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();

  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);

  //validacion campos
  const [longitudmaxima, setLongitudmaxima] = useState<number>(10);
  const [longitudminima, setLongitudminima] = useState<number>(5);
  const [tipocampo, setTipocampo] = useState<string>('[0-9]{5,10}');
  const [tipocampovalidacion, setTipocampovalidacion] = useState<any>(/[0-9]/);
  const [tipodocumento, setTipodocumento] = useState<string>('Cédula de Ciudadanía');
  const [campo, setCampo] = useState<string>('Numéricos');

  const [sininformacion, setsininformacion] = useState<boolean>(false);
  //

  const getListas = useCallback(
    async () => {
      //const resp = await dominioService.get_type(ETipoDominio['Tipo Documento']);
      const tipoDocumento = await dominioService.get_type(ETipoDominio['Tipo Documento']);

      setListaTipoDocumento(tipoDocumento);
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

    const dep = values.departamento;
    var mun = values.municipio;
    switch (dep) {
      case '31b870aa-6cd0-4128-96db-1f08afad7cdd':
        mun = '31211657-3386-420a-8620-f9C07a8ca491';
        break;
    }

    const json: IRegistroSolicitudCitacion<any> = {
      solicitud: {
        idSolicitud: objJson.idsolicitud + '',
        idPersona: objJson.idPersona + '',
        idTipodeSolicitud: objJson.idtipodeSolicitud,
        tipodeSolicitud: objJson.tipodeSolicitud,
        numeroRadicado: objJson.numeroradicado,
        fechaSolicitud: objJson.fechaSolicitud,
        idEstado: values.estado,
        estado: '',
        idFuente: '00000000-0000-0000-0000-000000000000',
        idUbicacion: objJson.idUbicacion,
        idSubred: values.subred,
        idActividadActualSolicitud: values.actactual,
        actividadActualSolicitud: '',
        actividadSiguienteSolicitud: values.actsiguiente,

        idTipodeTramite: values.tipotramite,
        tipodeTramite: '',
        idUsuario: objJson.idusuario,
        idCitacionRevision: '00000000-0000-0000-0000-000000000000',

        idFuenteAbastecimiento: '00000000-0000-0000-0000-000000000000',
        temporal: false,

        persona: {
          idPersona: objJson.idPersona,
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
          idUbicacion: objJson.idUbicacion,
          direccion: values.direccion,
          departamento: values.departamento,
          municipio: mun,
          localidad: values?.localidad ?? '00000000-0000-0000-0000-000000000000',
          vereda: values.vereda,
          sector: values.sector,
          upz: objJson.upz,
          barrio: objJson.barrio,
          observacion: values.observations
        },

        citacion_Revision: {
          idCitacion: '00000000-0000-0000-0000-000000000000',
          fechaCitacion: '',
          observacion: 'No_aplica',
          fechaRegistro: '',
          idSolicitud: '00000000-0000-0000-0000-000000000000'
        }
      }
    };

    await api.AddSolicitudCitacion(json);
    history.push('/tramites-servicios-aguas');
  };

  const onSubmitFailed = () => setStatus('error');

  return (
    <Form form={form} {...layoutItems} layout='horizontal' onFinish={onSubmit} onFinishFailed={onSubmitFailed}>
      <div>
        <section className='info-panel'>
          <div className='container'>
            <div className='row mt-5'>
              <div className='col-lg-6 col-md-6 col-sm-6'>
                <div className='img-bogota'>
                  <img src={logo} alt='logo' className='img-fluid float-end ml-2' />
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-6'>
                <div className='img-profile'>
                  <img src={profile} alt='logo' className='img-fluid float-end mr-2' />
                  <div className='info-usuario'>
                    <p>Subdirector</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='row mt-2'>
              <div className='col-lg-6 col-sm-12 col-md-6'>
                <div className='info-secion'>
                  <nav aria-label='breadcrumb' style={{ backgroundColor: '#fff' }}>
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
          </div>
        </section>

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
            <div className='row'>
              <div className='col-lg-12 col-md-12'>
                <div className='info-tramite mt-3 ml-2'>
                  <p>Trámite: Autorización sanitaria para la concesión de aguas para el consumo humano.</p>
                </div>
              </div>
            </div>

            <DatosSolicitud form={form} obj={objJson} />

            <DatosSolicitante form={form} obj={objJson} />

            <UbicacionPersona form={form} obj={objJson} tipo={objJson.tipodeSolicitud} />

            <div className='row mt-3 '>
              <div className='col-lg-8 col-md-8 col-sm-12 mt-4'>
                <Button
                  className='ml-3 float-right button btn btn-default'
                  style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                  type='primary'
                  htmlType='submit'
                >
                  Enviar
                </Button>
                <button className='float-right button btn btn-default' style={{ backgroundColor: ' #CBCBCB' }}>
                  Guardar
                </button>
                <button className='mr-3 float-right button btn btn-default' style={{ backgroundColor: ' #CBCBCB' }}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Form>
  );
};
