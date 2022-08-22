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
import { layoutItems } from 'app/shared/utils/form-layout.util';

export const Bandeja = (props: IDataSource) => {
  const history = useHistory();
  const { data, datosusuario, datossolucionados, notificaciones, historico } = props;

  const [dataInter, setDataInter] = useState<any[]>([]);
  const [dataUsuario, setDataUsuario] = useState<any[]>([]);
  const [dataSolucionado, setDataSolucionado] = useState<any[]>([]);

  const [datanotificaciones, setnotificaciones] = useState<any[]>([]);
  const [datahistoriconotificaciones, sethistoriconotificaciones] = useState<any[]>([]);

  const [dateSelectedInicial, setDateIni] = useState<Date>();
  const [dateSelectedFinal, setDateFin] = useState<Date>();

  const [roles, setroles] = useState<String>('');
  const [mostrar, setmostrar] = useState<Boolean>(false);

  const [ocultarbandeja, setocultarbandeja] = useState<boolean>(false);
  const [ocultarnotificacion, setocultarnotificacion] = useState<boolean>(true);
  const [dias, setdias] = useState<any>([]);

  const [coordinador, setcoordinador] = useState<String>('');

  const [value, setValue] = useState('');

  const Paginas: number = 5;
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();

  //////filtros

  ///////////
  const getListas = useCallback(
    async () => {
      const rolesstorage: any = localStorage.getItem('roles');
      const subredes = await api.getSubredes();
      localStorage.setItem('subredes', JSON.stringify(subredes));

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
    //console.log('DATA RECIBIDA \n ' + JSON.stringify(data));
    setDataInter(data);
    setDataUsuario(datosusuario);
    setDataSolucionado(datossolucionados);
    setnotificaciones(notificaciones);
    sethistoriconotificaciones(historico);
    getListas();
  }, []);

  function onClickFiltrar(datos: String) {
    var allData = null;

    if (
      dateSelectedInicial != undefined &&
      dateSelectedFinal != undefined &&
      dateSelectedInicial.toString() != 'Invalid Date' &&
      dateSelectedFinal.toString() != 'Invalid Date'
    ) {
      const datosusuariofecha = datosusuario?.filter(function (f) {
        return new Date(f.fechaSolicitud) >= dateSelectedInicial && new Date(f.fechaSolicitud) <= dateSelectedFinal;
      });
      const datosinterfecha = data?.filter(function (f) {
        return new Date(f.fechaSolicitud) >= dateSelectedInicial && new Date(f.fechaSolicitud) <= dateSelectedFinal;
      });

      const datossolucionadosfecha = datossolucionados?.filter(function (f) {
        return new Date(f.fechaSolicitud) >= dateSelectedInicial && new Date(f.fechaSolicitud) <= dateSelectedFinal;
      });

      const datosnotificacionfecha = notificaciones?.filter(function (f) {
        return new Date(f.fechaSolicitud) >= dateSelectedInicial && new Date(f.fechaSolicitud) <= dateSelectedFinal;
      });

      const datoshistoricofecha = historico?.filter(function (f) {
        return new Date(f.fechaSolicitud) >= dateSelectedInicial && new Date(f.fechaSolicitud) <= dateSelectedFinal;
      });

      setDataInter(datosinterfecha);
      setDataSolucionado(datossolucionados);
      setDataUsuario(datosusuariofecha);
      setnotificaciones(datosnotificacionfecha);
      sethistoriconotificaciones(datoshistoricofecha);
    } else {
      Swal.fire({
        title: 'Fecha invalida',
        text: 'La Fecha no ha sido seleccionada hasta el momento, por favor seleccione el rango',

        icon: 'error'
      });
    }

    allData = datosusuario?.filter(function (f) {
      return true;
    });
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
    resetdata();
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
    let arraynotificacion: any[] = [];
    if (coordinador == 'Funcionario') {
      array = datosusuario;
    } else {
      array = data;
      arrayusuario = datosusuario;
      arraynotificacion = notificaciones;
      //console.log('entro', arraynotificacion);
    }

    if (arraynotificacion.length > 0) {
      for (let index = 0; index < arraynotificacion.length; index++) {
        if (arraynotificacion[index].numeroRadicado == datos) {
          let diasproceso = 0;
          if (arraynotificacion[index].tipodeSolicitud == 'Proceso de Citacion') {
            diasproceso = dias[0].valorConstante;
          } else {
            if (
              arraynotificacion[index].tipodeSolicitud == 'Gestion Validador' ||
              arraynotificacion[index].tipodeSolicitud == 'Gestion Coordinador'
            ) {
              diasproceso = dias[1].valorConstante;
            } else {
              if (arraynotificacion[index].tipodeSolicitud == 'Gestion Subdirector') {
                diasproceso = dias[2].valorConstante;
              } else {
                color = 'white';
                return 'white';
              }
            }
          }

          const fechaactual = new Date();
          const fechamod = arraynotificacion[index].fechaSolicitud;
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

  //resetear filtros
  const resetdata = () => {
    setValue('');
    setDateIni(undefined);
    setDateFin(undefined);
    setDataSolucionado(datossolucionados);

    setDataInter(data);
    setDataUsuario(datosusuario);
    setnotificaciones(notificaciones);

    form.resetFields(['fechainicial', 'fechafinal']);
  };
  ////
  ////hacer busqueda del nro de radicado por filtro
  const FilterByNameInput = (tipo: string) => {
    let array: any[] = [];
    let arraysolucionados: any[] = [];

    let arrayusuario: any[] = [];
    arraysolucionados = datossolucionados;

    if (coordinador == 'Funcionario') {
      array = datosusuario;
    } else {
      array = data;
      arrayusuario = datosusuario;
    }
    return (
      <Input
        placeholder='Nro'
        value={value}
        onChange={(e) => {
          const currValue: string = e.target.value;
          console.log(currValue);
          setValue(currValue);
          console.log(notificaciones);
          if (tipo == 'normal') {
            const filteredData: any = array.filter((datos: any) => {
              return datos.numeroRadicado.toString().includes(currValue);
            });

            if (coordinador == 'Funcionario') {
              setDataUsuario(filteredData);
            } else {
              const filteredData3: any = arrayusuario.filter((datos: any) => {
                return datos.numeroRadicado.toString().includes(currValue);
              });
              setDataInter(filteredData);
              setDataUsuario(filteredData3);
            }

            const filteredData2: any = arraysolucionados.filter((datos: any) => {
              return datos.numeroRadicado.toString().includes(currValue);
            });

            setDataSolucionado(filteredData2);
          } else {
            const filteredDatanotificacion: any = notificaciones.filter((datos: any) => {
              return datos.numeroRadicado.toString().includes(currValue);
            });
            setnotificaciones(filteredDatanotificacion);
          }
        }}
      />
    );
  };

  let structureColumns: any[] = [];
  let structureColumnsnotificacion: any[] = [];
  let structureColumnsnotificacionhistorico: any[] = [];
  if (mostrar) {
    structureColumns = [
      {
        title: FilterByNameInput('normal'),
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

        onFilter: (value: string, record: { estado: string }) => record.estado.toString().includes(value),
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
    //////notificaciones
    structureColumnsnotificacion = [
      {
        title: FilterByNameInput('notificacion'),
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

        onFilter: (value: string, record: { estado: string }) => record.estado.toString().includes(value),
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
        title: 'Validador',
        dataIndex: 'nombreSubred',
        key: 'nombreSubred',
        filters: [
          {
            text: 'Subred Centro Oriente E.S.E.',
            value: 'Subred Integrada de Servicios de Salud Centro Oriente E.S.E. '
          },
          {
            text: 'Subred Norte E.S.E.',
            value: 'Subred Integrada de Servicios de Salud Norte E.S.E. '
          },
          {
            text: 'Subred Sur E.S.E.',
            value: 'Subred integrada de Servicios de Salud Sur E.S.E. '
          },
          {
            text: 'Subred Sur Occidente E.S.E.',
            value: 'Subred integrada de Servicios de Salud Sur Occidente E.S.E. '
          }
        ],
        filterSearch: true,

        onFilter: (value: string, record: { nombreSubred: string }) => record.nombreSubred.toString().includes(value),
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
        title: 'Estado de validación',
        dataIndex: 'tipodeSolicitud',
        key: 'tipodeSolicitud',
        filters: [
          {
            text: 'Abierta',
            value: 'Abierta'
          },
          {
            text: 'Adición Documentos',
            value: 'Adicion Documentos'
          },
          {
            text: 'Desistimiento',
            value: 'Desistimiento'
          },
          {
            text: 'Finalizado',
            value: 'Finalizado'
          },
          {
            text: 'Gestion Validador',
            value: 'Gestion Validador'
          },
          {
            text: 'Primera vez',
            value: 'Primera vez'
          },
          {
            text: 'Proceso de Citacion',
            value: 'Proceso de Citacion'
          },
          {
            text: 'Subsanacion',
            value: 'Subsanacion'
          },
          {
            text: 'Visita de Revision',
            value: 'Visita de Revision'
          }
        ],
        filterSearch: true,

        onFilter: (value: string, record: any) => record.tipodeSolicitud.toString().includes(value),
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
        title: 'Observaciones',
        dataIndex: '',
        key: '',
        render(text: any, record: any) {
          return {
            props: {
              style: { background: color }
            },
            children: <div>{}</div>
          };
        }
      }
    ];
    ///historico
    structureColumnsnotificacionhistorico = [
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
          record.actividadActualSolicitud.toString().includes(value)
      }
    ];
  }

  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body tarjeta h-100'>
          <Form form={form} {...layoutItems} layout='horizontal'>
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
                    {coordinador == 'Coordinador' && (
                      <>
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
                      </>
                    )}
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
                                <a
                                  className='nav-link active'
                                  data-toggle='tab'
                                  onClick={() => resetdata()}
                                  href='#recientes'
                                  role='tab'
                                >
                                  Recientes
                                </a>
                              </li>
                              {coordinador != 'Subdirector' && (
                                <>
                                  <li className='nav-item encabezados'>
                                    <a
                                      className='nav-link'
                                      data-toggle='tab'
                                      onClick={() => resetdata()}
                                      href='#solucionados'
                                      role='tab'
                                    >
                                      Solucionados
                                    </a>
                                  </li>
                                </>
                              )}

                              {coordinador == 'Coordinador' && (
                                <>
                                  <li className='nav-item encabezados'>
                                    <a
                                      className='nav-link'
                                      data-toggle='tab'
                                      onClick={() => resetdata()}
                                      href='#prueba'
                                      role='tab'
                                    >
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
                                            setDateFin(new Date(moment(date).format('MM-DD-YYYY') + 1));
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
                                    <p className='mt-4 ml-2  filtro'>Filtrar por:</p>
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
                                            setDateFin(new Date(moment(date).format('MM-DD-YYYY') + 1));
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
                                        <p className='mt-4 ml-2  filtro'>Filtrar por:</p>
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
                                                setDateFin(new Date(moment(date).format('MM-DD-YYYY') + 1));
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
                    {coordinador == 'Coordinador' && (
                      <>
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
                                  onClick={() => resetdata()}
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
                                  onClick={() => resetdata()}
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
                                  <div className='col-lg-12 col-sm-12 col-md-12 '>
                                    <p className='mt-4 ml-2  filtro'>Filtrar por:</p>
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
                                            setDateFin(new Date(moment(date).format('MM-DD-YYYY') + 1));
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
                                      id='tablenot'
                                      dataSource={datanotificaciones}
                                      columns={structureColumnsnotificacion}
                                      pagination={{ pageSize: Paginas }}
                                      className='table_info'
                                    />
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
                                  <div className='col-lg-12 col-sm-12 col-md-12 '>
                                    <p className='mt-4 ml-2  filtro'>Filtrar por:</p>
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
                                            setDateFin(new Date(moment(date).format('MM-DD-YYYY') + 1));
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
                                      id='tablehistnot'
                                      dataSource={datahistoriconotificaciones}
                                      columns={structureColumnsnotificacionhistorico}
                                      pagination={{ pageSize: Paginas }}
                                      className='table_info'
                                    />
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
            </section>
          </Form>
        </div>
      </div>
    </div>
  );
};

interface IDataSource {
  data: Array<any>;
  datosusuario: Array<any>;
  datossolucionados: Array<any>;
  notificaciones: Array<any>;
  historico: Array<any>;
}
