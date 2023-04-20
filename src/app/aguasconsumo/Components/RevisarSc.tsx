import logo from '../../../../src/assets/images/aguas/alcadia.png';
import '../../../css/estilos.css';
import profile from '../../../../src/assets/images/aguas/profile.png';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';
import { Form, Input } from 'antd';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import { DatosSolicitante } from './seccions/DatosSolicitante.seccion';
import { UbicacionPersona } from './seccions/Ubicacion.seccion';
import { DatosSolicitud } from './seccions/Datos_Solicitud.seccion';
import { IRegistroSolicitudCitacion } from 'app/aguasconsumo/Models/IRegistroSolicitudCitacion';
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

  const history = useHistory();
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();

  const { setStatus } = useStepperForm<any>(form);

  //validacion campos

  //
  const [rol, setrol] = useState<any>();

  const getListas = useCallback(
    async () => {
      const rolesstorage: any = localStorage.getItem('roles');

      const [permiso] = JSON.parse(rolesstorage);

      setrol(permiso.rol);
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

    const us = api.getIdUsuario();
    const usuario = us + '';

    const json: IRegistroSolicitudCitacion<any> = {
      solicitud: {
        idSolicitud: objJson.idsolicitud + '',
        idPersona: objJson.idPersona + '',
        idTipodeSolicitud: 'D33FBB9C-9F47-4015-BBE6-96FF43F0DDE4',
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
        actividadSiguienteSolicitud: values.actactual,

        idTipodeTramite: values.tipotramite,
        tipodeTramite: '',
        idUsuario: objJson.idusuario,
        idUsuarioAsignado: usuario,
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
          correoElectronico: values.email.toString().toLowerCase(),
          idTipoPersona: values.persona,
          tipoDocumentoRazon: values?.IDTypeRazon ?? '',
          nit: values?.IDNumberRazon ?? '',
          razonSocial: values?.nombreEntidad ?? ''
        },

        ubicacion: {
          idUbicacion: objJson.idUbicacion,
          direccion: objJson.direccion,
          departamento: '00000000-0000-0000-0000-000000000000',
          municipio: '00000000-0000-0000-0000-000000000000',
          localidad: objJson.localidad,
          vereda: '',
          sector: objJson.sector,
          upz: objJson.upz,
          barrio: objJson.barrio,
          observacion: ''
        },

        citacion_Revision: {
          idCitacion: '00000000-0000-0000-0000-000000000000',
          fechaCitacion: '',
          observacion: 'No_aplica',
          fechaRegistro: '',
          idSolicitud: '00000000-0000-0000-0000-000000000000',
          idUsuario: '00000000-0000-0000-0000-000000000000'
        }
      }
    };

    await api.AddSolicitudCitacion(json);

    Swal.fire({
      icon: 'success',

      title: 'Solicitud validada',
      text: `Se ha validado la Solicitud exitosamente`
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
                  <div className='col-lg-12 col-md-12 mt-3'>
                    <div className='info-tramite'>
                      <p style={{ marginLeft: '-11px' }}>Trámite: Autorización sanitaria para la concesión de aguas para el consumo humano.</p>
                    </div>
                  </div>
                </div>
                <div className='row mt-2 ml-2 primeros_campos'>
                  <DatosSolicitud form={form} obj={objJson} tipo={'coordinador'} habilitar={true} />
                </div>
                <div className='row mt-5 ml-2'>
                  <DatosSolicitante form={form} obj={objJson} tipo={'coordinador'} habilitar={false} />
                </div>
                <div className='row mt-5 ml-2'>
                  <UbicacionPersona form={form} obj={objJson} tipo={objJson.tipodeSolicitud} vista={'revision'} />
                </div>
                <div className='row mt-3 justify-content-center'>
                  <div className='col-lg-8 col-md-12 col-sm-12 mt-4 text-center colprueba'>
                    <Button
                      className='ml-3 float-right button btn btn-default send'
                      style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                      type='primary'
                      htmlType='submit'
                    >
                      Enviar
                    </Button>

                    <Button
                      className='mr-3 float-right button btn btn-default send'
                      type='primary'
                      style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                      onClick={() => {
                        history.push('/tramites-servicios-aguas');
                      }}
                    >
                      Cancelar
                    </Button>
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
