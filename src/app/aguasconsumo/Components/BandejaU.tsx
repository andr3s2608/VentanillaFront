import React from 'react';
import logo from '../../../../src/assets/images/aguas/alcadia.png';
import '../../../css/estilos.css';
import profile from '../../../../src/assets/images/aguas/profile.png';
import { Form, Input } from 'antd';
import Table from 'antd/es/table';
import { Alert, Button, Modal, Upload } from 'antd';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { IRoles } from 'app/inhumacioncremacion/Models/IRoles';
import { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import { useHistory } from 'react-router';
import { store } from 'app/redux/app.reducers';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { CheckOutlined } from '@ant-design/icons';
import { AnyIfEmpty } from 'react-redux';
export const BandejaU = (props: IDataSource) => {
  const history = useHistory();
  const { data, datossolucionados } = props;

  const [roles, setroles] = useState<IRoles[]>([]);
  const Paginas: number = 5;
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const getListas = useCallback(
    async () => {
      const mysRoles = await api.GetRoles();

      setroles(mysRoles);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
  }, []);

  const onClickValidarInformacion = async (datos: any, tipo: any) => {
    const data = datos;

    localStorage.setItem('register', JSON.stringify(data));
    store.dispatch(SetResetViewLicence());
    if (tipo == 'tramite') {
      history.push('/tramites-servicios/Revision/primera-vez');
    } else {
      history.push('/tramites-servicios/Revision/visita-revision');
    }
  };

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

      render: (_: any, row: any, index: any) => {
        if (row.estado != 'Aprobada' && row.estado != 'Cerrada' && row.estado != 'Anulada' && row.estado != 'Primer Registro') {
          return (
            <>
              <Button
                type='primary'
                key={`vali-${index}`}
                onClick={() => onClickValidarInformacion(row, 'tramite')}
                style={{ marginRight: '8px' }}
                icon={<CheckOutlined />}
              >
                Validar Información
              </Button>
              <br></br>
              {row.actividadActualSolicitud == 'En visita de revisión' && (
                <Button
                  type='primary'
                  key={`vali-${index}`}
                  onClick={() => onClickValidarInformacion(row, 'visita')}
                  style={{ marginRight: '8px' }}
                  icon={<CheckOutlined />}
                >
                  VisualizarRevision
                </Button>
              )}
            </>
          );
        } else {
          return null;
        }
      }
    }
  ];

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
                  <p>Ciudadano</p>
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
                        Mensajes
                      </a>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-9 col-md-9 col-sm-12 mt-3 bandeja_panel'>
              <ul className='nav nav-tabs' role='tablist'>
                <li className='nav-item'>
                  <a
                    className='nav-link active'
                    data-toggle='tab'
                    href='#tabs-1'
                    role='tab'
                    style={{ borderTop: '3px solid orange' }}
                  >
                    Recientes
                  </a>
                </li>
                <li className='nav-item'>
                  <a className='nav-link' data-toggle='tab' href='#tabs-2' role='tab' style={{ borderTop: '3px solid orange' }}>
                    Solucionados
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
                      <Table
                        id='tableGen'
                        dataSource={data}
                        columns={structureColumns}
                        pagination={{ pageSize: Paginas }}
                        className='tableGen'
                      />
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
                      <Table
                        id='tableGen'
                        dataSource={datossolucionados}
                        columns={structureColumns}
                        pagination={{ pageSize: Paginas }}
                        className='tableGen'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

interface IDataSource {
  data: Array<any>;
  datossolucionados: Array<any>;
}
