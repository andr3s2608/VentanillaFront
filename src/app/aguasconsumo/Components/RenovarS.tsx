import React from 'react';
import logo from '../../../../src/assets/images/aguas/alcadia.png';
import '../../../../src/scss/antd/App.css';
import profile from '../../../../src/assets/images/aguas/profile.png';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';

export const RenovarS = () => {
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
            <div className='col-lg-9 col-sm-12 col-md-9'>
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
                  Datos de la solicitud. <br /> <small style={{ color: ' #000' }}>* Campos Obligatorios</small>
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
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2'>
              <div className='panel-search'>
                <p>Tipo trámite</p>
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
          <div className='row mt-3'>
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <div className='info-tramite mt-2'>
                <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  Información adicional de la fuente de abastecimiento. <br />{' '}
                  <small style={{ color: ' #000' }}>* Campos Obligatorios</small>
                </p>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <div className='info-tramite mt-2'>
                <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  Datos de la solicitud. <br /> <small style={{ color: ' #000' }}>* Campos Obligatorios</small>
                </p>
              </div>
            </div>
          </div>
          <div className='row mt-3'>
            <div className='col-lg-4 col-sm-12 col-md-3'>
              <p>
                ¿Tiene planta de tratamiento de agua <br /> para el consumo humano?
              </p>
            </div>
            <div className='col-lg-3 col-sm-12 col-md-3'>
              <div className='form-check' style={{ marginLeft: '10px' }}>
                <input
                  className='form-check-input'
                  type='radio'
                  name='exampleRadios'
                  id='exampleRadios1'
                  value='option1'
                  checked
                />
                <label className='form-check-label'>Si</label>
              </div>
            </div>
            <div className='col-lg-3 col-sm-12 col-md-3'>
              <div className='form-check' style={{ marginLeft: '-180px' }}>
                <input className='form-check-input' type='radio' name='exampleRadios' id='exampleRadios1' value='option1' />
                <label className='form-check-label'>No</label>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-4 col-md-4 col-sm-12'>
              <p>Caudal de diseño (L/s)</p>
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
            <div className='col-lg-4 col-md-4 col-sm-12'>
              <p>Caudal de tratado (L/s)</p>
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
          <div className='row mt-4'>
            <div className='col-lg-8 col-md-8 col-sm-12'>
              <a href='' style={{ textDecoration: 'none' }}>
                <i className='fa-solid fa-circle-plus' style={{ color: '#0FD7E0', fontSize: '30px', float: 'right' }}></i>
              </a>
            </div>
            <div className='col-lg-8 col-sm-12 col-md-8'>
              <table className='table table-bordered text-center mt-4' style={{ backgroundColor: '#ede9e3' }}>
                <thead>
                  <tr
                    style={{
                      border: '2px solid #000',
                      backgroundColor: '#fff'
                    }}
                  >
                    <th style={{ border: '2px solid #000' }}>No.</th>
                    <th style={{ border: '2px solid #000' }}>Caudal diseño</th>
                    <th style={{ border: '2px solid #000' }}>Caudal tratado</th>
                    <th style={{ border: '2px solid #000' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style={{
                      border: '2px solid #000',
                      backgroundColor: '#fff'
                    }}
                  >
                    <td style={{ border: '2px solid #000' }}></td>
                    <td style={{ border: '2px solid #000' }}></td>
                    <td style={{ border: '2px solid #000' }}></td>
                    <td style={{ border: '2px solid #000' }}>
                      <a href=''>
                        <i style={{ fontSize: '30px', color: 'red' }} className='fa-solid fa-circle-xmark'></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col-md-4 col-lg-4 col-sm-12'>
              <p>
                Unidades principales que <br />
                componen el sistema de <br />
                mantenimiento.*
              </p>
            </div>
            <div className='col-md-3 col-lg-3 col-sm-12'>
              <div className='form-check'>
                <input className='form-check-input' type='checkbox' value='' id='defaultCheck1' />
                <label className='form-check-label'>Sedimentador</label>
              </div>
              <div className='form-check'>
                <input className='form-check-input' type='checkbox' value='' id='defaultCheck1' />
                <label className='form-check-label'>Mezcla Rapida</label>
              </div>
              <div className='form-check'>
                <input className='form-check-input' type='checkbox' value='' id='defaultCheck1' />
                <label className='form-check-label'>Almacenamiento</label>
              </div>
              <div className='form-check'>
                <input className='form-check-input' type='checkbox' value='' id='defaultCheck1' />
                <label className='form-check-label'>Torre de aireación</label>
              </div>
              <div className='form-check'>
                <input className='form-check-input' type='checkbox' value='' id='defaultCheck1' />
                <label className='form-check-label'>Desficción</label>
              </div>
              <div className='form-check'>
                <input className='form-check-input' type='checkbox' value='' id='defaultCheck1' />
                <label className='form-check-label'>Precloración</label>
              </div>
            </div>
            <div className='col-md-3 col-lg-3 col-sm-12' style={{ marginLeft: '-60px' }}>
              <div className='form-check'>
                <input className='form-check-input' type='checkbox' value='' id='defaultCheck1' />
                <label className='form-check-label'>Filtración</label>
              </div>
              <div className='form-check'>
                <input className='form-check-input' type='checkbox' value='' id='defaultCheck1' />
                <label className='form-check-label'>Mezcla lenta</label>
              </div>
              <div className='form-check'>
                <input className='form-check-input' type='checkbox' value='' id='defaultCheck1' />
                <label className='form-check-label'>Oxidación</label>
              </div>
              <div className='form-check'>
                <input className='form-check-input' type='checkbox' value='' id='defaultCheck1' />
                <label className='form-check-label'>Floculador</label>
              </div>
              <div className='form-check'>
                <input className='form-check-input' type='checkbox' value='' id='defaultCheck1' />
                <label className='form-check-label'>Desarenador</label>
              </div>
              <div className='form-check'>
                <input className='form-check-input' type='checkbox' value='' id='defaultCheck1' />
                <label className='form-check-label'>Otra</label>
              </div>
            </div>
            <div className='col-lg-8 col-sm-12 col-md-8 mt-3'>
              <p>Descripción de otro componente del sistema de tratamiento</p>
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
          <div className='row mt-3'>
            <div className='col-lg-4 col-sm-12 col-md-4'>
              <p>Número de usuarios</p>
            </div>
            <div className='col-lg-2 col-md-2 col-sm-12'>
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
            <div className='col-lg-2 col-md-2 col-sm-12'>
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
          <div className='row mt-2'>
            <div className='col-lg-4 col-sm-12 col-md-4'>
              <p>Población beneficiada</p>
            </div>
            <div className='col-lg-2 col-md-2 col-sm-12'>
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
            <div className='col-lg-2 col-md-2 col-sm-12'>
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
          <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12'>
              <div className='info-tramite mt-3'>
                <p>Adicionar documentación requesito.</p>
              </div>
            </div>
          </div>
          <div className='row mt-2'>
            <div className='col-lg-5 col-md-5 col-sm-12'>
              <div className='check_d'>
                <table className='table table-bordered text-center tablesr' style={{ backgroundColor: '#ede9e3' }}>
                  <thead>
                    <tr
                      style={{
                        border: '2px solid #000',
                        backgroundColor: '#fff'
                      }}
                    >
                      <th style={{ border: '2px solid #000' }}>
                        <input type='checkbox' />
                      </th>
                      <th style={{ border: '2px solid #000' }}>Nombre de archivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ border: '2px solid #000' }}>
                      <td style={{ border: '2px solid #000' }}>
                        <input type='checkbox' />
                      </td>
                      <td style={{ border: '2px solid #000' }}>Documento.pdf</td>
                    </tr>
                    <tr style={{ border: '2px solid #000' }}>
                      <td style={{ border: '2px solid #000' }}>
                        <input type='checkbox' />
                      </td>
                      <td style={{ border: '2px solid #000' }}>Documento.pdf</td>
                    </tr>
                    <tr style={{ border: '2px solid #000' }}>
                      <td style={{ border: '2px solid #000' }}>
                        <input type='checkbox' />
                      </td>
                      <td style={{ border: '2px solid #000' }}>Documento.pdf</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className='col-md-4 col-sm-12 col-lg-4 ml-5  justify-content-center text-center'>
              <div id='accordion' className='mt-3'>
                <button className=' button btn btn-default' style={{ backgroundColor: '#CBCBCB' }}>
                  Adicionar
                </button>
              </div>
              <div id='accordion' className='mt-3'>
                <button className=' button btn btn-default' style={{ backgroundColor: '#CBCBCB' }}>
                  ver archivo
                </button>
              </div>
              <div id='accordion' className='mt-3'>
                <button className=' button btn btn-default' style={{ backgroundColor: '#CBCBCB' }}>
                  Borrar
                </button>
              </div>
            </div>
          </div>
          <div className='row mt-3'>
            <div className='col-lg-8 col-sm-12 col-md-8'>
              <button className='float-right button btn btn-default' style={{ backgroundColor: '#CBCBCB' }}>
                Cargar archivo
              </button>
            </div>
            <div className='col-lg-8 col-md-8 col-sm-12 mt-3'>
              <table className='table table-bordered text-center'>
                <thead>
                  <tr
                    style={{
                      border: '2px solid #000',
                      backgroundColor: '#fff'
                    }}
                  >
                    <th style={{ border: '2px solid #000' }}>No.</th>
                    <th style={{ border: '2px solid #000' }}>Nombre de archivo</th>
                    <th style={{ border: '2px solid #000' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ border: '2px solid #000' }}>
                    <td style={{ border: '2px solid #000' }}>1</td>
                    <td style={{ border: '2px solid #000' }}>Documento.pdf</td>
                    <td style={{ border: '2px solid #000' }}>
                      <a href=''>
                        <i style={{ fontSize: '30px', color: 'red' }} className='fa-solid fa-circle-xmark'></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <small className='mt-1'>* Espacio del ciudadano para incluir documentación adicionar de ser requerido</small>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-8 col-md-8 col-sm-12 mt-2'>
              <Button
                type='primary'
                htmlType='button'
                onClick={() => {
                  history.push('/tramites-servicios/Revision/gestionar-solicitud');
                }}
              >
                siguiente
              </Button>
              <button className='ml-4 mr-3 float-right button btn btn-default' style={{ backgroundColor: ' #CBCBCB' }}>
                Guardar
              </button>
              <button className='float-right button btn btn-default' style={{ backgroundColor: ' #CBCBCB' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
