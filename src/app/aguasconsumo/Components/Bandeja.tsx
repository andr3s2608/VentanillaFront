import React from 'react';
import logo from '../../../../src/assets/images/aguas/alcadia.png';
import '../../../css/estilos.css';
import profile from '../../../../src/assets/images/aguas/profile.png';
import { Form, Input } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { Alert, Button, Modal, Upload } from 'antd';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import { useHistory } from 'react-router';
import { store } from 'app/redux/app.reducers';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { CheckOutlined } from '@ant-design/icons';
import moment from 'moment';
import Swal from 'sweetalert2';

export const Bandeja = (props: IDataSource) => {
  const history = useHistory();
  const { data, datosusuario, datossolucionados } = props;

  const [dataInter, setDataInter] = useState<any[]>([]);
  const [dataUsuario, setDataUsuario] = useState<any[]>([]);
  const [dataSolucionado, setDataSolucionado] = useState<any[]>([]);

  const [FilterTextID, setFilterTextID] = useState<String>();
  const [FilterTextID2, setFilterTextID2] = useState<String>();

  const [dateSelectedInicial, setDateIni] = useState<Date>();
  const [dateSelectedFinal, setDateFin] = useState<Date>();
  const [dateSelectedInicial2, setDateIni2] = useState<Date>();
  const [dateSelectedFinal2, setDateFin2] = useState<Date>();

  const [roles, setroles] = useState<String>('');
  const [mostrar, setmostrar] = useState<Boolean>(false);

  const [verImput, setImputVisible] = useState<Boolean>(true);
  const [verImput2, setImputVisible2] = useState<Boolean>(true);
  const [verEstado, setEstadoVisible] = useState<Boolean>(false);
  const [verEstado2, setEstadoVisible2] = useState<Boolean>(false);
  const [verfecha, setFechaVisible] = useState<Boolean>(false);
  const [verfecha2, setFechaVisible2] = useState<Boolean>(false);

  const [ocultarbandeja, setocultarbandeja] = useState<boolean>(false);
  const [ocultarnotificacion, setocultarnotificacion] = useState<boolean>(true);
  const [dias, setdias] = useState<any>([]);
  const [selectedFilter, setFilterCambio] = useState<String>('');

  const [selectedFilterReciente, setFilterReciente] = useState<String>();
  const [selectedFilterReciente2, setFilterReciente2] = useState<String>();
  const [selectedFilterEstado, setFilterEstado] = useState<String>();
  const [selectedFilterEstado2, setFilterEstado2] = useState<String>();

  const [coordinador, setcoordinador] = useState<String>('');

  const Paginas: number = 5;
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const onChangeFilterSelect = (event: any) => {
    setFilterCambio(event);
  };

  const onChangeFilterEstado = (event: any) => {
    setFilterEstado(event);
  };
  const onChangeFilterEstado2 = (event: any) => {
    setFilterEstado2(event);
  };

  const onChangeFilterReciente = (event: any) => {
    const value = event;
    console.log('VALOR CHANGEFILTER ' + value);
    switch (value) {
      case 'NoRadicado':
        console.log('NUM RADICADO');
        setImputVisible(true);
        setEstadoVisible(false);
        setFechaVisible(false);
        break;
      case 'FechaReg':
        console.log('FECHA REG');
        setImputVisible(false);
        setFechaVisible(true);
        setEstadoVisible(false);
        break;
      case 'Estado':
        setEstadoVisible(true);
        setImputVisible(false);
        setFechaVisible(false);
        break;
      case 'todos':
        console.log('TODOS');
        setImputVisible(true);
        setFechaVisible(false);
        setEstadoVisible(false);
        break;
      case 'TipoTramite':
        console.log('TIPO TRAMITE');
        break;

    }
    setFilterReciente(value);
  }
  const onChangeFilterSolucionado = (event: any) => {
    const value = event;
    console.log('VALOR CHANGEFILTER ' + value);
    switch (value) {
      case 'NoRadicado':
        console.log('NUM RADICADO');
        setImputVisible2(true);
        setEstadoVisible2(false);
        setFechaVisible2(false);
        break;
      case 'FechaReg':
        console.log('FECHA REG');
        setImputVisible2(false);
        setFechaVisible2(true);
        setEstadoVisible2(false);
        break;
      case 'Estado':
        setEstadoVisible2(true);
        setImputVisible2(false);
        setFechaVisible2(false);
        break;
      case 'todos':
        console.log('TODOS');
        setImputVisible2(true);
        setFechaVisible2(false);
        setEstadoVisible2(false);
        break;
      case 'TipoTramite':
        console.log('TIPO TRAMITE');
        break;

    }
    setFilterReciente2(value);
  }
  function ChangeSelected() {
    console.log(selectedFilterReciente + ' SELECCION');

  }
  const getListas = useCallback(
    async () => {
      const rolesstorage: any = localStorage.getItem('roles');
      const subredes = await api.getSubredes();
      localStorage.setItem('subredes', JSON.stringify(subredes));
      console.log(JSON.stringify(subredes));
      const mysRoles = JSON.parse(rolesstorage);
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

      const array: any[] = [];
      array.push(await api.getConstantesAguas('E359580A-1AE8-452E-A9D4-017DB0FDA196'));
      array.push(await api.getConstantesAguas('557E18FD-C9A6-492D-AEF6-07BDB43A7BE0'));
      array.push(await api.getConstantesAguas('B4CE8B3A-24FF-4653-BEDC-05F29BB99303'));

      setdias(array);
      setroles(permiso.rol);
      setmostrar(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    console.log('DATA RECIBIDA \n ' + JSON.stringify(data));
    setDataInter(data);
    setDataUsuario(datosusuario);
    setDataSolucionado(datossolucionados)
    getListas();
  }, []);

  function onChangeFilterID(event: any) {
    console.log(event.target.value);
    setFilterTextID(event.target.value);
  }

  function onChangeFilterID2(event: any) {
    console.log(event.target.value);
    setFilterTextID2(event.target.value);
  }
  function onClickFiltrar(data: String) {
    console.log('FILTRADO ' + data);
    var allData = null;
    switch (data) {
      case 'reciente':
        console.log('reciente opcion ->' + selectedFilterReciente);

        console.log('filter TEXT' + FilterTextID);
        switch (selectedFilterReciente) {
          case 'NoRadicado':
            console.log('NUM RADICADO');
            allData = datosusuario?.filter(function (f) {
              return f.numeroRadicado == FilterTextID;
            });
            break;
          case 'FechaReg':
            console.log('FECHA REG');
            if (dateSelectedInicial != undefined && dateSelectedFinal != undefined && dateSelectedInicial.toString() != 'Invalid Date' && dateSelectedFinal.toString() != 'Invalid Date') {
              console.log('entro FECHA I ' + dateSelectedInicial.toString() + ' FINAL ' + dateSelectedFinal.toString());
              allData = datosusuario?.filter(function (f) {
                // var fecha = new Date(dateSelectedPicker == undefined ? new Date() : dateSelectedPicker.toString());

                return new Date(f.fechaSolicitud) >= dateSelectedInicial && new Date(f.fechaSolicitud) <= dateSelectedFinal;
              });
            } else {
              Swal.fire({
                title: 'Fecha invalida',
                text: 'La Fecha no ha sido seleccionada hasta el momento, por favor seleccione el rango',

                icon: 'error'
              });
            }
            break;
          case 'todos':
            console.log('TODOS');
            allData = datosusuario?.filter(function (f) {
              // var fecha = new Date(dateSelectedPicker == undefined ? new Date() : dateSelectedPicker.toString());

              return true;
            });
            setImputVisible(true);
            setEstadoVisible(false);
            setFechaVisible(false);
            break;
          case 'Estado':
            switch (selectedFilterEstado) {
              case 'gestion':
                allData = datosusuario?.filter(function (f) {
                  return f.estado.toString().trim() == 'En gestión';
                });
                break;
              case 'anulada':
                allData = datosusuario?.filter(function (f) {
                  return f.estado.toString().trim() == 'Anulada';
                });
                break;
              case 'aprobada':
                allData = datosusuario?.filter(function (f) {
                  return f.estado.toString().trim() == 'Aprobada';
                });
                break;
              case 'cerrada':
                allData = datosusuario?.filter(function (f) {
                  return f.estado.toString().trim() == 'Cerrada';
                });
                break;
              case 'abierta':
                allData = datosusuario?.filter(function (f) {
                  return f.estado.toString().trim() == 'Abierta';
                });
                break;
              default:
                Swal.fire({
                  title: 'Error',
                  text: 'Para realizar una busqueda por Estado, por favor seleccione uno en la lista desplegable',

                  icon: 'error'
                });
                break;
            }
            break;
          default:
            Swal.fire({
              title: 'Filtrado de datos',
              text: 'Para realizar una busqueda por favor seleccione los parametros a buscar en los datos.',

              icon: 'error'
            });
            break;
        }

        setDataUsuario(allData != null ? allData : dataUsuario);
        break;
      case 'solucionado':
        console.log('solucionado opcion ->' + selectedFilterReciente2);

        console.log('filter TEXT' + FilterTextID2);
        switch (selectedFilterReciente2) {
          case 'NoRadicado':
            console.log('NUM RADICADO');
            allData = datossolucionados?.filter(function (f) {
              return f.numeroRadicado == FilterTextID2;
            });
            break;
          case 'FechaReg':
            console.log('FECHA REG');
            if (dateSelectedInicial2 != undefined && dateSelectedFinal2 != undefined && dateSelectedInicial2.toString() != 'Invalid Date' && dateSelectedFinal2.toString() != 'Invalid Date') {
              console.log('entro FECHA I ' + dateSelectedInicial2.toString() + ' FINAL ' + dateSelectedFinal2.toString());
              allData = datossolucionados?.filter(function (f) {
                // var fecha = new Date(dateSelectedPicker == undefined ? new Date() : dateSelectedPicker.toString());

                return new Date(f.fechaSolicitud) >= dateSelectedInicial2 && new Date(f.fechaSolicitud) <= dateSelectedFinal2;
              });
            } else {
              Swal.fire({
                title: 'Fecha invalida',
                text: 'La Fecha no ha sido seleccionada hasta el momento, por favor seleccione el rango',

                icon: 'error'
              });
            }
            break;
          case 'todos':
            console.log('TODOS');
            allData = datossolucionados?.filter(function (f) {
              // var fecha = new Date(dateSelectedPicker == undefined ? new Date() : dateSelectedPicker.toString());

              return true;
            });
            setImputVisible2(true);
            setEstadoVisible2(false);
            setFechaVisible2(false);
            break;
          case 'Estado':
            switch (selectedFilterEstado2) {
              case 'gestion':
                allData = datossolucionados?.filter(function (f) {
                  return f.estado.toString().trim() == 'En gestión';
                });
                break;
              case 'anulada':
                allData = datossolucionados?.filter(function (f) {
                  return f.estado.toString().trim() == 'Anulada';
                });
                break;
              case 'aprobada':
                allData = datossolucionados?.filter(function (f) {
                  return f.estado.toString().trim() == 'Aprobada';
                });
                break;
              case 'cerrada':
                allData = datossolucionados?.filter(function (f) {
                  return f.estado.toString().trim() == 'Cerrada';
                });
                break;
              case 'abierta':
                allData = datossolucionados?.filter(function (f) {
                  return f.estado.toString().trim() == 'Abierta';
                });
                break;
              default:
                Swal.fire({
                  title: 'Error',
                  text: 'Para realizar una busqueda por Estado, por favor seleccione uno en la lista desplegable',

                  icon: 'error'
                });
                break;
            }
            break;
          default:
            Swal.fire({
              title: 'Filtrado de datos',
              text: 'Para realizar una busqueda por favor seleccione los parametros a buscar en los datos.',

              icon: 'error'
            });
            break;
        }

        setDataSolucionado(allData != null ? allData : datossolucionados);

        break;
      default:
        break;
    }
    console.log('all Data externo ' + JSON.stringify(allData));
    //const dataFIN = allData != undefined ? allData : null;
    //console.log('data FIN ' + JSON.stringify(dataFIN));

    //console.log('entro ' + JSON.stringify(dataFIN));


    //setDataInter(allData != null ? allData : dataUsuario);
    //setDataSolucionado(allData != null ? allData : dataUsuario);


  }

  const ocultarbandejas = async (datos: any) => {
    if (datos === 'bandeja') {
      setocultarnotificacion(true);
      setocultarbandeja(false);
    }
    if (datos === 'notificacion') {
      setocultarnotificacion(false);
      setocultarbandeja(true);
    }
  };


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

  let color = 'blue';
  const onChangeColor = (datos: any) => {
    let array: any[] = [];
    let arrayusuario: any[] = [];
    if (coordinador == 'Funcionario') {
      array = datosusuario;
    } else {
      array = data;
      arrayusuario = datosusuario;
    }

    if (arrayusuario.length > 0) {
      for (let index = 0; index < arrayusuario.length; index++) {
        if (arrayusuario[index].numeroRadicado == datos) {
          let diasproceso = 0;
          if (arrayusuario[index].tipodeSolicitud == 'Proceso de Citacion') {
            diasproceso = dias[0].valorConstante;
          } else {
            if (
              arrayusuario[index].tipodeSolicitud == 'Gestion Validador' ||
              arrayusuario[index].tipodeSolicitud == 'Gestion Coordinador'
            ) {
              diasproceso = dias[1].valorConstante;
            } else {
              if (arrayusuario[index].tipodeSolicitud == 'Gestion Subdirector') {
                diasproceso = dias[2].valorConstante;
              } else {
                color = 'white';
                return 'white';
                break;
              }
            }
          }

          const fechaactual = new Date();
          const fechamod = arrayusuario[index].fechaSolicitud;
          const fechaprueb2 = moment(fechamod);
          const diaspasados = moment(fechaactual).diff(fechaprueb2, 'days');
          //console.log(moment(fechaactual).diff(fechaprueb2, 'days'), ' dias de diferencia');

          if (diaspasados < diasproceso / 2 - 1) {
            color = 'lightgreen';
            return 'lightgreen';
          }
          if (diaspasados >= diasproceso || diaspasados > diasproceso / 2 + 1) {
            color = 'salmon ';
            return 'salmon ';
          }
          if (diaspasados >= diasproceso / 2 - 1 && diaspasados <= diasproceso / 2 + 1) {
            color = 'yellow';
            return 'yellow';
          }

          break;
        }
      }
    }

    for (let index = 0; index < array.length; index++) {
      if (array[index].numeroRadicado == datos) {
        let diasproceso = 0;
        if (array[index].tipodeSolicitud == 'Proceso de Citacion') {
          diasproceso = dias[0].valorConstante;
        } else {
          if (array[index].tipodeSolicitud == 'Gestion Validador' || array[index].tipodeSolicitud == 'Gestion Coordinador') {
            diasproceso = dias[1].valorConstante;
          } else {
            if (array[index].tipodeSolicitud == 'Gestion Subdirector') {
              diasproceso = dias[2].valorConstante;
            } else {
              color = 'white';
              return 'white';
              break;
            }
          }
        }

        const fechaactual = new Date();
        let fechamod = array[index].fechaModificacion;
        if (fechamod == undefined) {
          fechamod = array[index].fechaSolicitud;
        }
        const fechaprueb2 = moment(fechamod);
        const diaspasados = moment(fechaactual).diff(fechaprueb2, 'days');
        //console.log(moment(fechaactual).diff(fechaprueb2, 'days'), ' dias de diferencia');

        if (diaspasados < diasproceso / 2 - 1) {
          color = 'lightgreen';
          return 'lightgreen';
        }
        if (diaspasados >= diasproceso || diaspasados > diasproceso / 2 + 1) {
          color = 'salmon ';
          return 'salmon ';
        }
        if (diaspasados >= diasproceso / 2 - 1 && diaspasados <= diasproceso / 2 + 1) {
          color = 'yellow';
          return 'yellow';
        }

        break;
      } else {
        if (index == array.length - 1) {
          color = 'white';
          return 'white';
        }
      }
    }
  };

  let structureColumns: any[] = [];
  if (mostrar) {
    structureColumns = [
      {
        title: 'No. de Radicado',
        dataIndex: 'numeroRadicado',
        key: 'nroradicado',
        render(text: any, record: any) {
          return {
            props: {
              style: { background: onChangeColor(text) }
            },
            children: <div>{text}</div>
          };
        }
      },
      {
        title: 'Tipo de trámite',
        dataIndex: 'tipodeTramite',
        key: 'idTramite',
        render(text: any, record: any) {
          return {
            props: {
              style: { background: color }
            },
            children: <div>{text}</div>
          };
        }
      },
      {
        title: 'Fecha de Registro',
        dataIndex: 'fechaSolicitud',
        key: 'fechaSolicitud',
        render(text: any, record: any) {
          return {
            props: {
              style: { background: color }
            },
            children: <div>{text}</div>
          };
        }
      },
      {
        title: 'Estado ',
        dataIndex: 'estado',
        key: 'estado',
        render(text: any, record: any) {
          return {
            props: {
              style: { background: color }
            },
            children: <div>{text}</div>
          };
        }
      },
      {
        title: 'Actividad en curso',
        dataIndex: 'actividadActualSolicitud',
        key: 'actividad',
        render(text: any, record: any) {
          return {
            props: {
              style: { background: color }
            },
            children: <div>{text}</div>
          };
        }
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
  }
<<<<<<< .mine
  const añadirinfo = (value: any) => { };
=======

>>>>>>> .theirs

  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body tarjeta h-100'>
          <section className='info-panel'>
            <div className='container-fluid'>
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
            <div className='container-fluid mt-3'>
              <div className='row'>
                <div className='col-lg-12 col-md-12 ml-4'>
                  <div className='info-tramite mt-3 ml-1'>
                    <p>Bandeja de entrada y gestión</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='container-fluid'>
              <div className='row' style={{ marginLeft: '18px' }}>
                <div className='col-md-3 col-sm-12 col-lg-3 prueba'>
                  <div id='accordion ' className='mt-3'>
                    <div className='card'>
                      <div className='card-header' id='heading-2'>
                        <h5 className='mb-0'>
                          <a
                            className='bandeja'
                            role='button'
                            data-toggle='collapse'
                            href='#collapse-2'
                            aria-expanded='true'
                            aria-controls='collapse-2'
                            onClick={() => ocultarbandejas('bandeja')}
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
                            className='collapsed notificacion'
                            role='button'
                            data-toggle='collapse'
                            href='#collapse-3'
                            onClick={() => ocultarbandejas('notificacion')}
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
                <div className='col-lg-9 col-m-9 col-sm-12 mt-1'>
                  <div
                    id='collapse-2'
                    className={`${ocultarbandeja == true ? 'expanded' : 'collapsed'} `}
                    hidden={ocultarbandeja}
                    data-parent='#accordion'
                    aria-labelledby='heading-2'
                  >
                    {mostrar && (
                      <>
                        <div className='col-lg-12 col-md-12 col-sm-12 bandeja_panel'>
                          <ul className='nav nav-tabs  mr-4' role='tablist'>
                            <li className='nav-item encabezados'>
                              <a className='nav-link active' data-toggle='tab' href='#recientes' role='tab'>
                                Recientes
                              </a>
                            </li>
                            {coordinador != 'Subdirector' && (
                              <>
                                <li className='nav-item encabezados'>
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
                                  <p className='mt-4 ml-2  filtro'>Filtrar por:</p>
                                  <div className='row'>
                                    <div className='col-lg-5 col-md-5 col-sm-12' style={{ marginLeft: '10px' }}>
                                      <div className='form-group gov-co-form-group'>
                                        <div className='gov-co-dropdown'>
                                          <Form.Item>
                                            <SelectComponent
                                              onChange={onChangeFilterReciente}
                                              id='filterReciente'
                                              placeholder='-- Seleccione --'
                                              options={[
                                                { key: 'NoRadicado', value: 'Numero Radicado' },
                                                { key: 'FechaReg', value: 'Fecha de Registro' },
                                                { key: 'Estado', value: 'Estado' },
                                                { key: 'todos', value: 'Todos' }
                                              ]}
                                              optionPropkey='key'
                                              optionPropLabel='value'
                                            />
                                          </Form.Item>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col-md-6 col-lg-6 col-sm-12'>
                                      <div className='form-group gov-co-form-group'>
                                        <Form.Item>
                                          <input
                                            type='text'
                                            className='form-control gov-co-form-control panel_d'
                                            /* onKeyPress={(event) => {
                                               if (!/[a-zA-Z]/.test(event.key)) {
                                                 event.preventDefault();
                                               }
                                             }}*/
                                            onPaste={(event) => {
                                              event.preventDefault();
                                            }}
                                            onChange={onChangeFilterID}
                                            hidden={!verImput}
                                          />
                                          <DatepickerComponent
                                            id='datePicker1'
                                            picker='date'
                                            placeholder='Fecha Inicial'
                                            dateDisabledType='default'
                                            dateFormatType='default'
                                            style={{ display: verfecha == true ? 'block' : 'none' }}
                                            className='form-control'
                                            onChange={(date) => {
                                              setDateIni(new Date(moment(date).format('MM-DD-YYYY')));
                                            }}
                                          />
                                          <DatepickerComponent
                                            id='datePicker2'
                                            picker='date'
                                            placeholder='Fecha Final'
                                            dateDisabledType='default'
                                            dateFormatType='default'
                                            style={{ display: verfecha == true ? 'block' : 'none' }}
                                            className='form-control'
                                            onChange={(date) => {
                                              setDateFin(new Date(moment(date).format('MM-DD-YYYY') + 1));
                                            }}
                                          />
                                          <SelectComponent
                                            onChange={onChangeFilterEstado}
                                            id='filterEstado2'
                                            placeholder='-- Seleccione --'
                                            options={[
                                              { key: 'gestion', value: 'En Gestion' },
                                              { key: 'anulada', value: 'Anulada' },
                                              { key: 'aprobada', value: 'Aprobada' },
                                              { key: 'cerrada', value: 'Cerrada' },
                                              { key: 'abierta', value: 'Abierta' }
                                            ]}
                                            optionPropkey='key'
                                            optionPropLabel='value'
                                            style={{ display: verEstado == true ? 'block' : 'none' }}
                                          />
                                        </Form.Item>
                                      </div>
                                      <Button
                                        type='primary'
                                        key={`filtrarReciente`}
                                        onClick={() => onClickFiltrar('reciente')}
                                        style={{ marginRight: '8px' }}
                                        icon={<CheckOutlined />}
                                      >
                                        Filtrar
                                      </Button>
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
                                        dataSource={dataUsuario}
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
                                        dataSource={dataInter}
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
                                  <p className='mt-4 ml-2 filtro'>Filtrar por:</p>
                                  <div className='row'>
                                    <div className='col-lg-5 col-md-5 col-sm-12' style={{ marginLeft: '10px' }}>
                                      <div className='form-group gov-co-form-group'>
                                        <div className='gov-co-dropdown'>
                                          <Form.Item>
                                            <SelectComponent
                                              placeholder='-- Seleccione --'
                                              onChange={onChangeFilterSolucionado}
                                              id='idfilterSol'
                                              options={[
                                                { key: 'NoRadicado', value: 'Numero Radicado' },
                                                { key: 'FechaReg', value: 'Fecha de Registro' },
                                                { key: 'Estado', value: 'Estado' },
                                                { key: 'todos', value: 'Todos' }
                                              ]}

                                              optionPropkey='key'
                                              optionPropLabel='value'
                                            />
                                          </Form.Item>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col-md-5 col-lg-5 col-sm-12'>
                                      <div className='form-group gov-co-form-group'>
                                        <Form.Item>
                                          <input
                                            type='text'
                                            className='form-control gov-co-form-control panel_d'
                                            onPaste={(event) => {
                                              event.preventDefault();
                                            }}
                                            onChange={onChangeFilterID2}
                                            hidden={!verImput2}
                                          />
                                          <DatepickerComponent
                                            id='datePicker12'
                                            picker='date'
                                            placeholder='Fecha Inicial'
                                            dateDisabledType='default'
                                            dateFormatType='default'
                                            style={{ display: verfecha2 == true ? 'block' : 'none' }}
                                            className='form-control'
                                            onChange={(date) => {
                                              setDateIni2(new Date(moment(date).format('MM-DD-YYYY')));
                                            }}
                                          />
                                          <DatepickerComponent
                                            id='datePicker22'
                                            picker='date'
                                            placeholder='Fecha Final'
                                            dateDisabledType='default'
                                            dateFormatType='default'
                                            style={{ display: verfecha2 == true ? 'block' : 'none' }}
                                            className='form-control'
                                            onChange={(date) => {
                                              setDateFin2(new Date(moment(date).format('MM-DD-YYYY') + 1));
                                            }}
                                          />
                                          <SelectComponent
                                            onChange={onChangeFilterEstado2}
                                            id='filterEstado2'
                                            placeholder='-- Seleccione --'
                                            options={[
                                              { key: 'gestion', value: 'En Gestion' },
                                              { key: 'anulada', value: 'Anulada' },
                                              { key: 'aprobada', value: 'Aprobada' },
                                              { key: 'cerrada', value: 'Cerrada' },
                                              { key: 'abierta', value: 'Abierta' }
                                            ]}
                                            optionPropkey='key'
                                            optionPropLabel='value'
                                            style={{ display: verEstado2 == true ? 'block' : 'none' }}
                                          />
                                        </Form.Item>
                                      </div>
                                      <Button
                                        type='primary'
                                        key={`filtrar2`}
                                        onClick={() => onClickFiltrar('solucionado')}
                                        style={{ marginRight: '8px' }}
                                        icon={<CheckOutlined />}
                                      >
                                        Filtrar
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='row'>
                                <div className='col-lg-12 col-md-12 col-sm-12 ml-2'>
                                  <Table
                                    id='tableGen2'
                                    dataSource={dataSolucionado}
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
                                      <p className='mt-4 ml-1 filtro'>Filtrar por:</p>
                                      <div className='row'>
                                        <div className='col-lg-5 col-md-5 col-sm-12' style={{ marginLeft: '10px' }}>
                                          <div className='form-group gov-co-form-group'>
                                            <div className='gov-co-dropdown'>
                                              <Form.Item>
                                                <SelectComponent
                                                  className='select_d'
                                                  placeholder='-- Seleccione --'
                                                  options={[]}
                                                  optionPropkey={''}
                                                />
                                              </Form.Item>
                                            </div>
                                          </div>
                                        </div>
                                        <div className='col-md-5 col-lg-5 col-sm-12'>
                                          <div className='form-group gov-co-form-group'>
                                            <Form.Item>
                                              <input
                                                type='text'
                                                className='form-control gov-co-form-control panel_d'
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
                                        dataSource={dataUsuario}
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
                      </>
                    )}
                  </div>
                  <div
                    id='collapse-3'
                    className={`${ocultarnotificacion == true ? 'expanded' : 'collapsed'} `}
                    hidden={ocultarnotificacion}
                    data-parent='#accordion'
                    aria-labelledby='heading-2'
                  >
                    <div className='col-lg-12 col-md-12 col-sm-12 mt-3 bandeja_panel'>
                      <ul className='nav nav-tabs' role='tablist'>
                        <li className='nav-item encabezadosx'>
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
                        <li className='nav-item encabezadosx'>
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
                              <p className='mt-4 ml-1 filtro'>Filtrar por:</p>
                              <div className='row'>
                                <div className='col-lg-6 col-md-6 col-sm-12'>
                                  <div className='form-group gov-co-form-group ml-2'>
                                    <div className='gov-co-dropdown'>
                                      <Form.Item>
                                        <SelectComponent
                                          className='select_d2'
                                          placeholder='-- Seleccione --'
                                          options={[
                                            { key: 'NoRadicado', value: 'Numero Radicado' },
                                            { key: 'FechaReg', value: 'Fecha de Registro' },
                                            { key: 'solicitante', value: 'Solicitante' },
                                            { key: 'validador', value: 'Validador' },
                                            { key: 'Estado', value: 'Estado' },
                                            { key: 'todos', value: 'Todos' }
                                          ]}
                                          optionPropkey='key'
                                          optionPropLabel='value'
                                        />
                                      </Form.Item>
                                    </div>
                                  </div>
                                </div>
                                <div className='col-md-6 col-lg-6 col-sm-12'>
                                  <div className='form-group gov-co-form-group'>
                                    <Form.Item>
                                      <input
                                        type='text'
                                        className='form-control gov-co-form-control panel_ds'
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
                              <table
                                className='table table-bordered text-center mt-4 '
                                style={{ backgroundColor: '#ede9e3', width: '800px' }}
                              >
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
                                    <th style={{ border: '2px solid #000' }}>Validador</th>
                                    <th style={{ border: '2px solid #000' }}>Estado de validación</th>
                                    <th style={{ border: '2px solid #000' }}>Observaciones</th>
                                  </tr>
                                </thead>
                                <tbody className='cuerpo_table'>
                                  <tr style={{ border: '2px solid #000' }}>
                                    <td style={{ border: '2px solid #000' }}></td>
                                    <td style={{ border: '2px solid #000' }}></td>
                                    <td style={{ border: '2px solid #000' }}></td>
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
                            <div className='col-lg-11 col-md-11 col-sm-12 mt-3'>
                              <p className='filtro'>
                                <span className='text-danger font-weight-bold mr-1 ml-3 '>*</span> Tipo de notificación
                              </p>
                              <div className='form-group gov-co-form-group ml-2'>
                                <div className='gov-co-dropdown'>
                                  <select id='selector-simple' className='selectpicker form-control select' title='Escoger'>
                                    <option>Oficio de notificación</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className='col-m-12 col-lg-12 col-sm-12 mt-3 ml-2 '>
                              <button
                                className='btn btn-default'
                                style={{ backgroundColor: ' #CBCBCB', float: 'right', marginTop: '25px' }}
                              >
                                Notificar
                              </button>
                              <button
                                className='btn btn-default mr-3'
                                style={{ backgroundColor: ' #CBCBCB', float: 'right', marginTop: '25px' }}
                              >
                                Ver vista previa
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className='tab-pane' id='tabs-2' role='tabpanel'>
                          <div className='row'>
                            <div className='col-lg-12 col-sm-12 colmd-12 ml-2'>
                              <p className='mt-4 ml-1 filtro'>Filtrar por:</p>
                              <div className='row'>
                                <div className='col-lg-6 col-md-6 col-sm-12'>
                                  <div className='form-group gov-co-form-group ml-2'>
                                    <div className='gov-co-dropdown'>
                                      <Form.Item>
                                        <SelectComponent
                                          className='select_d3'
                                          placeholder='-- Seleccione --'
                                          options={[
                                            { key: 'NoRadicado', value: 'Numero Radicado' },
                                            { key: 'FechaReg', value: 'Fecha de Registro' },
                                            { key: 'Estado', value: 'Estado' },
                                            { key: 'todos', value: 'Todos' }
                                          ]}
                                          optionPropkey={''}
                                        />
                                      </Form.Item>
                                    </div>
                                  </div>
                                </div>
                                <div className='col-md-6 col-lg-6 col-sm-12'>
                                  <div className='form-group gov-co-form-group'>
                                    <Form.Item>
                                      <input
                                        type='text'
                                        className='form-control gov-co-form-control panel_ds'
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
                              <table
                                className='table table-bordered text-center mt-4'
                                style={{ backgroundColor: '#ede9e3', width: '800px' }}
                              >
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
                                <tbody className='cuerpo_table'>
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

