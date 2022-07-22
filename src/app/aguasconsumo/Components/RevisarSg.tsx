import React, { useState } from 'react';
import logo from '../../../../src/assets/images/aguas/alcadia.png';
import '../../../css/estilos.css';
import profile from '../../../../src/assets/images/aguas/profile.png';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';
import { Form, Input } from 'antd';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { DatosFuente } from './seccions/Fuente_Abastecimiento.seccion';
import { DatosSolicitante } from './seccions/DatosSolicitante.seccion';
import { layoutItems } from '../../shared/utils/form-layout.util';
import { useStepperForm } from '../../shared/hooks/stepper.hook';
import { DatosAcueducto } from './seccions/Acueductos.seccion';
import { DocumentacionAsociada } from './seccions/Documentacion_Asociada';
import { DatosAdicionales } from './seccions/Informacion_Adicional.seccion';
import { DatosDocumentos } from './seccions/Documentos.seccion';
import { EditAguas } from './edit/Aguas';
import { TipoNotificacion } from './seccions/Notificaciones_revision.seccion';

export const RevisarSg = () => {
  const [form] = Form.useForm<any>();
  const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);
  const history = useHistory();
  const [documentos, setdocumentos] = useState<any[]>([]);
  const onSubmit = async (values: any) => {};
  const onSubmitFailed = () => setStatus('error');
  const objJson: any = EditAguas();
  console.log(objJson);

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
                      <nav aria-label='breadcrumb' style={{ backgroundColor: '#fff ' }}>
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
                <div className='row'>
                  <div className='col-lg-12 col-sm-12 col-md-12'>
                    <div className='info-tramite mt-2'>
                      <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        Datos de la solicitud. <br /> <small style={{ color: '#000' }}>* Campos Obligatorios</small>
                      </p>
                    </div>
                  </div>
                  <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
                    <div className='panel-search'>
                      <p>Número de radicado</p>
                      <div className='form-group gov-co-form-group'>
                        <Form.Item>
                          <Input
                            type='text'
                            className='form-control gov-co-form-control'
                            onKeyPress={(event) => {
                              if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                            onPaste={(event) => {
                              event.preventDefault();
                            }}
                          />
                        </Form.Item>
                      </div>

                      <p className='mt-3'>Estado</p>

                      <div className='form-group gov-co-form-group '>
                        <div className='gov-co-dropdown'>
                          <Form.Item>
                            <SelectComponent placeholder='-- En revisión --' options={[]} optionPropkey={''} />
                          </Form.Item>
                        </div>
                      </div>
                      <p className='mt-3'>Actividad siguiente</p>
                      <div className='form-group gov-co-form-group'>
                        <Form.Item>
                          <Input
                            type='text'
                            className='form-control gov-co-form-control'
                            onKeyPress={(event) => {
                              if (!/[a-zA-Z]/.test(event.key)) {
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
                  </div>
                  <div className='col-lg-4 col-sm-4 col-md-4 mt-2'>
                    <div className='panel-search'>
                      <p>Tipo trámite</p>
                      <div className='form-group gov-co-form-group'>
                        <Form.Item>
                          <Input
                            type='text'
                            className='form-control gov-co-form-control'
                            onKeyPress={(event) => {
                              if (!/[a-zA-Z]/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                            onPaste={(event) => {
                              event.preventDefault();
                            }}
                          />
                        </Form.Item>
                      </div>

                      <p className='mt-3'>Actividad actual</p>
                      <div className='form-group gov-co-form-group ml-2'>
                        <div className='gov-co-dropdown'>
                          <Form.Item>
                            <SelectComponent
                              placeholder='--Validación de requisitos - Revisor --'
                              options={[]}
                              optionPropkey={''}
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <p className='mt-3'>Usuario Asignado</p>
                      <div className='form-group gov-co-form-group ml-2'>
                        <div className='gov-co-dropdown'>
                          <Form.Item>
                            <SelectComponent placeholder='-- CGONZALEZL --' options={[]} optionPropkey={''} />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className='panel-solicitud mt-5 mb-5'>
              <div className='container'>
                <div className='row'>
                  <div className='col-lg-10 col-sm-12 col-md-10'>
                    <div className='collapse-info'>
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
                            <div className='row mt-5 ml-2'>
                              <DatosSolicitante form={form} obj={objJson} tipo={''} />
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
                              <DatosFuente form={form} obj={objJson} tipo={''} />
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
                              <DatosAcueducto form={form} obj={objJson} prop={null} />
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
                              <DatosAdicionales form={form} obj={objJson} tipo={''} prop={null} />
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
                              <DatosDocumentos form={form} obj={objJson} prop={null} tipo={'validacion'} />
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
                                  <TipoNotificacion form={form} obj={null} prop={null} />
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
                            <div className='card-body' style={{ backgroundColor: '#ede9e3' }}>
                              <div className='row mt-3'>
                                <div className='col-md-12 col-lg-12 col-sm-12'>
                                  <div className='form-group gov-co-form-group'>
                                    <textarea className='form-control ml-2' id='exampleFormControlTextarea1' rows={5}></textarea>
                                  </div>
                                </div>
                              </div>
                              <div className='row mt-4'>
                                <div className='col-lg-12 col-md-12 col-sm-1'>
                                  <button
                                    className='btn btn-default'
                                    style={{
                                      backgroundColor: '#CBCBCB',
                                      float: 'right'
                                    }}
                                  >
                                    Ver vista previa
                                  </button>
                                  <button
                                    className='mr-3 btn btn-default'
                                    style={{
                                      backgroundColor: '#CBCBCB',
                                      float: 'right'
                                    }}
                                  >
                                    Notificar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
