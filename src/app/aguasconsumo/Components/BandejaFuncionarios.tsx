import React from 'react';
import logo from '../../../../src/assets/images/aguas/alcadia.png';
import profile from '../../../../src/assets/images/aguas/profile.png';
import revision from '../../../../src/assets/images/aguas/revisionencampo.jpg';
import { Form, Input } from 'antd';
import '../../../css/estilos.css';

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
import { CheckOutlined, FilePdfOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import Swal from 'sweetalert2';
import { layoutItems } from 'app/shared/utils/form-layout.util';
import documentoNoEncontrado from '../../../assets/images/aguas/documentoNoEncontrado.jpg';

export const BandejaFuncionarios = (props: IDataSource) => {
  const history = useHistory();
  const { data, datosusuario, datossolucionados, notificaciones, historico } = props;

  const [dataInter, setDataInter] = useState<any[]>([]);
  const [dataUsuario, setDataUsuario] = useState<any[]>([]);
  const [dataSolucionado, setDataSolucionado] = useState<any[]>([]);

  const [datanotificaciones, setnotificaciones] = useState<any[]>([]);
  const [datahistoriconotificaciones, sethistoriconotificaciones] = useState<any[]>([]);

  const [dateSelectedInicial, setDateIni] = useState<Date>();
  const [dateSelectedFinal, setDateFin] = useState<Date>();

  const [filtroactual, setfiltroactual] = useState<String>('');

  const [solicitudaguardar, setsolicitudaguardar] = useState<any>();
  const [isVisibleDocumentoGestion, setVisibleDocumentoGestion] = useState<boolean>(false);


  const [roles, setroles] = useState<String>('');
  const [mostrar, setmostrar] = useState<Boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataTable, setDataTable] = useState<[]>();
  const [ocultarbandeja, setocultarbandeja] = useState<boolean>(false);
  const [ocultarnotificacion, setocultarnotificacion] = useState<boolean>(true);
  const [dias, setdias] = useState<any>([]);

  const [coordinador, setcoordinador] = useState<String>('');

  const [value, setValue] = useState('');

  const Paginas: number = 5;
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();

  const [isModalVisiblePdf, setIsModalVisiblePdf] = useState(false);
  const [urlPdfLicence, setUrlPdfLicence] = useState<any>('');

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

    setDataInter(data);
    setDataUsuario(datosusuario);
    setDataSolucionado(datossolucionados);
    setnotificaciones(notificaciones);
    sethistoriconotificaciones(historico);
    getListas();
  }, []);

  function onClickFiltrar(datos: String) {

    let datossinfiltrar = false;


    ///datos

    if (value === '') {
      datossinfiltrar = true;

    }
    var allData = null;
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

      const datosusuariofecha = datosusuario?.filter(function (f) {
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

      const datosnotificacionfecha = notificaciones?.filter(function (f) {
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

      const datoshistoricofecha = historico?.filter(function (f) {
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

      //comentario para actualizar bandejas

      setDataInter(datosinterfecha);
      setDataSolucionado(datossolucionadosfecha);
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

  const onClickValidarArchivo = (datos: any) => {


    setsolicitudaguardar(datos);
    setVisibleDocumentoGestion(true);
  };


  const onClickSubirArchivo = async () => {

    const archivo = form.getFieldValue('cargarvisita')


    const supportDocumentsEdit: any[] = [];
    const formData = new FormData();

    formData.append('file', archivo.file);
    formData.append('nameFile', 'Documento_revision' + '_' + solicitudaguardar.idSolicitud);

    supportDocumentsEdit.push({
      idSolicitud: solicitudaguardar.idSolicitud,
      idTipoDocumentoAdjunto: '3C9CF345-E37D-4AB0-BACA-C803DBB5380B',
      path: `${solicitudaguardar.idUsuario}/Documento_revision_${solicitudaguardar.idSolicitud}`,
      idUsuario: solicitudaguardar.idUsuario,
      idDocumentoAdjunto: '00000000-0000-0000-0000-000000000000',
      esValido: true
    });

    formData.append('containerName', 'aguahumanos');
    formData.append('oid', solicitudaguardar.idUsuario);

    await api.uploadFiles(formData);
    await api.AddSupportDocumentsAguas(supportDocumentsEdit);

    setVisibleDocumentoGestion(false);

    await api.CambiarEstadoSolicitudAguas(solicitudaguardar.idSolicitud, '96D00032-4B60-4027-AFEA-0CC7115220B4',
      '8CA363C0-66AA-4273-8E63-CE3EAC234857');

  };

  const onClickValidarInformacion = async (datos: any) => {
    const data = datos;

    localStorage.setItem('register', JSON.stringify(data));
    store.dispatch(SetResetViewLicence());
    if (data.tipodeSolicitud == 'Primer Registro' || data.tipodeSolicitud == 'Gestion Validador') {
      history.push('/tramites-servicios-aguas/Revision/revisar-solicitud');
    }
    if (
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

  const resetfecha = () => {
    setValue('');
    setDateIni(undefined);
    setDateFin(undefined);


    setDataSolucionado(datossolucionados);
    setDataInter(data);
    setDataUsuario(datosusuario);
    setnotificaciones(notificaciones);

    form.resetFields(['fechainicial', 'fechafinal']);
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
    sethistoriconotificaciones(historico);

    form.resetFields(['fechainicial', 'fechafinal']);
  };
  ////
  ////hacer busqueda del nro de radicado por filtro
  const FilterByNameInput = (tipo: string) => {
    let array: any[] = [];
    let arraysolucionados: any[] = [];
    let fecha = false;
    let fechain = new Date();
    let fechafin = new Date();

    let arrayusuario: any[] = [];
    arraysolucionados = datossolucionados;

    if (coordinador == 'Funcionario') {
      array = datosusuario;
    } else {
      array = data;
      arrayusuario = datosusuario;
    }
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
        style={{ width: 200, marginTop: 4, marginRight: 4 }}
        onChange={(e) => {
          const currValue: string = e.target.value;

          setValue(currValue);




          if (tipo == 'normal') {
            const filteredData: any = array.filter((datos: any) => {
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

            if (coordinador == 'Funcionario') {
              setDataUsuario(filteredData);
            } else {
              const filteredData3: any = arrayusuario.filter((datos: any) => {
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
              setDataUsuario(filteredData3);
            }

            const filteredData2: any = arraysolucionados.filter((datos: any) => {
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
          } else {
            const filteredDatanotificacion: any = notificaciones.filter((datos: any) => {
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
            setnotificaciones(filteredDatanotificacion);
          }
        }}
      />
    );
  };

  const onClickVisualizarPDF = async (row: any) => {

    try {

      const contenedor: string = 'aguahumanos';
      const oid: string = row.idUsuario;
      const nameBlob = 'RESOLUCION_' + 'N°' + row.numeroRadicado;


      const path = contenedor + "/" + oid + "/" + nameBlob;
      var respuesta = await api.GetBlobAzureV2(path);


      if (respuesta != null) {

        const urlPDF = await api.GetUrlPdf(path);

        setUrlPdfLicence(urlPDF);

        setIsModalVisiblePdf(true);

      } else {
        Swal.fire({
          imageUrl: documentoNoEncontrado,
          imageHeight: 150,
          title: 'DOCUMENTO NO ENCONTRADO',
          confirmButtonColor: '#b6e5ef',
          text:
            'El documeto que intenta visualizar no se encuentra. Por favor comuníquese con el area de soporte para informar el caso y vuelva a intentarlo mas tarde.'
        });
      }

    } catch (error) {
      Swal.fire({
        imageUrl: documentoNoEncontrado,
        imageHeight: 150,
        title: 'DOCUMENTO NO ENCONTRADO',
        confirmButtonColor: '#b6e5ef',
        text:
          'El documeto que intenta visualizar no se encuentra. Por favor comuníquese con el area de soporte para informar el caso y vuelva a intentarlo mas tarde.'
      });
    }
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
        width: 200,
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { numeroRadicado: number; }, b: { numeroRadicado: number; }) => a.numeroRadicado - b.numeroRadicado,
          multiple: 1,
        },
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
        title: 'Visualizar PDF',
        key: 'visualizarPDF',
        render: (_: any, row: any, index: any) => {
          if (row.estado == 'Aprobada') {
            return (
              <FilePdfOutlined
                onClick={() => onClickVisualizarPDF(row)}
                style={{ fontSize: '30px' }}
              />);
          } else {
            return null;
          }
        }
      },
      {
        title: 'Tipo de trámite',
        dataIndex: 'tipodeTramite',
        key: 'idTramite',
        width: 230,

        sorter: {
          compare: (a: { tipodeTramite: string; }, b: { tipodeTramite: string; }) =>
            a.tipodeTramite > b.tipodeTramite ? 1 : -1,
          multiple: 1,
        },
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
        width: 230,
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
        title: 'Estados ',
        dataIndex: 'estado',
        key: 'estado',
        width: 230,
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
        width: 260,

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
        width: 200,
        align: 'center' as 'center',

        render: (_: any, row: any, index: any) => {

          if (row.tipodeSolicitud === 'Visita de Revision') {
            return (
              <Button
                type='primary'
                key={`vali-${index}`}
                onClick={() => onClickValidarArchivo(row)}
                style={{ marginRight: '8px' }}
                icon={<CheckOutlined />}
              >
                Cargar Archivo
              </Button>
            );
          }
          else {
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
            }
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
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: { numeroRadicado: number; }, b: { numeroRadicado: number; }) => a.numeroRadicado - b.numeroRadicado,
          multiple: 1,
        },
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
        width: 200,

        sorter: {
          compare: (a: { tipodeTramite: string; }, b: { tipodeTramite: string; }) =>
            a.tipodeTramite > b.tipodeTramite ? 1 : -1,
          multiple: 1,
        },
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
        width: 200,
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
        width: 200,
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
        width: 200,
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
        width: 200,
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
        width: 200,
        key: '',
        render: (_: any, row: any, index: any) => {
          return (
            <Button
              onClick={() => Openmodal(row)}
              type='primary'
              style={{ marginRight: '8px' }}
              icon={<CheckOutlined />}
            >
              Notificaciones
            </Button>
          )
        }
      }
    ];
    ///historico
    structureColumnsnotificacionhistorico = [
      {
        title: 'Tipo de trámite',
        dataIndex: 'tipodeTramite',
        key: 'idTramite',
        width: 200,
        sorter: {
          compare: (a: { tipodeTramite: string; }, b: { tipodeTramite: string; }) =>
            a.tipodeTramite > b.tipodeTramite ? 1 : -1,
          multiple: 1,
        }
      },
      {
        title: 'Fecha de Registro',
        dataIndex: 'fechaSolicitud',
        key: 'fechaSolicitud',
        width: 200,
      },
      {
        title: 'Estado ',
        dataIndex: 'estado',
        key: 'estado',
        width: 200,
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
        width: 260,
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


  const Openmodal = async (solicitud: any) => {
    const seguimiento: any = await api.getObservacionesList(solicitud.idSolicitud);
    setDataTable(seguimiento);
    showModal();
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columnFake = [
    {
      title: 'Observación',
      dataIndex: 'observacion',
      key: 'Observacion'
    },
    {
      title: 'Fecha de Registro',
      dataIndex: 'fechaObservacion',
      key: 'fechaObservacion'
    }
  ];
  return (

    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body tarjeta h-100 card_tarjeta' >
          <Form form={form} {...layoutItems} layout='horizontal'>
            <section className='info-panel'>
              <div className='container'>
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
                                  </div>
                                </div>
                                <div className="row " style={{ marginLeft: '2px' }}>
                                  <div className="col-lg-5">
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
                                          setDateIni(new Date(moment(date).format('MM/DD/YYYY')));
                                        }}
                                      />
                                    </Form.Item>
                                  </div>
                                  <div className="col-lg-5">
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
                                          setDateFin(new Date(moment(date).add(1, 'day').format('MM/DD/YYYY')));
                                        }}
                                      />
                                    </Form.Item>
                                  </div>
                                  <div className="col-lg-2">
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
                                <div className='row'>
                                  <div className='col-lg-12 col-md-12 col-sm-12 ml-2'>
                                    {coordinador == 'Funcionario' && (
                                      <>
                                        <Table

                                          id='tableGen'
                                          scroll={{ x: 500 }}
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
                                          scroll={{ x: 500 }}
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
                                    <div className="row " style={{ marginLeft: '2px' }}>
                                      <div className="col-lg-5">
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
                                              setDateIni(new Date(moment(date).format('MM/DD/YYYY')));
                                            }}
                                          />
                                        </Form.Item>
                                      </div>
                                      <div className="col-lg-5">
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
                                              setDateFin(new Date(moment(date).add(1, 'day').format('MM/DD/YYYY')));
                                            }}
                                          />
                                        </Form.Item>
                                      </div>
                                      <div className="col-lg-2">
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
                                </div>
                                <div className='row'>
                                  <div className='col-lg-12 col-md-12 col-sm-12 ml-2'>
                                    <Table
                                      scroll={{ x: 500 }}
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
                                        <div className="row " style={{ marginLeft: '2px' }}>
                                          <div className="col-lg-5">
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
                                                  setDateIni(new Date(moment(date).format('MM/DD/YYYY')));
                                                }}
                                              />
                                            </Form.Item>
                                          </div>
                                          <div className="col-lg-5">
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
                                                  setDateFin(new Date(moment(date).add(1, 'day').format('MM/DD/YYYY')));
                                                }}
                                              />
                                            </Form.Item>
                                          </div>
                                          <div className="col-lg-2">
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
                                    </div>
                                    <div className='row'>
                                      <div className='col-lg-12 col-md-12 col-sm-12 ml-2'>
                                        <Table
                                          scroll={{ x: 500 }}
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
                                    <div className="row " style={{ marginLeft: '2px' }}>
                                      <div className="col-lg-5">
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
                                              setDateIni(new Date(moment(date).format('MM/DD/YYYY')));
                                            }}
                                          />
                                        </Form.Item>
                                      </div>
                                      <div className="col-lg-5">
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
                                              setDateFin(new Date(moment(date).add(1, 'day').format('MM/DD/YYYY')));
                                            }}
                                          />
                                        </Form.Item>
                                      </div>
                                      <div className="col-lg-2">
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
                                </div>
                                <div className='row'>
                                  <div className='col-lg-12 col-md-12 col-sm-12 ml-2'>
                                    <Table
                                      scroll={{ x: 500 }}
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
                                            setDateIni(new Date(moment(date).format('MM/DD/YYYY')));
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
                                            setDateFin(new Date(moment(date).format('MM/DD/YYYY') + 1));
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
                                      scroll={{ x: 500 }}
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
                <div className='row'>
                  <Modal
                    title={
                      <p className='text-center text-dark text-uppercase mb-0 titulo modal-dialog-scrollable'>
                        Visualización de la licencia
                      </p>
                    }
                    visible={isModalVisiblePdf}
                    onCancel={() => setIsModalVisiblePdf(false)}
                    width={1000}
                    okButtonProps={{ hidden: true }}
                    cancelText='Cerrar'
                  >
                    <iframe src={urlPdfLicence} frameBorder='0' scrolling='auto' height='600vh' width='100%'></iframe>
                  </Modal>
                </div>
              </div>
            </section>
            <div className='row'>
              {/** Modal que se despliega cuando se quiere gestionar una solicitud por parte del ciudadano */}
              <Modal
                title={<p className='text-center'>Gestión de Documentos</p>}
                visible={isVisibleDocumentoGestion}
                width={800}
                onCancel={() => setVisibleDocumentoGestion(false)}
                footer={[]}
              >
                <div className='row'>
                  <img src={revision} width='60%' alt='logo' className='e-block mx-auto img-fluid float-end ml-2' />
                  <div className='col-gl-12 col-sm-12 col-md-12'>
                    <Form.Item label='Cargar Archivo de Visita Tecnica' name='cargarvisita' rules={[{ required: true }]}>
                      <Upload
                        name='cargarvisita'
                        maxCount={1}
                        beforeUpload={() => false}
                        listType='text'
                        accept='application/pdf'
                      >
                        <Button icon={<UploadOutlined />}>Adjuntar archivo</Button>
                      </Upload>
                    </Form.Item>


                  </div>
                </div>
                <div className='row ml-5'>
                  <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
                    <Button style={{ margin: 10 }} type='primary' htmlType='button' onClick={() => onClickSubirArchivo()}>
                      Guardar
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
            <br /><br /><br /><br /><br /><br />
          </Form>
        </div>
      </div>
      <Modal
        title={
          <p className='text-center text-dark text-uppercase mb-0 titulo'>
            Ventana de seguimiento y auditoria
          </p>
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1500}
        okButtonProps={{ hidden: true }}
        cancelText='Cerrar'
      >
        <Table
          // className='text-center table'
          dataSource={dataTable}
          columns={columnFake}
          scroll={{ x: 1200 }}
          pagination={{ hideOnSinglePage: true }}
        />
      </Modal>
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
