import React, { useCallback, useEffect, useState } from 'react';
import logo from '../../../../src/assets/images/aguas/alcadia.png';

import profile from '../../../../src/assets/images/aguas/profile.png';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';
import { Form, Input, Upload } from 'antd';

import { authProvider } from 'app/shared/utils/authprovider.util';
import { ApiService } from 'app/services/Apis.service';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import Swal from 'sweetalert2';

import { DatosSolicitud } from './seccions/Datos_Solicitud.seccion';
import { DatosSolicitante } from './seccions/DatosSolicitante.seccion';
import { CitacionRevision } from './seccions/Citacion_Revision.seccion';
import { IRegistroSolicitudCitacion } from 'app/aguasconsumo/Components/Models/IRegistroSolicitudCitacion';
import { UbicacionPersona } from './seccions/Ubicacion.seccion';
import { EditAguas } from './edit/Aguas';
import moment from 'moment';
import '../../../css/estilos.css';

export const RevisarSv = () => {
  const objJson: any = EditAguas();

  const history = useHistory();
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();

  const { setStatus } = useStepperForm<any>(form);

  //validacion campos

  const [rol, setrol] = useState<any>();

  const getListas = useCallback(
    async () => {
      const rolesstorage: any = localStorage.getItem('roles');

      const [permiso] = JSON.parse(rolesstorage);

      setrol(permiso.rol);

      const lusuarios = await api.getFuncionarios();
      const usuarios: any[] = [];
      usuarios.push({ idPersona: 'vacio', fullName: 'No Asignar', oid: 'vacio' });

      for (let index = 0; index < lusuarios.length; index++) {
        usuarios.push(lusuarios.at(index));
      }
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
    const formatDate = 'MM-DD-YYYY';
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
        idTipodeSolicitud: '8F5B3DA8-1CD1-4E6C-874C-501245AE9279',
        tipodeSolicitud: '8F5B3DA8-1CD1-4E6C-874C-501245AE9279',
        numeroRadicado: objJson.numeroradicado,
        fechaSolicitud: objJson.fechaSolicitud,
        idEstado: values.estado,
        estado: '',
        idFuente: '00000000-0000-0000-0000-000000000000',
        idUbicacion: objJson.idUbicacion,
        idSubred: objJson.idSubred,
        idActividadActualSolicitud: '771FA7F5-4C75-4AC3-95A1-7F78C29D2F50',
        actividadActualSolicitud: '',
        actividadSiguienteSolicitud: objJson?.idactividadActualSolicitud,

        idTipodeTramite: values.tipotramite,
        tipodeTramite: '',
        idUsuario: objJson.idusuario,
        idUsuarioAsignado: objJson.idusuarioAsignado,
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
          vereda: '',
          sector: '',
          upz: objJson.upz,
          barrio: objJson.barrio,
          observacion: ''
        },

        citacion_Revision: {
          idCitacion: '00000000-0000-0000-0000-000000000000',
          fechaCitacion: moment(values.date).format(formatDate),
          observacion: values.observationsCitacion,
          fechaRegistro: '',
          idSolicitud: '00000000-0000-0000-0000-000000000000',
          idUsuario: values.funcionario
        }
      }
    };

    await api.AddSolicitudCitacion(json);

    const supportDocumentsEdit: any[] = [];
    const formData = new FormData();

    const archivovacio = values.cargarArchivo;

    if (archivovacio != undefined) {
      const archivo = archivovacio.file;
      formData.append('file', archivo);
      formData.append('nameFile', 'Documento_revision' + '_' + objJson.idsolicitud);

      supportDocumentsEdit.push({
        idSolicitud: objJson.idsolicitud,
        idTipoDocumentoAdjunto: '3C9CF345-E37D-4AB0-BACA-C803DBB5380B',
        path: `${objJson.idusuario}/Documento_revision_${objJson.idsolicitud}`,
        idUsuario: objJson.idusuario,
        idDocumentoAdjunto: '00000000-0000-0000-0000-000000000000',
        esValido: true
      });

      formData.append('containerName', 'aguahumanos');
      formData.append('oid', objJson.idusuario);

      await api.uploadFiles(formData);
      await api.AddSupportDocumentsAguas(supportDocumentsEdit);
    }

    const formato = await api.getFormatoAguas('3DB34F22-4A32-431D-B136-31A8D60CA604');

    await api.sendEmail({
      to: objJson.correoElectronico,
      subject: 'Notificación de visita en campo',
      body: formato['cuerpo']
    });

    Swal.fire({
      icon: 'success',

      title: 'Citación Agendada',
      text: `Se ha agendado la citación para el solicitud con número de radicado:${objJson.numeroradicado}
       para el dia ${moment(values.date).format(formatDate)}`
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
              <div className='container-fluid'>
                <div className='row mt-2 ml-2'>
                  <div className='col-lg-6 col-sm-12 col-md-6'>
                    <div className='info-secion'>
                      <nav aria-label='breadcrumb'>
                        <ol className='breadcrumb'>
                          <li className='breadcrumb-item'>
                            <a href='#' style={{ textDecoration: 'none' }}>
                              Inicio
                            </a>
                          </li>
                          <li className='breadcrumb-item'>
                            <a href='#' style={{ textDecoration: 'none' }}>
                              Bandeja de entrada
                            </a>
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
                  <div className='col-lg-12 col-md-12 tramite tramite_titulo'>
                    <div className='info-tramite mt-3 ml-5'>
                      <p>Trámite: Autorización sanitaria para la concesión de aguas para el consumo humano.</p>
                    </div>
                  </div>
                </div>
                <div className='row mt-5 ml-2'>
                  <DatosSolicitud form={form} obj={objJson} tipo={'validador'} habilitar={false} />
                </div>
                <div className='row mt-5 ml-2'>
                  <DatosSolicitante form={form} obj={objJson} tipo={'coordinador'} habilitar={false} />
                </div>
                <div className='row mt-5 ml-2'>
                  <UbicacionPersona form={form} obj={objJson} tipo={objJson.tipodeSolicitud} vista={'revision'} />
                </div>
                <div className='row mt-5 ml-2'>
                  <CitacionRevision form={form} obj={objJson} tipo={'Funcionario'} />
                </div>
                <div className='row mt-3 '>
                  <div className='col-lg-8 col-md-8 col-sm-12 mt-4'>
                    <div className='accion ml-4'>
                      <Button
                        className='ml-3 float-right button btn btn-default'
                        style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                        type='primary'
                        htmlType='submit'
                      >
                        Enviar
                      </Button>

                      <Button
                        className='mr-3 float-right button btn btn-default'
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
              </div>
            </section>
          </Form>
        </div>
      </div>
    </div>
  );
};
