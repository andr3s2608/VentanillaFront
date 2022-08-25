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
import moment from 'moment';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import Swal from 'sweetalert2';
import { layoutItems } from 'app/shared/utils/form-layout.util';
export const BandejaU = (props: IDataSource) => {
  const history = useHistory();
  const { data, datossolucionados } = props;
  const [mostrar, setmostrar] = useState<Boolean>(false);

  const [roles, setroles] = useState<IRoles[]>([]);
  const Paginas: number = 5;
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();

  const [dataInter, setDataInter] = useState<any[]>([]);
  const [dataSolucionado, setDataSolucionado] = useState<any[]>([]);

  const [dateSelectedInicial, setDateIni] = useState<Date>();
  const [dateSelectedFinal, setDateFin] = useState<Date>();

  const [value, setValue] = useState('');


  const getListas = useCallback(
    async () => {
      const rolesstorage: any = localStorage.getItem('roles');
      const subredes = await api.getSubredes();
      localStorage.setItem('subredes', JSON.stringify(subredes));
      setroles(JSON.parse(rolesstorage));
      setDataInter(data);
      setDataSolucionado(datossolucionados);
      setmostrar(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {

    getListas();
  }, []);

  function onClickFiltrar(datos: String) {

    let datossinfiltrar = false;


    ///datos

    if (value === '') {
      datossinfiltrar = true;

    }

    if (
      dateSelectedInicial != undefined &&
      dateSelectedFinal != undefined &&
      dateSelectedInicial.toString() != 'Invalid Date' &&
      dateSelectedFinal.toString() != 'Invalid Date'
    ) {



      const datosinterfecha = data?.filter(function (f) {

        if (datossinfiltrar) {
          return new Date(f.fechaSolicitud) >= dateSelectedInicial && new Date(f.fechaSolicitud) < dateSelectedFinal;
        }
        else {
          return (
            f.numeroRadicado.toString().includes(value) &&
            (new Date(f.fechaSolicitud) >= dateSelectedInicial && new Date(f.fechaSolicitud) < dateSelectedFinal)
          );
        }
      });

      const datossolucionadosfecha = datossolucionados?.filter(function (f) {
        if (datossinfiltrar) {
          return new Date(f.fechaSolicitud) >= dateSelectedInicial && new Date(f.fechaSolicitud) < dateSelectedFinal;
        }
        else {
          return (
            f.numeroRadicado.toString().includes(value) &&
            (new Date(f.fechaSolicitud) >= dateSelectedInicial && new Date(f.fechaSolicitud) < dateSelectedFinal)
          );
        }
      });



      setDataInter(datosinterfecha);
      setDataSolucionado(datossolucionadosfecha);

    } else {
      Swal.fire({
        title: 'Fecha invalida',
        text: 'La Fecha no ha sido seleccionada hasta el momento, por favor seleccione el rango',

        icon: 'error'
      });
    }



  }


  const onClickValidarInformacion = async (datos: any, tipo: any) => {
    const data = datos;

    localStorage.setItem('register', JSON.stringify(data));
    store.dispatch(SetResetViewLicence());
    if (tipo == 'tramite') {
      history.push('/tramites-servicios-aguas/Revision/primera-vez');
    } else {
      history.push('/tramites-servicios-aguas/Revision/visita-revision');
    }
  };

  const resetdata = () => {
    setValue('');
    setDateIni(undefined);
    setDateFin(undefined);
    setDataSolucionado(datossolucionados);
    setDataInter(data);


    form.resetFields(['fechainicial', 'fechafinal']);
  };

  const FilterByNameInput = () => {
    let fecha = false;
    let fechain = new Date();
    let fechafin = new Date();




    if (
      dateSelectedInicial != undefined &&
      dateSelectedFinal != undefined &&
      dateSelectedInicial.toString() != 'Invalid Date' &&
      dateSelectedFinal.toString() != 'Invalid Date'
    ) {
      fechain = dateSelectedInicial;
      fechafin = dateSelectedFinal;
      fecha = true;
    }



    return (
      <Input
        placeholder='Nro. de Radicado'
        value={value}
        onChange={(e) => {
          const currValue: string = e.target.value;
          setValue(currValue);
          const filteredData: any = data.filter((datos: any) => {
            if (fecha) {
              return (
                datos.numeroRadicado.toString().includes(currValue) &&
                (new Date(datos.fechaSolicitud) >= fechain && new Date(datos.fechaSolicitud) < fechafin)
              );

            }
            else {
              return datos.numeroRadicado.toString().includes(currValue);
            }
          });
          setDataInter(filteredData);

          const filteredData2: any = datossolucionados.filter((datos: any) => {
            if (fecha) {
              return (
                datos.numeroRadicado.toString().includes(currValue) &&
                (new Date(datos.fechaSolicitud) >= fechain && new Date(datos.fechaSolicitud) < fechafin)
              );

            }
            else {
              return datos.numeroRadicado.toString().includes(currValue);
            }

          });

          setDataSolucionado(filteredData2);

        }}
      />
    );
  };



  let structureColumns: any[] = [];
  if (mostrar) {
    structureColumns = [
      {
        title: FilterByNameInput(),
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
        key: 'estado',
        filters: [
          {
            text: 'Abierta',
            value: 'Abierta'
          },
          {
            text: 'Anulada',
            value: 'Anulada'
          },
          {
            text: 'Cerrada',
            value: 'Cerrada'
          },
          {
            text: 'Aprobada',
            value: 'Aprobada'
          },
          {
            text: 'En Gestion',
            value: 'gesti'
          }
        ],
        filterSearch: true,
        onFilter: (value: string, record: { estado: string }) => record.estado.toString().includes(value)
      },
      {
        title: 'Actividad en curso',
        dataIndex: 'actividadActualSolicitud',
        key: 'actividad',
        filters: [
          {
            text: 'Aprobación de solicitud',
            value: 'Aprobación de solicitud'
          },
          {
            text: 'Desistimiento',
            value: 'Desistimiento'
          },
          {
            text: 'En visita de revisión',
            value: 'En visita de revisión'
          },
          {
            text: 'Radicación de solicitud',
            value: 'Radicación de solicitud'
          },
          {
            text: 'Subsanación de requisitos',
            value: 'Subsanación de requisitos'
          }
        ],
        filterSearch: true,

        onFilter: (value: string, record: { actividadActualSolicitud: string }) =>
          record.actividadActualSolicitud.toString().includes(value),
      },
      {
        title: 'Validar Tramite',
        key: 'Acciones',

        render: (_: any, row: any, index: any) => {
          if (
            row.estado != 'Aprobada' &&
            row.estado != 'Cerrada' &&
            row.estado != 'Anulada' &&
            row.tipodeSolicitud != 'Primer Registro' &&
            row.tipodeSolicitud != 'Proceso de Citacion' &&
            row.tipodeSolicitud != 'Gestion Validador' &&
            row.tipodeSolicitud != 'Gestion Coordinador' &&
            row.tipodeSolicitud != 'Gestion Subdirector'
          ) {
            return (
              <>
                <Button
                  type='primary'
                  key={`vali`}
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
                    key={`vali`}
                    onClick={() => onClickValidarInformacion(row, 'visita')}
                    style={{ marginRight: '8px' }}
                    icon={<CheckOutlined />}
                  >
                    Visualizar Revision
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
  }
  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body tarjeta h-100'>
          <Form form={form} {...layoutItems} layout='horizontal'>
            {mostrar && (
              <>
                <section className='info-panel'>
                  <div className='container'>
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
                      </div>
                      <div className='col-lg-9 col-md-9 col-sm-12 mt-3 bandeja_panel'>

                        <ul className='nav nav-tabs' role='tablist'>
                          <li className='nav-item'>
                            <a
                              className='nav-link active'
                              data-toggle='tab'
                              onClick={() => resetdata()}
                              href='#tabs-1'
                              role='tab'
                              style={{ borderTop: '3px solid orange' }}
                            >
                              Recientes
                            </a>
                          </li>
                          <li className='nav-item'>
                            <a className='nav-link' data-toggle='tab' onClick={() => resetdata()}
                              href='#tabs-2' role='tab' style={{ borderTop: '3px solid orange' }}>
                              Solucionados
                            </a>
                          </li>
                        </ul>
                        <div className='tab-content'>
                          <div className='tab-pane active' id='tabs-1' role='tabpanel'>
                            <div className='row'>
                              <div className='col-lg-12 col-sm-12 colmd-12 ml-2'>
                                <p className='mt-4'>Filtrar por:</p>
                                <div className='form-row ml-7'>
                                  <Form.Item name='fechainicial' style={{ width: 400 }} initialValue={null}>
                                    <DatepickerComponent
                                      id='datePicker1'
                                      picker='date'
                                      placeholder='Fecha Inicial'
                                      dateDisabledType='default'
                                      dateFormatType='default'
                                      style={{ width: 300 }}
                                      className='form-control'
                                      onChange={(date) => {
                                        var seleccionIni = new Date(moment(date).format('MM-DD-YYYY'));

                                        setDateIni(new Date(moment(date).format('MM-DD-YYYY')));
                                      }}
                                    />
                                  </Form.Item>
                                  <br></br>
                                  <Form.Item name='fechafinal' style={{ width: 400 }} initialValue={null}>
                                    <DatepickerComponent
                                      id='datePicker2'
                                      picker='date'
                                      placeholder='Fecha Final'
                                      dateDisabledType='default'
                                      dateFormatType='default'
                                      style={{ width: 300 }}
                                      className='form-control'
                                      onChange={(date) => {
                                        var seleccion = new Date(moment(date).format('MM-DD-YYYY'));

                                        setDateFin(new Date(moment(date).add(1, 'day').format('MM-DD-YYYY')));
                                      }}
                                    />
                                  </Form.Item>
                                  <Form.Item style={{ width: 400 }}>
                                    <Button
                                      type='primary'
                                      key={`filtrarReciente`}
                                      onClick={() => onClickFiltrar('reciente')}
                                      style={{ marginRight: '8px' }}
                                      icon={<CheckOutlined />}
                                    >
                                      Filtrar
                                    </Button>
                                  </Form.Item>
                                </div>

                              </div>
                            </div>

                            <div className='row'>
                              <div className='col-lg-12 col-md-12 col-sm-12 ml-2'>
                                <Table
                                  scroll={{ y: 240 }}
                                  id='tableGen'
                                  dataSource={dataInter.length > 0 ? dataInter : data}
                                  columns={structureColumns}
                                  pagination={{ pageSize: Paginas }}
                                  className='table_info'
                                />
                              </div>
                            </div>

                          </div>
                          <div className='tab-pane' id='tabs-2' role='tabpanel'>
                            <div className='row'>
                              <div className='col-lg-12 col-sm-12 colmd-12 ml-2'>
                                <p className='mt-4'>Filtrar por:</p>
                                <p className='mt-4'>Filtrar por:</p>
                                <div className='form-row ml-7'>
                                  <Form.Item name='fechainicial' style={{ width: 400 }} initialValue={null}>
                                    <DatepickerComponent
                                      id='datePicker1'
                                      picker='date'
                                      placeholder='Fecha Inicial'
                                      dateDisabledType='default'
                                      dateFormatType='default'
                                      style={{ width: 300 }}
                                      className='form-control'
                                      onChange={(date) => {
                                        var seleccionIni = new Date(moment(date).format('MM-DD-YYYY'));

                                        setDateIni(new Date(moment(date).format('MM-DD-YYYY')));
                                      }}
                                    />
                                  </Form.Item>
                                  <br></br>
                                  <Form.Item name='fechafinal' style={{ width: 400 }} initialValue={null}>
                                    <DatepickerComponent
                                      id='datePicker2'
                                      picker='date'
                                      placeholder='Fecha Final'
                                      dateDisabledType='default'
                                      dateFormatType='default'
                                      style={{ width: 300 }}
                                      className='form-control'
                                      onChange={(date) => {
                                        var seleccion = new Date(moment(date).format('MM-DD-YYYY'));

                                        setDateFin(new Date(moment(date).add(1, 'day').format('MM-DD-YYYY')));
                                      }}
                                    />
                                  </Form.Item>
                                  <Form.Item style={{ width: 400 }}>
                                    <Button
                                      type='primary'
                                      key={`filtrarReciente`}
                                      onClick={() => onClickFiltrar('reciente')}
                                      style={{ marginRight: '8px' }}
                                      icon={<CheckOutlined />}
                                    >
                                      Filtrar
                                    </Button>
                                  </Form.Item>
                                </div>
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-lg-12 col-md-12 col-sm-12 ml-2'>
                                <Table
                                  scroll={{ y: 240 }}
                                  id='tableGen'
                                  dataSource={dataSolucionado}
                                  columns={structureColumns}
                                  pagination={{ pageSize: Paginas }}
                                  className='table_info'

                                />
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

interface IDataSource {
  data: Array<any>;
  datossolucionados: Array<any>;
}
