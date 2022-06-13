import React from 'react';
import logo from '../../../../src/assets/images/aguas/alcadia.png';
import '../../../../src/scss/antd/App.css';
import profile from '../../../../src/assets/images/aguas/profile.png';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';

export const VistaRu = () => {
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
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Tipo de tramite</p>
                <div className='form-group gov-co-form-group'>
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
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Estado</p>
                <div className='form-group gov-co-form-group'>
                  <div className='gov-co-dropdown'>
                    <select id='selector-simple' className='selectpicker form-control' title='Escoger'>
                      <option>En radicación</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Actividad actual</p>
                <div className='form-group gov-co-form-group'>
                  <div className='gov-co-dropdown'>
                    <select id='selector-simple' className='selectpicker form-control' title='Escoger'>
                      <option>Persona Natural</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Actividad siguiente </p>
                <div className='form-group gov-co-form-group'>
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
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Usuario asignado</p>
                <div className='form-group gov-co-form-group'>
                  <div className='gov-co-dropdown'>
                    <select id='selector-simple' className='selectpicker form-control' title='Escoger'>
                      <option>CGONZALEZL</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Subred de jurisdicción </p>
                <div className='form-group gov-co-form-group '>
                  <div className='gov-co-dropdown'>
                    <select id='selector-simple' className='selectpicker form-control' title='Escoger'>
                      <option>Seleccione</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row mt-5'>
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <div className='info-tramite mt-2'>
                <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  Datos del solicitante. <br /> <small style={{ color: '#000' }}>* Campos Obligatorios</small>
                </p>
              </div>

              <div className='col-lg-6 col-sm-4 col-md-6 mt-2'>
                <div className='panel-search'>
                  <p className='mt-5 ml-1'>Tipo de solicitante*</p>
                  <div className='form-group gov-co-form-group'>
                    <div className='gov-co-dropdown'>
                      <select id='selector-simple' className='selectpicker form-control' title='Escoger'>
                        <option>Persona Natural</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-sm-4 col-md-4 mt-4 ml-2'>
              <div className='panel-search'>
                <p>Tipo de documento</p>
                <div className='form-group gov-co-form-group'>
                  <div className='gov-co-dropdown'>
                    <select id='selector-simple' className='selectpicker form-control' title='Escoger'>
                      <option>Persona Natural</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-4 ml-2'>
              <div className='panel-search'>
                <p>Número de documento</p>
                <div className='form-group gov-co-form-group'>
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
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Primer nombre</p>
                <div className='form-group gov-co-form-group'>
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
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Segundo nombre</p>
                <div className='form-group gov-co-form-group'>
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
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Primer apellido </p>
                <div className='form-group gov-co-form-group'>
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
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Segundo apellido</p>
                <div className='form-group gov-co-form-group'>
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
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Teléfono de contacto 1 </p>
                <div className='form-group gov-co-form-group'>
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
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Teléfono de contacto 2</p>
                <div className='form-group gov-co-form-group'>
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
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Correo electrónico </p>
                <div className='form-group gov-co-form-group'>
                  <input
                    type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z0-9ZñÑ@._-]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <div className='info-tramite mt-2'>
                <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  Información del lugar de revisión . <br /> <small style={{ color: '#000' }}>* Campos Obligatorios</small>
                </p>
              </div>
              <div className='row'>
                <div className='col-lg-6 col-sm-12 col-md-6' style={{ marginLeft: '5px' }}>
                  <p>Dirección de domicilio</p>
                  <div className='form-group gov-co-form-group'>
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
                  </div>
                </div>
                <div className='col-lg-2 col-sm-12 col-md-12' style={{ marginTop: '32px', marginLeft: '12px' }}>
                  <button className='ml-4 mr-3 float-right button btn btn-round btn-high' style={{ backgroundColor: '#BABABA' }}>
                    Buscar
                  </button>
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Departamento</p>
                <div className='form-group gov-co-form-group'>
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
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Municipio</p>
                <div className='form-group gov-co-form-group'>
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
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Vereda </p>
                <div className='form-group gov-co-form-group'>
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
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>Sector</p>
                <div className='form-group gov-co-form-group'>
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
                </div>
              </div>
            </div>
          </div>
          <div className='row mt-3 '>
            <div className='col-lg-8 col-sm-12 col-md-8'>
              <p className='ml-2'>Observaciones adicionales</p>
              <div className='form-group gov-co-form-group'>
                <textarea className='form-control ml-2' id='exampleFormControlTextarea1' rows={5}></textarea>
              </div>
            </div>

            <div className='col-lg-12 col-sm-12 col-md-12 mt-4'>
              <div className='info-tramite mt-2'>
                <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  Citación de revisión . <br /> <small style={{ color: '#000' }}>* Campos Obligatorios</small>
                </p>
              </div>
            </div>

            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p>fecha de citación</p>
                <input type='date' className='form-control' />
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2'>
              <div className='panel-search'>
                <p>Formulario</p>
                <div className='form-group gov-co-form-group ml-2'>
                  <div className='gov-co-dropdown'>
                    <select id='selector-simple' className='selectpicker form-control' title='Escoger'>
                      <option>CGONZALEZL</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-8 col-sm-12 col-md-8 mt-3'>
              <p className='ml-2'>Observaciones adicionales</p>
              <textarea className='form-control ml-2' id='exampleFormControlTextarea1' rows={5}></textarea>
            </div>
            <div className='col-lg-8 col-md-8 col-sm-12 mt-4'>
              <Button
                type='primary'
                htmlType='button'
                onClick={() => {
                  history.push('/tramites-servicios/Revision/primera-vez');
                }}
              >
                Enviar
              </Button>
              <button className='float-right button btn btn-default' style={{ backgroundColor: '#BABABA' }}>
                Guardar
              </button>
              <button className='mr-3 float-right button btn btn-default' style={{ backgroundColor: '#BABABA' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
