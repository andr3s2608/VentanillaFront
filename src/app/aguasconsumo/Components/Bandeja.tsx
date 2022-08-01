import React from 'react';
import logo from '../../../../src/assets/images/aguas/alcadia.png';
import '../../../css/estilos.css';
import profile from '../../../../src/assets/images/aguas/profile.png';
import { Form, Input } from 'antd';
import Table from 'antd/es/table';
import { Alert, Button, Modal, Upload } from 'antd';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import { useHistory } from 'react-router';
import { store } from 'app/redux/app.reducers';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { CheckOutlined } from '@ant-design/icons';

export const Bandeja = (props: IDataSource) => {
  const history = useHistory();
  const { data, datosusuario, datossolucionados } = props;
  const [roles, setroles] = useState<string>('');
  const [coordinador, setcoordinador] = useState<string>('');

  const Paginas: number = 5;
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const getListas = useCallback(
    async () => {
      const mysRoles = await api.GetRoles();
      const [permiso] = mysRoles;

      if (
        permiso?.rol === 'Coordinador'
        //|| permiso?.rol === 'AdminTI'
      ) {
        setcoordinador('Coordinador');
      } else {
        if (permiso?.rol === 'Funcionario' || permiso?.rol === 'AdminTI') {
          setcoordinador('Funcionario');
        } else {
          setcoordinador('Subdirector');
        }
      }

      setroles(permiso.rol);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
  }, []);

  const onClickValidarInformacion = async (datos: any) => {
    const data = datos;

    localStorage.setItem('register', JSON.stringify(data));
    store.dispatch(SetResetViewLicence());
    if (data.tipodeSolicitud == 'Primer Registro' || data.tipodeSolicitud == 'Proceso de Citacion') {
      history.push('/tramites-servicios-aguas/Revision/revisar-solicitud');
    }
    if (
      data.tipodeSolicitud == 'Gestion Validador' ||
      data.tipodeSolicitud == 'Gestion Coordinador' ||
      data.tipodeSolicitud == 'Gestion Subdirector'
    ) {
      history.push('/tramites-servicios-aguas/Revision/gestionar-solicitud');
    }
  };
  const valor: number = 1;

  const structureColumns = [
    {
      title: 'No. de Radicado',
      dataIndex: 'numeroRadicado',
      key: 'nroradicado'
    },
    {
      title: 'Tipo de trámite',
      dataIndex: 'tipodeTramite',
      key: 'idTramite'
    },
    {
      title: 'Fecha de Registro',
      dataIndex: 'fechaSolicitud',
      key: 'fechaSolicitud'
    },
    {
      title: 'Estado ',
      dataIndex: 'estado',
      key: 'estado'
    },
    {
      title: 'Actividad en curso',
      dataIndex: 'actividadActualSolicitud',
      key: 'actividad'
    },
    {
      title: 'Validar Tramite',
      key: 'Acciones',
      align: 'center' as 'center',

      render: (_: any, row: any, index: any) => {
        if (
          row.estado != 'Aprobada' &&
          row.estado != 'Cerrada' &&
          row.estado != 'Anulada' &&
          row.actividadActualSolicitud != 'En visita de revisión'
        ) {
          return (
            <Button
              type='primary'
              key={`vali-${index}`}
              onClick={() => onClickValidarInformacion(row)}
              style={{ marginRight: '8px' }}
              icon={<CheckOutlined />}
            >
              Validar Información
            </Button>
          );
        } else {
          return null;
        }
      }
    }
  ];

  const añadirinfo = (value: any) => {};

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
                      <p style={{ fontSize: '18px' }}>{roles}</p>
                    </div>
                  </div>
                </div>
              </div>
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
            </div>
            <div className='container'>
              <div className='row'>
                <div className='col-lg-12 col-md-12 ml-4'>
                  <div className='info-tramite mt-3 ml-1'>
                    <p>Bandeja de entrada y gestión</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='container'>
              <div className='row' style={{ marginLeft: '18px' }}>
                <div className='col-md-3 col-sm-12 col-lg-3'>
                  <div id='accordion' className='mt-3'>
                    <div className='card'>
                      <div className='card-header' id='heading-2'>
                        <h5 className='mb-0'>
                          <a
                            className='collapsed-dm'
                            role='button'
                            data-toggle='collapse'
                            href='#collapse'
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
                            className='collapsed '
                            role='button'
                            data-toggle='collapse'
                            href='#collapse-2'
                            aria-expanded='true'
                            aria-controls='collapse-2'
                            onClick={añadirinfo}
                          >
                            Mensajes
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
                            href='#collapse-3'
                            aria-expanded='false'
                            aria-controls='collapse-2'
                          >
                            Notificaciones
                          </a>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div id='collapse-2' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                  <div className='col-lg-9 col-md-9 col-sm-12 mt-3 bandeja_panel'>
                    <ul className='nav nav-tabs mr-4' role='tablist'>
                      <li className='nav-item'>
                        <a className='nav-link active' data-toggle='tab' href='#recientes' role='tab'>
                          Recientes
                        </a>
                      </li>
                      {coordinador != 'Subdirector' && (
                        <>
                          <li className='nav-item'>
                            <a className='nav-link' data-toggle='tab' href='#solucionados' role='tab'>
                              Solucionados
                            </a>
                          </li>
                        </>
                      )}

                      {coordinador == 'Coordinador' && (
                        <>
                          <li className='nav-item'>
                            <a className='nav-link' data-toggle='tab' href='#prueba' role='tab'>
                              Usuario
                            </a>
                          </li>
                        </>
                      )}
                    </ul>
                    <div className='tab-content'>
                      <div className='tab-pane active' id='recientes' role='tabpanel'>
                        <div className='row'>
                          <div className='col-lg-12 col-sm-12 col-md-12 '>
                            <p className='mt-4 ml-3 filtro'>Filtrar por:</p>
                            <div className='row'>
                              <div className='col-lg-5 col-md-5 col-sm-12' style={{ marginLeft: '10px' }}>
                                <div className='form-group gov-co-form-group'>
                                  <div className='gov-co-dropdown'>
                                    <Form.Item>
                                      <SelectComponent placeholder='-- Seleccione --' options={[]} optionPropkey={''} />
                                    </Form.Item>
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-5 col-lg-5 col-sm-12'>
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
                            {coordinador == 'Funcionario' && (
                              <>
                                <Table
                                  id='tableGen'
                                  dataSource={datosusuario}
                                  columns={structureColumns}
                                  pagination={{ pageSize: Paginas }}
                                  className='table_info'
                                />
                              </>
                            )}
                            {coordinador != 'Funcionario' && (
                              <>
                                <Table
                                  id='tableGen'
                                  dataSource={data}
                                  columns={structureColumns}
                                  pagination={{ pageSize: Paginas }}
                                  className='table_info'
                                />
                                <br />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className='tab-pane' id='solucionados' role='tabpanel'>
                        <div className='row'>
                          <div className='col-lg-12 col-sm-12 col-md-12 '>
                            <p className='mt-4 ml-3 filtro'>Filtrar por:</p>
                            <div className='row'>
                              <div className='col-lg-5 col-md-5 col-sm-12' style={{ marginLeft: '10px' }}>
                                <div className='form-group gov-co-form-group'>
                                  <div className='gov-co-dropdown'>
                                    <Form.Item>
                                      <SelectComponent placeholder='-- Seleccione --' options={[]} optionPropkey={''} />
                                    </Form.Item>
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-5 col-lg-5 col-sm-12'>
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
                            <Table
                              id='tableGen2'
                              dataSource={datossolucionados}
                              columns={structureColumns}
                              pagination={{ pageSize: Paginas }}
                              className='table_info'
                            />{' '}
                            <br />
                          </div>
                        </div>
                      </div>
                      {coordinador == 'Coordinador' && (
                        <>
                          <div className='tab-pane ' id='prueba' role='tabpanel'>
                            <div className='row'>
                              <div className='col-lg-12 col-sm-12 col-md-12 '>
                                <p className='mt-4 ml-3 filtro'>Filtrar por:</p>
                                <div className='row'>
                                  <div className='col-lg-5 col-md-5 col-sm-12' style={{ marginLeft: '10px' }}>
                                    <div className='form-group gov-co-form-group'>
                                      <div className='gov-co-dropdown'>
                                        <Form.Item>
                                          <SelectComponent placeholder='-- Seleccione --' options={[]} optionPropkey={''} />
                                        </Form.Item>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='col-md-5 col-lg-5 col-sm-12'>
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
                                <Table
                                  id='tableGen3'
                                  dataSource={datosusuario}
                                  columns={structureColumns}
                                  pagination={{ pageSize: Paginas }}
                                  className='table_info'
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div id='collapse-3' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
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
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

interface IDataSource {
  data: Array<any>;
  datosusuario: Array<any>;
  datossolucionados: Array<any>;
}
