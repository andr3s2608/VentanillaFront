import React, {useCallback, useEffect, useState} from 'react';
import logo from '../../../../src/assets/images/aguas/alcadia.png';

import profile from '../../../../src/assets/images/aguas/profile.png';
import Button from 'antd/es/button';
import {useHistory} from 'react-router';
import {Form, Input, Upload} from 'antd';

import {authProvider} from 'app/shared/utils/authprovider.util';
import {ApiService} from 'app/services/Apis.service';
import {useStepperForm} from 'app/shared/hooks/stepper.hook';
import {layoutItems, layoutWrapper} from 'app/shared/utils/form-layout.util';
import Swal from 'sweetalert2';

import {DatosSolicitud} from './seccions/Datos_Solicitud.seccion';
import {DatosSolicitante} from './seccions/DatosSolicitante.seccion';
import {CitacionRevision} from './seccions/Citacion_Revision.seccion';
import {IRegistroSolicitudCitacion} from 'app/aguasconsumo/Models/IRegistroSolicitudCitacion';
import {UbicacionPersona} from './seccions/Ubicacion.seccion';
import {EditAguas} from './edit/Aguas';
import moment from 'moment';
import '../../../css/estilos.css';
import {DatosFuente} from './seccions/Fuente_Abastecimiento.seccion';
import {TipoNotificacion} from './seccions/Notificaciones_revision.seccion';
import {DatosDocumentos} from './seccions/Documentos.seccion';
import {DatosAdicionales} from './seccions/Informacion_Adicional.seccion';
import {DatosAcueducto} from './seccions/Acueductos.seccion';
import {DocumentacionAsociada} from './seccions/Documentacion_Asociada';
import {store} from 'app/redux/app.reducers';
import {IObservaciones} from './Models/IObservaciones';

export const RevisarSv = () => {
  const objJson: any = EditAguas();

  const history = useHistory();
  const {accountIdentifier} = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();

  const {setStatus} = useStepperForm<any>(form);

  //validacion campos

  const [rol, setrol] = useState<any>();
  const [documentos, setdocumentos] = useState<any[]>([]);
  const [usuarionotificado, setusuarionotificado] = useState<boolean>(false);
  const [subasanacion, setsubsanacion] = useState<boolean>(false);


  const getListas = useCallback(
    async () => {
      const rolesstorage: any = localStorage.getItem('roles');

      const [permiso] = JSON.parse(rolesstorage);

      setrol(permiso.rol);

      const lusuarios = await api.getFuncionarios();
      const usuarios: any[] = [];
      usuarios.push({idPersona: 'vacio', fullName: 'No Asignar', oid: 'vacio'});

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

  const adddocumentos = (value: any) => {
    setdocumentos(value);
  };
  const notificado = (tipo: any) => {
    setusuarionotificado(true);
    if (tipo === 'Notificación de subsanación') {
      setsubsanacion(true);
    }

  };


  const onSubmit = async (values: any) => {
    setStatus(undefined);

    /** tener mucho ojo con este sección de código */
    const {seguimientoDocumentos} = store.getState();


    const formatDate = 'MM-DD-YYYY';


    let observaciones: any = [];

    if (values.descripcionNotificacion !== '') {

      observaciones.push(
        {
          idObservacion: '00000000-0000-0000-0000-000000000000',
          idSolicitud: 'Observaciones Notificacion:' + objJson.idsolicitud,
          idSubred: objJson.idSubred,
          observacion: values.descripcionNotificacion,
          fechaObservacion: null
        }
      )

    }
    if (values.observacionesSubsanacion != null && values.observacionesSubsanacion != '') {
      observaciones.push(
        {
          idObservacion: '00000000-0000-0000-0000-000000000000',
          idSolicitud: 'Observaciones Documentos:' + objJson.idsolicitud,
          idSubred: objJson.idSubred,
          observacion: values.observacionesSubsanacion,
          fechaObservacion: null
        }
      )
    }
    let subsanaciones = false;
    let tipo = 'B1BA9304-C16B-43F0-9AFA-E92D7B7F4DF6';
    if (seguimientoDocumentos && seguimientoDocumentos.length > 0) {
      const documentToSend: IEstadoDocumentoSoporteDTO[] = [];

      seguimientoDocumentos.forEach((item: any) => {
        documentToSend.push({
          idSolicitud: item.idSolicitud,
          idDocumentoSoporte: item.idDocumentoSoporte,
          path: item.path,
          observaciones: values.observacionesSubsanacion + '',
          estado_Documento: item.estadoDocumento,
          tipoSeguimiento: item.tipoSeguimiento
        });
        if (item.estadoDocumento === 'No Cumple') {
          subsanaciones = true;

        }
      });


      await api.AddEstadoDocumentoSoporte(documentToSend);
    }

    if (subsanaciones || subasanacion) {


      tipo = '9124A97B-C2BD-46A0-A8B3-1AC702A06C82';
      if (!usuarionotificado) {
        const formato = await api.getFormatoAguas('8B6AB818-A560-4825-8C82-2CF4B9C58914');
        await api.sendEmail({
          to: objJson.correoElectronico,
          subject: 'Notificación de subsanación',
          body: formato['cuerpo']
        });
      }
      //await api.CambiarEstadoSolicitudAguas(objJson.idsolicitud, '96D00032-4B60-4027-AFEA-0CC7115220B4',
      // '9124A97B-C2BD-46A0-A8B3-1AC702A06C82');
    }


    const json: IObservaciones<any> = {

      idSolicitud: objJson.idsolicitud,
      idTipoSolicitud: tipo,

      observaciones: observaciones,

      citacion: {
        idCitacion: '00000000-0000-0000-0000-000000000000',
        fechaCitacion: moment(values.date).format(formatDate),
        observacion: values.observationsCitacion,
        fechaRegistro: '',
        idSolicitud: '00000000-0000-0000-0000-000000000000',
        idUsuario: values.funcionario
      }

    };


    await api.AddObservaciones(json, '1');

    await api.CambiarEstadoSolicitudAguas(objJson.idsolicitud, tipo === 'B1BA9304-C16B-43F0-9AFA-E92D7B7F4DF6' ? '6A5913B7-5790-4E11-BF32-D327B98C2E0F' :
        '96D00032-4B60-4027-AFEA-0CC7115220B4',
      tipo);

    const supportDocumentsEdit: any[] = [];
    const formData = new FormData();

    if (documentos.length > 0) {
      documentos.forEach((item: any, i: number) => {
        if (documentos[i] != undefined) {
          const archivo = documentos[i];

          formData.append('file', archivo.archivo.file);
          formData.append('nameFile', 'Documentos_Asociados' + '_' + objJson.idsolicitud);

          supportDocumentsEdit.push({
            idSolicitud: objJson.idsolicitud,
            idTipoDocumentoAdjunto: '96D00032-4B60-4027-AFEA-0CC7115220B4',
            path: `${objJson.idusuario}/Documentos_Asociados_${objJson.idsolicitud}`,
            idUsuario: objJson.idusuario,
            idDocumentoAdjunto: '00000000-0000-0000-0000-000000000000',
            esValido: true
          });
        }
      });

      formData.append('containerName', 'aguahumanos');
      formData.append('oid', objJson.idusuario);

      await api.uploadFiles(formData);
      await api.AddSupportDocumentsAguas(supportDocumentsEdit);
    }


    if (tipo === 'B1BA9304-C16B-43F0-9AFA-E92D7B7F4DF6') {
      const formato = await api.getFormatoAguas('3DB34F22-4A32-431D-B136-31A8D60CA604');
      await api.sendEmail({
        to: objJson.correoElectronico,
        subject: 'Notificación de visita en campo',
        body: formato['cuerpo']
      });

      Swal.fire({
        icon: 'success',

        title: 'Citación Agendada',
        text: `Se ha agendado la citación para la solicitud con el Número de Radicación:${objJson.consecutivo}
       para el dia ${moment(values.date).format(formatDate)}`
      });

    }

    /*
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
*/


    history.push('/tramites-servicios-aguas');
  };


  const AsinarSubred = async () => {

    const subrednueva = form.getFieldValue('funcionario')
    if (subrednueva === undefined) {
      Swal.fire({
        icon: 'error',

        title: 'Datos Invalidos',
        text: `Debe seleccionar una subred para realizar la reasignación`
      });
    } else {
      Swal.fire({
        title: 'Reasignación de Solicitud',
        text: 'Esta a punto de realizar una Reasignación a la solicitud, ¿Está seguro de continuar?',
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: 'Reasignar',
        denyButtonText: `Cancelar`,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        icon: 'info'
      }).then(async (result) => {
        if (result.isConfirmed) {


          await api.AsignarSubred(subrednueva, objJson.idsolicitud)

          Swal.fire({
            icon: 'success',

            title: 'Solicitud Reasignada',
            text: `Se ha reasignado la solicitud Exitosamente`
          });
        }


      });
    }


  }


  const onSubmitFailed = () => setStatus('error');

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
          <Form form={form} {...layoutItems} layout="horizontal" onFinish={onSubmit} onFinishFailed={onSubmitFailed}>
            <section className="info-panel">
              <div className="container-fluid">
                <div className="row mt-2 ml-2">
                  <div className="col-lg-6 col-sm-12  col-xs-12 col-md-6">
                    <div className="info-secion">
                      <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                          <li className="breadcrumb-item">
                            <a href="#" style={{textDecoration: 'none'}}>
                              Inicio
                            </a>
                          </li>
                          <li className="breadcrumb-item">
                            <a href="#" style={{textDecoration: 'none'}}>
                              Bandeja de entrada
                            </a>
                          </li>
                          <li className="breadcrumb-item active" aria-current="page">
                            Revisar solicitud
                          </li>
                        </ol>
                      </nav>
                    </div>
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-lg-12 col-md-12 ">
                    <div className="info-tramite mt-3">
                      <p>Trámite: Autorización sanitaria para la concesión de aguas para el consumo humano.</p>
                    </div>
                  </div>
                </div>
                <div id="accordion" className="mt-3">
                  <div className="card">
                    <div className="card-header" id="heading-2">
                      <h5 className="mb-0">
                        <a
                          className="collapsed"
                          role="button"
                          data-toggle="collapse"
                          href="#collapse-1"
                          aria-expanded="false"
                          aria-controls="collapse-2"
                        >
                          Datos de la Solicitud
                        </a>
                      </h5>
                    </div>
                    <div id="collapse-1" className="collapse" data-parent="#accordion" aria-labelledby="heading-2">
                      <div className="row mt-5 datos_validador">
                        <DatosSolicitud form={form} obj={objJson} tipo={'validador'} habilitar={false}/>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="accordion" className="mt-3">
                  <div className="card">
                    <div className="card-header" id="heading-2">
                      <h5 className="mb-0">
                        <a
                          className="collapsed"
                          role="button"
                          data-toggle="collapse"
                          href="#collapse-2"
                          aria-expanded="false"
                          aria-controls="collapse-2"
                        >
                          Datos del solicitante
                        </a>
                      </h5>
                    </div>
                    <div id="collapse-2" className="collapse" data-parent="#accordion" aria-labelledby="heading-2">
                      <div className="row mt-5 datos_validador">
                        <DatosSolicitante form={form} obj={objJson} tipo={'validador'} habilitar={false}/>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="accordion" className="mt-3">
                  <div className="card">
                    <div className="card-header" id="heading-2">
                      <h5 className="mb-0">
                        <a
                          className="collapsed"
                          role="button"
                          data-toggle="collapse"
                          href="#collapse-3"
                          aria-expanded="false"
                          aria-controls="collapse-3"
                        >
                          Datos de la fuente de abastacemiento
                        </a>
                      </h5>
                    </div>

                    <div id="collapse-3" className="collapse" data-parent="#accordion" aria-labelledby="heading-2">
                      <div className="row mt-5 ml-2">
                        <DatosFuente form={form} obj={objJson} tipo={''} habilitar={false}/>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="accordion" className="mt-3">
                  <div className="card">
                    <div className="card-header" id="heading-2">
                      <h5 className="mb-0">
                        <a
                          className="collapsed"
                          role="button"
                          data-toggle="collapse"
                          href="#collapse-4"
                          aria-expanded="false"
                          aria-controls="collapse-2"
                        >
                          Información de acueductos que captan la misma fuente
                        </a>
                      </h5>
                    </div>
                    <div id="collapse-4" className="collapse" data-parent="#accordion" aria-labelledby="heading-2">
                      <div className="card-body">
                        <DatosAcueducto tipoSolicitud="revision" form={form} obj={objJson} prop={null} habilitar={false}/>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="accordion" className="mt-3">
                  <div className="card">
                    <div className="card-header" id="heading-2">
                      <h5 className="mb-0">
                        <a
                          className="collapsed"
                          role="button"
                          data-toggle="collapse"
                          href="#collapse-7"
                          aria-expanded="false"
                          aria-controls="collapse-2"
                        >
                          Información adicional de la fuente de abastecimiento
                        </a>
                      </h5>
                    </div>
                    <div id="collapse-7" className="collapse" data-parent="#accordion" aria-labelledby="heading-2">
                      <div className="card-body">
                        <DatosAdicionales tipoSolicitud="revision" form={form} obj={objJson} tipo={''} prop={null}
                                          habilitar={false}/>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="accordion" className="mt-3">
                  <div className="card">
                    <div className="card-header" id="heading-2">
                      <h5 className="mb-0">
                        <a
                          className="collapsed"
                          role="button"
                          data-toggle="collapse"
                          href="#collapse-8"
                          aria-expanded="false"
                          aria-controls="collapse-2"
                        >
                          Documentación requisito
                        </a>
                      </h5>
                    </div>
                    <div id="collapse-8" className="collapse" data-parent="#accordion" aria-labelledby="heading-2">
                      <div className="card-body">
                        <DatosDocumentos form={form} obj={objJson} prop={null} tipo={'gestion'}/>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="accordion" className="mt-3">
                  <div className="card">
                    <div className="card-header" id="heading-2">
                      <h5 className="mb-0">
                        <a
                          className="collapsed"
                          role="button"
                          data-toggle="collapse"
                          href="#collapse-9"
                          aria-expanded="false"
                          aria-controls="collapse-2"
                        >
                          Notificaciones generales de revisión
                        </a>
                      </h5>
                    </div>
                    <div id="collapse-9" className="collapse" data-parent="#accordion" aria-labelledby="heading-2">
                      <div className="card-body">
                        <div className="card-body">
                          <div className="row mt-5 ml-2">
                            <TipoNotificacion form={form} obj={objJson} prop={notificado}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="row mt-5 ml-2">
                  <UbicacionPersona form={form} obj={objJson} tipo={objJson.tipodeSolicitud} vista={'revision'}/>
                </div>
                <div className="row mt-5 ml-2">
                  <CitacionRevision form={form} obj={objJson} tipo={'Funcionario'} prop={AsinarSubred}/>
                </div>

                <div className="row justify-content-center align-items-center">
                  <div className="col-lg-3 col-md-3 col-sm-12 mt-3" style={{ marginLeft: '50px' }}>
                    <Button
                      id="send"
                      className="ml-3 float-right button btn btn-default"
                      style={{backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000'}}
                      type="primary"
                      htmlType="submit"
                    >
                      Enviar
                    </Button>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-12 mt-3">
                    <Button
                      className="mr-3 float-right button btn btn-default"
                      type="primary"
                      style={{backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000'}}
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

interface IEstadoDocumentoSoporteDTO {
  idSolicitud: string;
  idDocumentoSoporte: string;
  path: string;
  observaciones: string;
  estado_Documento: string;
  tipoSeguimiento: string;
}

interface IAutoridadAmbientalDTO {
  idAutoridadAmbiental: string;
  nombre: string;
  estado: boolean;
  correo: string;
}
