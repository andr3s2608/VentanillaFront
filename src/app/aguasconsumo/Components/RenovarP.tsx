import React from 'react';
import logo from '../../../../src/assets/images/aguas/alcadia.png';
import '../../../../src/scss/antd/App.css';
import profile from '../../../../src/assets/images/aguas/profile.png';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';
import { Form, Input } from 'antd';
import { SelectComponent } from 'app/shared/components/inputs/select.component';

export const RenovarP = () => {
  const history = useHistory();
  return (
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
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <div className='info-secion'>
                <nav aria-label='breadcrumb' style={{ backgroundColor: '#fff' }}>
                  <ol className='breadcrumb'>
                    <li className='breadcrumb-item'>
                      <a href='#'>Inicio</a>
                    </li>
                    <li className='breadcrumb-item'>
                      <a href='#'>Solicitar autorización sanitaria para la concesión de aguas</a>
                    </li>
                    <li className='breadcrumb-item active' aria-current='page'>
                      Crear solicitud
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
                    1. Solicitar revisión{' '}
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
                    <input
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
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2'>
              <div className='panel-search'>
                <p>Tipo trámite</p>
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
          <div className='row mt-3'>
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <div className='info-tramite mt-2'>
                <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  Datos de la fuente de abastecimiento. <br /> <small style={{ color: '#000' }}>* Campos Obligatorios</small>
                </p>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-6 col-sm-4 col-md-6 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Tipo de solucitud de concesión*</p>

                <div className='form-group gov-co-form-group ml-2'>
                  <div className='gov-co-dropdown'>
                    <select id='selector-simple' className='selectpicker form-control' title='Escoger'>
                      <option>Renovación</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row mt-3'>
            <div className='col-lg-4 col-md-4 col-sm-12'>
              <p>Número de expediente de resolución*</p>
              <div className='form-group gov-co-form-group'>
                <Form.Item>
                  <input
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
            </div>
            <div className='col-lg-4 col-md-4 col-sm-12'>
              <p>Fecha de resolución*</p>
              <input type='date' className='form-control' />
            </div>
            <div className='col-lg-8 col-md-8 col-sm-12 mt-3'>
              <button className='float-right button btn btn-default' style={{ backgroundColor: '#CBCBCB' }}>
                Adjuntar archivo
              </button>
            </div>
          </div>

          <div className='row mt-5'>
            <div className='col-lg-4 col-sm-12 col-md-4'>
              <p>Tipo de fuente*</p>

              <div className='form-group gov-co-form-group ml-2'>
                <div className='gov-co-dropdown'>
                  <Form.Item>
                    <SelectComponent placeholder='-- Subterránea --' options={[]} optionPropkey={''} />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-12 col-md-4'>
              <p>Subcategoria de fuente*</p>

              <div className='form-group gov-co-form-group ml-2'>
                <div className='gov-co-dropdown'>
                  <Form.Item>
                    <SelectComponent placeholder='-- Manantial --' options={[]} optionPropkey={''} />
                  </Form.Item>
                  <select id='selector-simple' className='selectpicker form-control' title='Escoger'>
                    <option>Manantial</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className='row mt-3'>
            <div className='col-lg-4 col-sm-12 col-md-4'>
              <p>Descripción de otra fuente</p>
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
            <div className='col-lg-4 col-sm-12 col-md-4'>
              <p>Nombre de la fuente*</p>
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

          <div className='row mt-3'>
            <div className='col-lg-3 col-md-3 col-sm-12'>
              <p>Localización de la bocatoma*</p>
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
            <div className='col-lg-3 col-md-3 col-sm-12'>
              <br />
              <Form.Item>
                <input
                  type='text'
                  className='form-control mt-3'
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
            <div className='col-lg-2 col-md-2 col-sm-12'>
              <br />
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
            <div className='col-lg-8 col-md-8 col-sm-12 mt-3'>
              <p>Descripción de la fuente*</p>
              <div className='form-group gov-co-form-group'>
                <Input.TextArea defaultValue='default' rows={5} />
              </div>
            </div>
            <div className='col-lg-6 col-sm-12 col-md-6 mt-3'>
              <p>Autoridad ambiental que otorga la concesión</p>
              <div className='form-group gov-co-form-group ml-2'>
                <div className='gov-co-dropdown'>
                  <Form.Item>
                    <SelectComponent placeholder='--CAR- Corporación Autónoma Regional--' options={[]} optionPropkey={''} />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>

          <div className='row mt-3'>
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <div className='info-tramite mt-2'>
                <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  Información de acueductos que captan la misma fuente. <br />{' '}
                  <small style={{ color: '#000' }}>* Campos Obligatorios</small>
                </p>
              </div>
            </div>
          </div>

          <div className='row mt-3'>
            <div className='col-lg-4 col-sm-12 col-md-4'>
              <p>Departamento*</p>
              <div className='form-group gov-co-form-group ml-2'>
                <div className='gov-co-dropdown'>
                  <Form.Item>
                    <SelectComponent placeholder='-- Bogotá --' options={[]} optionPropkey={''} />
                  </Form.Item>
                </div>
              </div>
              <p className='mt-3'>Localidad o vereda*</p>
              <div className='form-group gov-co-form-group ml-2'>
                <div className='gov-co-dropdown'>
                  <Form.Item>
                    <SelectComponent placeholder='-- Seleccione --' options={[]} optionPropkey={''} />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-12 col-md-4'>
              <p>Municipio*</p>
              <div className='form-group gov-co-form-group ml-2'>
                <div className='gov-co-dropdown'>
                  <Form.Item>
                    <SelectComponent placeholder='-- Bogotá --' options={[]} optionPropkey={''} />
                  </Form.Item>
                </div>
              </div>
              <p className='mt-3'>Sector*</p>
              <div className='form-group gov-co-form-group ml-2'>
                <div className='gov-co-dropdown'>
                  <Form.Item>
                    <SelectComponent placeholder='-- Seleccione --' options={[]} optionPropkey={''} />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-4 col-md-4 col-sm-12'>
              <br />
              <p>Coordenadas de capacitación</p>
              <Form.Item>
                <input
                  type='text'
                  className='form-control mt-3'
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
            <div className='col-lg-4 col-md-4 col-sm-12 mt-4'>
              <br />
              <Form.Item>
                <input
                  type='text'
                  className='form-control mt-3'
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
          <div className='row mt-2'>
            <div className='col-lg-4 col-md-4 col-sm-12'>
              <br />
              <p>Uso de la fuente</p>
              <Form.Item>
                <SelectComponent placeholder='-- Seleccione --' options={[]} optionPropkey={''} />
              </Form.Item>
            </div>
            <div className='col-lg-4 col-md-4 col-sm-12'>
              {' '}
              <br />
              <p>Descripción de otro uso</p>
              <Form.Item>
                <input
                  type='text'
                  className='form-control mt-3'
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
          <div className='row mt-3'>
            <div className='col-lg-4 col-md-4 col-sm-12'>
              <p>Caudal total</p>
              <Form.Item>
                <input
                  type='text'
                  className='form-control mt-3'
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
          </div>
          <div className='row mt-4'>
            <div className='col-lg-8 col-md-8 col-sm-12'>
              <a href='' style={{ textDecoration: 'none' }}>
                <i
                  className='fa-solid fa-circle-plus'
                  style={{
                    color: ':#0FD7E0',
                    fontSize: '30px',
                    float: 'right'
                  }}
                ></i>
              </a>
            </div>
            <div className='col-lg-8 col-sm-12 col-md-8'>
              <table className='table table-bordered text-center mt-4' style={{ backgroundColor: '#ede9e3' }}>
                <thead>
                  <tr
                    style={{
                      border: '2px solid  #000',
                      backgroundColor: '#fff'
                    }}
                  >
                    <th style={{ border: '2px solid  #000' }}>No. de expediente</th>
                    <th style={{ border: '2px solid  #000' }}>Municipio/Vereda</th>
                    <th style={{ border: '2px solid  #000' }}>Uso de la fuente</th>
                    <th style={{ border: '2px solid  #000' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style={{
                      border: '2px solid  #000',
                      backgroundColor: '#fff'
                    }}
                  >
                    <td style={{ border: '2px solid  #000' }}></td>
                    <td style={{ border: '2px solid  #000' }}></td>
                    <td style={{ border: '2px solid  #000' }}></td>
                    <td style={{ border: '2px solid  #000' }}>
                      <a href=''>
                        <i style={{ fontSize: '30xp', color: 'red' }} className='fa-solid fa-circle-xmark'></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <Button
                className='ml-3 float-right button btn btn-default'
                style={{ backgroundColor: '#CBCBCB', border: '2px solid #CBCBCB', color: '#000' }}
                type='primary'
                htmlType='button'
                onClick={() => {
                  history.push('/tramites-servicios/Revision/renovacion-segunda-vez');
                }}
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
