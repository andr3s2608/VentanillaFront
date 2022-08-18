import React, { useCallback, useEffect, useState } from 'react';
import logo from '../../../../src/assets/images/aguas/alcadia.png';
import '../../../css/estilos.css';
import profile from '../../../../src/assets/images/aguas/profile.png';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';
import { Form, Input } from 'antd';
import { DatosFuente } from './seccions/Fuente_Abastecimiento.seccion';
import { DatosSolicitante } from './seccions/DatosSolicitante.seccion';
import { layoutItems } from '../../shared/utils/form-layout.util';
import { useStepperForm } from '../../shared/hooks/stepper.hook';
import { DatosAcueducto } from './seccions/Acueductos.seccion';
import { DocumentacionAsociada } from './seccions/Documentacion_Asociada';
import { DatosAdicionales } from './seccions/Informacion_Adicional.seccion';
import { DatosDocumentos } from './seccions/Documentos.seccion';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { ApiService } from 'app/services/Apis.service';
import { EditAguas } from './edit/Aguas';
import { TipoNotificacion } from './seccions/Notificaciones_revision.seccion';
import { DatosSolicitud } from './seccions/Datos_Solicitud.seccion';
import { SelectComponent } from 'app/shared/components/inputs/select.component';

export const RevisarSg = () => {
  const [form] = Form.useForm<any>();
  const { setStatus } = useStepperForm<any>(form);
  const history = useHistory();
  const [documentos, setdocumentos] = useState<any[]>([]);
  const [rol, setrol] = useState<any>();
  const [usuarionotificado, setusuarionotificado] = useState<boolean>(false);
  const [estados, setl_estados] = useState<any[]>([]);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const objJson: any = EditAguas();

  const getListas = useCallback(
    async () => {
      const rolesstorage: any = localStorage.getItem('roles');

      const [permiso] = JSON.parse(rolesstorage);
      setrol(permiso?.rol);
      const estado = await api.getEstadosSolicitudAguas();
      const filtradodatos = estado.filter(function (f: { nombre: string }) {
        return f.nombre != 'En gestión' && f.nombre != 'Abierta';
      });

      setl_estados(filtradodatos);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notificado = () => {
    setusuarionotificado(true);
  };

  const onSubmit = async (values: any) => {
    let tiposolicitud: string = values.notificacion;
    let notificacion = '';
    let estadosolicitud = '';

    if (tiposolicitud === undefined) {
      tiposolicitud = '';
    }
    //subsanacion
    if (tiposolicitud.toLocaleUpperCase() === '6F8C18FE-69C2-40D7-BAF6-E9C1C7A44E09') {
      tiposolicitud = '9124A97B-C2BD-46A0-A8B3-1AC702A06C82';
      estadosolicitud = '96D00032-4B60-4027-AFEA-0CC7115220B4';
      notificacion = '8B6AB818-A560-4825-8C82-2CF4B9C58914';
    }
    //desistimiento
    if (tiposolicitud.toLocaleUpperCase() === 'C7820293-C09E-4F86-A02F-9F299474C5B1') {
      tiposolicitud = '5AB0DF72-9909-4459-8D52-D04A3F2ADC9A';
      estadosolicitud = '2A31EB34-2AA0-428B-B8EF-A86683D8BB8D';
      notificacion = '655456F2-1B4D-4027-BE41-F9CE786B5380';
    }

    if (rol === 'Coordinador') {
      if (tiposolicitud === '') {
        tiposolicitud = '5290025A-0967-417A-9737-FA5EAE85D97B';
        estadosolicitud = '96D00032-4B60-4027-AFEA-0CC7115220B4';
      }
      await api.CambiarEstadoSolicitudAguas(objJson.idsolicitud, estadosolicitud, tiposolicitud);
    }
    if (rol === 'Funcionario' || rol === 'AdminTI') {
      if (tiposolicitud === '') {
        tiposolicitud = '8CA363C0-66AA-4273-8E63-CE3EAC234857';
        estadosolicitud = '96D00032-4B60-4027-AFEA-0CC7115220B4';
      }
      await api.CambiarEstadoSolicitudAguas(objJson.idsolicitud, estadosolicitud, tiposolicitud);
    }
    if (rol === 'Subdirector') {
      const estado = values.seguimiento;
      if (estado == '2e8808af-a294-4cde-8e9c-9a78b5172119') {
        notificacion = 'BFF184AD-107F-4ACD-8891-A0AF34793C0A';
      } else {
        notificacion = '655456F2-1B4D-4027-BE41-F9CE786B5380';
      }
      await api.CambiarEstadoSolicitudAguas(objJson.idsolicitud, estado, '2ED2F440-E976-4D92-B315-03276D9812F0');
    }

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
            idUsuario: objJson.idusuario
          });
        }
      });

      formData.append('containerName', 'aguahumanos');
      formData.append('oid', objJson.idusuario);

      await api.uploadFiles(formData);
      await api.AddSupportDocumentsAguas(supportDocumentsEdit);
    }
    if (!usuarionotificado) {
      if (notificacion != '') {
        const formato = await api.getFormatoAguas(notificacion);
        const control: string = formato['asuntoNotificacion'];
        switch (control) {
          case 'Notificación de Desistimiento':
            await api.sendEmail({
              to: objJson.correoElectronico,
              subject: 'Notificación de Desistimiento',
              body: formato['cuerpo']
            });
            break;
          case 'Notificación de subsanación':
            await api.sendEmail({
              to: objJson.correoElectronico,
              subject: 'Notificación de subsanación',
              body: formato['cuerpo']
            });
            break;

          case 'Notificación Aprobación al Ciudadano':
            const certificadoCiudadano = await api.getCertificadoAguas('4');

            await api.sendEmailAttachment({
              to: objJson.correoElectronico,
              subject: 'Notificación Aprobación al Ciudadano',
              body: agregarValoresDinamicos(
                formato['cuerpo'],
                ['~:~sistema-abastecimiento~:~', '~:~numero-resolucion~:~', '~:~fecha~:~'],
                [
                  objJson.fuenteabastecimientojson[0].nombrefuenteabastecimiento,
                  objJson.renovafuentejson[0].numeroResolucion,
                  objJson.renovafuentejson[0].fechaResolucion.substring(0, 10)
                ]
              ),
              attachment: certificadoCiudadano,
              AttachmentTitle: 'Autorización sanitaria para el tratamiento de aguas.pdf'
            });
            break;
        }
      }
    }
    history.push('/tramites-servicios-aguas');
    localStorage.removeItem('register');
  };
  function agregarValoresDinamicos(HTML: string, llavesAReemplazar: string[], valoresDinamicos: string[]): string {
    let nuevoHTML = HTML;

    for (let index = 0; index < llavesAReemplazar.length; index++) {
      nuevoHTML = nuevoHTML.replace(llavesAReemplazar[index], valoresDinamicos[index]);
    }

    return nuevoHTML;
  }

  const onSubmitFailed = () => setStatus('error');

  const adddocumentos = (value: any) => {
    setdocumentos(value);
  };
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
              </div>
            </section>

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
                <div className='row mt-5'>
                  <div className='col-lg-12 col-md-12 tramite tramite_titulo'>
                    <div className='info-tramite mt-3 ml-5'>
                      <p>Trámite: Autorización sanitaria para la concesión de aguas para el consumo humano.</p>
                    </div>
                  </div>
                </div>

                <div className='row mt-5 ml-2 datos_validador '>
                  <DatosSolicitud form={form} obj={objJson} tipo={'validacion'} habilitar={false} />
                </div>
              </div>
            </section>
            <section className='panel-solicitud mt-5 mb-5 datos_validadors'>
              <div className='container'>
                <div className='row'>
                  <div className='col-lg-10 col-sm-12 col-md-10'>
                    <div className='collapse-info'>
                      {rol != 'Subdirector' && (
                        <>
                          <div id='accordion'>
                            <div className='card'>
                              <div className='card-header' id='heading-2'>
                                <h5 className='mb-0'>
                                  <a
                                    className='collapsed'
                                    role='button'
                                    data-toggle='collapse'
                                    href='#collapse-2'
                                    aria-expanded='false'
                                    aria-controls='collapse-2'
                                  >
                                    Datos del solicitante
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-2' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='row mt-5 datos_validador'>
                                  <DatosSolicitante form={form} obj={objJson} tipo={''} habilitar={false} />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div id='accordion' className='mt-3'>
                            <div className='card'>
                              <div className='card-header' id='heading-2'>
                                <h5 className='mb-0'>
                                  <a
                                    className='collapsed'
                                    role='button'
                                    data-toggle='collapse'
                                    href='#collapse-3'
                                    aria-expanded='false'
                                    aria-controls='collapse-3'
                                  >
                                    Datos de la fuente de abastacemiento
                                  </a>
                                </h5>
                              </div>

                              <div id='collapse-3' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='row mt-5 ml-2'>
                                  <DatosFuente form={form} obj={objJson} tipo={''} habilitar={false} />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div id='accordion' className='mt-3'>
                            <div className='card'>
                              <div className='card-header' id='heading-2'>
                                <h5 className='mb-0'>
                                  <a
                                    className='collapsed'
                                    role='button'
                                    data-toggle='collapse'
                                    href='#collapse-4'
                                    aria-expanded='false'
                                    aria-controls='collapse-2'
                                  >
                                    Información de acueductos que captan la misma fuente
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-4' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='card-body'>
                                  <DatosAcueducto form={form} obj={objJson} prop={null} habilitar={false} />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div id='accordion' className='mt-3'>
                            <div className='card'>
                              <div className='card-header' id='heading-2'>
                                <h5 className='mb-0'>
                                  <a
                                    className='collapsed'
                                    role='button'
                                    data-toggle='collapse'
                                    href='#collapse-7'
                                    aria-expanded='false'
                                    aria-controls='collapse-2'
                                  >
                                    Información adicional de la fuente de abastecimiento
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-7' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='card-body'>
                                  <DatosAdicionales form={form} obj={objJson} tipo={''} prop={null} habilitar={false} />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div id='accordion' className='mt-3'>
                            <div className='card'>
                              <div className='card-header' id='heading-2'>
                                <h5 className='mb-0'>
                                  <a
                                    className='collapsed'
                                    role='button'
                                    data-toggle='collapse'
                                    href='#collapse-6'
                                    aria-expanded='false'
                                    aria-controls='collapse-2'
                                  >
                                    Documentación requisito
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-6' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='card-body'>
                                  <DatosDocumentos form={form} obj={objJson} prop={null} tipo={'gestion'} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      <div id='accordion' className='mt-3'>
                        <div className='card'>
                          <div className='card-header' id='heading-2'>
                            <h5 className='mb-0'>
                              <a
                                className='collapsed'
                                role='button'
                                data-toggle='collapse'
                                href='#collapse-8'
                                aria-expanded='false'
                                aria-controls='collapse-2'
                              >
                                Notificaciones generales de revisión
                              </a>
                            </h5>
                          </div>
                          <div id='collapse-8' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                            <div className='card-body'>
                              <div className='card-body'>
                                <div className='row mt-5 ml-2'>
                                  <TipoNotificacion form={form} obj={objJson} prop={notificado} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div id='accordion' className='mt-3'>
                        <div className='card'>
                          <div className='card-header' id='heading-2'>
                            <h5 className='mb-0'>
                              <a
                                className='collapsed'
                                role='button'
                                data-toggle='collapse'
                                href='#collapse-16'
                                aria-expanded='false'
                                aria-controls='collapse-2'
                              >
                                Documentación asociada a la revisión
                              </a>
                            </h5>
                          </div>
                          <div id='collapse-16' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                            <div className='row mt-5 ml-2'>
                              <DocumentacionAsociada form={form} obj={objJson} tipo={''} prop={adddocumentos} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {rol == 'Subdirector' && (
                        <>
                          <div id='accordion' className='mt-3'>
                            <div className='card'>
                              <div className='card-header' id='heading-2'>
                                <h5 className='mb-0'>
                                  <a
                                    className='collapsed'
                                    role='button'
                                    data-toggle='collapse'
                                    href='#collapse-11'
                                    aria-expanded='false'
                                    aria-controls='collapse-2'
                                  >
                                    Generar acto administrativo de aprobación
                                  </a>
                                </h5>
                              </div>
                              <div id='collapse-11' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                                <div className='col-lg-4 col-sm-4 col-md-4 mt-2'>
                                  <div className='panel-search'>
                                    <p>Seguimiento</p>
                                    <div className='form-group gov-co-form-group'>
                                      <Form.Item name='seguimiento' rules={[{ required: true }]}>
                                        <SelectComponent
                                          options={estados}
                                          optionPropkey='idEstadoSolicitud'
                                          optionPropLabel='nombre'
                                        />
                                      </Form.Item>
                                    </div>
                                  </div>
                                </div>
                                <div className='card-body' style={{ backgroundColor: '#ede9e3' }}>
                                  <div className='row mt-3'>
                                    <div className='col-md-12 col-lg-12 col-sm-12'>
                                      <div className='form-group gov-co-form-group'>
                                        <Form.Item initialValue={''} name='observationsgestion' rules={[{ required: false }]}>
                                          <Input.TextArea rows={5} maxLength={230} style={{ width: '300px' }} />
                                        </Form.Item>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='row mt-4'>
                                    <div className='col-lg-12 col-md-12 col-sm-1'>
                                      <Button
                                        className='btn btn-default'
                                        style={{
                                          backgroundColor: '#CBCBCB',
                                          float: 'right'
                                        }}
                                      >
                                        Ver vista previa
                                      </Button>
                                      <Button
                                        className='mr-3 btn btn-default'
                                        style={{
                                          backgroundColor: '#CBCBCB',
                                          float: 'right'
                                        }}
                                      >
                                        Notificar
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className='row mt-4' style={{ marginLeft: '420px' }}>
                  <div className='col-lg-8 col-md-8 col-sm-12 mt-2'>
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
                      htmlType='button'
                      style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                      onClick={() => {
                        history.push('/tramites-servicios/Revision/aprobar-tramite');
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
