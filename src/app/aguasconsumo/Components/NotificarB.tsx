import React from 'react';
import logo from '../../../../src/assets/images/aguas/alcadia.png';
import '../../../css/estilos.css';
import profile from '../../../../src/assets/images/aguas/profile.png';
import { Form, Input } from 'antd';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
export const NotificarB = () => {
  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body'>
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
                          <a href='#'>Bandeja de entrada y gestión</a>
                        </li>
                        <li className='breadcrumb-item active' aria-current='page'>
                          Notificaciones
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
                <div className='col-lg-12 col-md-12'>
                  <div className='info-tramite mt-3 ml-2'>
                    <p className='mr-2'>Bandeja de entrada y gestión</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className='inbox'>
            <div className='container'>
              <div className='row'>
                <div className='col-md-4 col-sm-12 col-lg-4'>
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
                            Bandeja de entrada
                          </a>
                        </h5>
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
                            Notificaciones
                          </a>
                        </h5>
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
                            Auditoria
                          </a>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-lg-8 col-md-8 col-sm-8 mt-3'>
                  <ul className='nav nav-tabs' role='tablist'>
                    <li className='nav-item'>
                      <a
                        className='nav-link active'
                        data-toggle='tab'
                        href='#tabs-1'
                        role='tab'
                        style={{ borderTop: '3px solid orange' }}
                      >
                        Notificación de observaciones
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a
                        className='nav-link'
                        data-toggle='tab'
                        href='#tabs-2'
                        role='tab'
                        style={{ borderTop: '3px solid orange' }}
                      >
                        Histórico notificaciones
                      </a>
                    </li>
                  </ul>
                  <div className='tab-content'>
                    <div className='tab-pane active' id='tabs-1' role='tabpanel'>
                      <div className='row'>
                        <div className='col-lg-12 col-sm-12 colmd-12 ml-2'>
                          <p className='mt-4'>Filtrar por:</p>
                          <div className='row'>
                            <div className='col-lg-6 col-md-6 col-sm-12'>
                              <div className='form-group gov-co-form-group ml-2'>
                                <div className='gov-co-dropdown'>
                                  <Form.Item>
                                    <SelectComponent placeholder='-- Seleccione --' options={[]} optionPropkey={''} />
                                  </Form.Item>
                                </div>
                              </div>
                            </div>
                            <div className='col-md-6 col-lg-6 col-sm-12'>
                              <div className='form-group gov-co-form-group'>
                                <Form.Item>
                                  <input
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
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-lg-12 col-md-12 col-sm-12 ml-2'>
                          <table className='table table-bordered text-center mt-4' style={{ backgroundColor: '#ede9e3' }}>
                            <thead>
                              <tr
                                style={{
                                  border: '2px solid #000',
                                  backgroundColor: '#fff'
                                }}
                              >
                                <th style={{ border: '2px solid #000' }}>No. de radicado</th>
                                <th style={{ border: '2px solid #000' }}>Tipo de trámite</th>
                                <th style={{ border: '2px solid #000' }}>Solicitante</th>
                                <th style={{ border: '2px solid #000' }}>Estado</th>
                                <th style={{ border: '2px solid #000' }}>Fecha</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ border: '2px solid #000' }}>
                                <td style={{ border: '2px solid #000' }}></td>
                                <td style={{ border: '2px solid #000' }}></td>
                                <td style={{ border: '2px solid #000' }}></td>
                                <td style={{ border: '2px solid #000' }}></td>
                                <td style={{ border: '2px solid #000' }}></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-lg-12 col-md-12 col-sm-12'>
                          <div className='info-tramite mt-3 ml-2'>
                            <p className='mr-2'>1. Verificar validadores</p>
                          </div>
                        </div>
                        <div className='col-lg-11 col-md-11 col-sm-12 ml-5'>
                          <table className='table table-bordered text-center mt-4' style={{ backgroundColor: '#ede9e3' }}>
                            <thead>
                              <tr
                                style={{
                                  border: '2px solid  #000',
                                  backgroundColor: '#fff'
                                }}
                              >
                                <th style={{ border: '2px solid #000' }}>Validador</th>
                                <th style={{ border: '2px solid #000' }}>Estado de validación</th>
                                <th style={{ border: '2px solid #000' }}>Observaciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ border: '2px solid #000' }}>
                                <td style={{ border: '2px solid #000' }}></td>
                                <td style={{ border: '2px solid #000' }}></td>
                                <td style={{ border: '2px solid #000' }}></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className='col-lg-12 col-md-12 col-sm-12 mt-3'>
                          <div className='info-tramite mt-3 ml-2'>
                            <p>2. Seleccionar tipo de notificación</p>
                            <p className='text-dark' style={{ fontSize: '14px' }}>
                              Campos obligatorios*
                            </p>
                          </div>
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-12'>
                          <p>Tipo de notificación*</p>
                          <div className='form-group gov-co-form-group ml-2'>
                            <div className='gov-co-dropdown'>
                              <select id='selector-simple' className='selectpicker form-control' title='Escoger'>
                                <option>Oficio de notificación</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className='col-m-12 col-lg-12 col-sm-12'>
                          <button className='btn btn-default' style={{ backgroundColor: ' #CBCBCB', float: 'right' }}>
                            Notificar
                          </button>
                          <button className='btn btn-default mr-3' style={{ backgroundColor: ' #CBCBCB', float: 'right' }}>
                            Ver vista previa
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='tab-pane' id='tabs-2' role='tabpanel'>
                      <div className='row'>
                        <div className='col-lg-12 col-sm-12 colmd-12 ml-2'>
                          <p className='mt-4'>Filtrar por:</p>
                          <div className='row'>
                            <div className='col-lg-6 col-md-6 col-sm-12'>
                              <div className='form-group gov-co-form-group ml-2'>
                                <div className='gov-co-dropdown'>
                                  <Form.Item>
                                    <SelectComponent placeholder='-- Seleccione --' options={[]} optionPropkey={''} />
                                  </Form.Item>
                                </div>
                              </div>
                            </div>
                            <div className='col-md-6 col-lg-6 col-sm-12'>
                              <div className='form-group gov-co-form-group'>
                                <Form.Item>
                                  <input
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
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-lg-12 col-md-12 col-sm-12 ml-2'>
                          <table className='table table-bordered text-center mt-4' style={{ backgroundColor: '#ede9e3' }}>
                            <thead>
                              <tr
                                style={{
                                  border: '2px solid  #000',
                                  backgroundColor: '#fff'
                                }}
                              >
                                <th style={{ border: '2px solid #000' }}>No. de radicado</th>
                                <th style={{ border: '2px solid #000' }}>Tipo de trámite</th>
                                <th style={{ border: '2px solid #000' }}>Fecha</th>
                                <th style={{ border: '2px solid #000' }}>Estado</th>
                                <th style={{ border: '2px solid #000' }}>Actividad en curso</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ border: '2px solid #000' }}>
                                <td style={{ border: '2px solid #000' }}></td>
                                <td style={{ border: '2px solid #000' }}></td>
                                <td style={{ border: '2px solid #000' }}></td>
                                <td style={{ border: '2px solid #000' }}></td>
                                <td style={{ border: '2px solid #000' }}></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
