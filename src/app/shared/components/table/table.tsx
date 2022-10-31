import { CheckOutlined, FilePdfOutlined, UploadOutlined } from '@ant-design/icons';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { IRoles } from 'app/inhumacioncremacion/Models/IRoles';
import { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import Form, { FormInstance } from 'antd/es/form';
import { store } from 'app/redux/app.reducers';
import { Button, Modal, Upload } from 'antd';
import { useHistory } from 'react-router';
import Input from 'antd/es/input';
import Table from 'antd/es/table';
import { DatepickerComponent } from '../inputs/datepicker.component';
import moment from 'moment';
import { errorMessage, infoMessage } from 'app/services/settings/message.service';

export const Gridview = (props: IDataSource) => {
  const history = useHistory();
  const { data } = props;
  const [isVisibleDocumentoGestion, setVisibleDocumentoGestion] = useState<boolean>(false);
  const [tipoSolicitud, setTipoSolicitud] = useState<string>('default-tiposolicitud');
  const [listadoDocumento, setListadoDocumento] = useState<Array<Document>>([]);
  const [observacion, setObservacion] = useState<string>('default');
  const { accountIdentifier } = authProvider.getAccount();
  const [fechasolicitud, setfechasolicitud] = useState<any>();
  const [mostrar, setmostrar] = useState<boolean>(false);
  const [Validacion, setValidacion] = useState<string>('0');
  const [roles, setroles] = useState<IRoles[]>([]);
  const api = new ApiService(accountIdentifier);
  const Paginas: number = 10;
  const [isModalVisiblePdf, setIsModalVisiblePdf] = useState(false);
  const [urlPdfLicence, setUrlPdfLicence] = useState<any>('');


  const [datosUsuario, setdatosUsuario] = useState<any>([]);
  const [fechafiltro, setfechafiltro] = useState<any>();
  const [funerariafiltro, setfunerariafiltro] = useState<any>('');
  const [idtramite, setidtramite] = useState<any>('');
  const [documento, setdocumento] = useState<any>('');


  const listaprueba: any[] =
    [{ consecutivo: '2022REINC00000046' },
    { consecutivo: '2020REINC00000046' },
    { consecutivo: '2021REINC00000046' },
    { consecutivo: '2022REINC00000047' },
    { consecutivo: '2022RECRC00000045' },
    { consecutivo: '2022RECRC00000046' },
    { consecutivo: '2022RECRC00000048' },
    { consecutivo: '2022RECRC00000049' },
    { consecutivo: '2022RECRC00000040' },
    { consecutivo: '2022RECRC00000047' },
    { consecutivo: '2022REINC00000048' },
    { consecutivo: '2020REINC00000045' },
    { consecutivo: '2021REINC00000046' },
    { consecutivo: '2021REINC00000046' },]
    ;





  const getListas = useCallback(

    async () => {

      const rolesstorage: any = localStorage.getItem('roles');

      /*
      let resp: any = [];
      if (rolesstorage.rol === 'Ciudadano') {
        resp = await api.GetEstadoSolicitudNuevoCambio();
      }
      else {
        resp = await api.getallbyEstado('FDCEA488-2EA7-4485-B706-A2B96A86FFDF');
      }
*/

      const datostabla: any = localStorage.getItem('tablainhcrem');
      const datosjson = JSON.parse(datostabla)
      setdatosUsuario(datosjson);


      setroles(JSON.parse(rolesstorage));
      setValidacion('1');
      setmostrar(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
  }, []);

  const [Tipo] = roles;




  const FilterByNameInputfecha = () => {

    return (
      <Form.Item style={{ width: 200, marginTop: 4, marginRight: 4 }} initialValue={fechafiltro}>
        <DatepickerComponent
          id='datePicker1'
          picker='date'
          placeholder='Fecha de Solicitud'
          dateDisabledType='default'
          dateFormatType='default'
          className='form-control'
          onChange={(e) => {

            setfechafiltro(e);
            if (e != null) {
              let fecha: any = '';
              if (Tipo.rol !== 'Ciudadano') {
                fecha = moment(e).format('YYYY-MM-DD');
              }
              else {
                fecha = moment(e).format('DD-MM-YYYY');
              }

              setfechafiltro(fecha);

              if (idtramite === '') {
                const filteredDataUsuario: any = data.filter((datos: any) => {
                  const funeraria: string = datos.razonSocialSolicitante.toUpperCase();
                  return (
                    datos.fechaSolicitud.toString().includes(fecha) &&
                    funeraria.toString().includes(funerariafiltro.toUpperCase()) &&

                    datos.noIdentificacionSolicitante.toString().includes(documento.toUpperCase())
                  );
                });
                setdatosUsuario(filteredDataUsuario);
              }
              else {
                const filteredDataUsuario: any = data.filter((datos: any) => {
                  const funeraria: string = datos.razonSocialSolicitante.toUpperCase();
                  return (
                    datos.fechaSolicitud.toString().includes(fecha) &&
                    funeraria.toString().includes(funerariafiltro.toUpperCase()) &&
                    (datos.consecutivo === null ? '' : datos.consecutivo.toString().includes(idtramite)) &&
                    datos.noIdentificacionSolicitante.toString().includes(documento.toUpperCase())
                  );
                });
                setdatosUsuario(filteredDataUsuario);
              }


            }
            else {
              if (idtramite === '') {
                const filteredDataUsuario: any = data.filter((datos: any) => {
                  const funeraria: string = datos.razonSocialSolicitante.toUpperCase();
                  return (

                    funeraria.toString().includes(funerariafiltro.toUpperCase()) &&
                    datos.noIdentificacionSolicitante.toString().includes(documento.toUpperCase())
                  );
                });
                setdatosUsuario(filteredDataUsuario);
              }
              else {
                const filteredDataUsuario: any = data.filter((datos: any) => {
                  const funeraria: string = datos.razonSocialSolicitante.toUpperCase();
                  return (

                    funeraria.toString().includes(funerariafiltro.toUpperCase()) &&
                    (datos.consecutivo === null ? '' : datos.consecutivo.toString().includes(idtramite)) &&
                    datos.noIdentificacionSolicitante.toString().includes(documento.toUpperCase())
                  );
                });
                setdatosUsuario(filteredDataUsuario);
              }

            }
          }}
        />
      </Form.Item>
    );

  }
  const FilterByNameInputfuneraria = () => {

    return (

      <Input
        placeholder='Funeraria y/o Nombre'
        value={funerariafiltro}
        style={{ width: 200 }}
        onKeyPress={(event) => {
          if (!/[a-zA-Z0-9 ]/.test(event.key)) {
            event.preventDefault();
          }
        }}
        onChange={(e) => {
          const currValue: string = e.target.value;
          setfunerariafiltro(currValue);

          const filteredDataUsuario: any = data.filter((datos: any) => {

            const funeraria: string = datos.razonSocialSolicitante.toUpperCase();
            if (fechafiltro == null) {
              if (idtramite === '') {
                return (
                  funeraria.toString().includes(currValue.toUpperCase()) &&

                  datos.noIdentificacionFallecido.toString().includes(documento.toUpperCase())
                );
              }
              else {
                return (
                  funeraria.toString().includes(currValue.toUpperCase()) &&
                  (datos.consecutivo === null ? '' : datos.consecutivo.toString().includes(idtramite)) &&
                  datos.noIdentificacionFallecido.toString().includes(documento.toUpperCase())
                );
              }

            }
            else {
              if (idtramite === '') {
                return (
                  funeraria.toString().includes(currValue.toUpperCase()) &&
                  datos.fechaSolicitud.toString().includes(fechafiltro) &&
                  datos.noIdentificacionFallecido.toString().includes(documento.toUpperCase())
                );
              }
              else {
                return (
                  funeraria.toString().includes(currValue.toUpperCase()) &&
                  datos.fechaSolicitud.toString().includes(fechafiltro) &&
                  (datos.consecutivo === null ? '' : datos.consecutivo.toString().includes(idtramite)) &&
                  datos.noIdentificacionFallecido.toString().includes(documento.toUpperCase())
                );
              }

            }
          });
          setdatosUsuario(filteredDataUsuario);

        }}
      />

    );

  }
  const FilterByNameInputid = () => {

    return (

      <Input
        placeholder='Consecutivo'
        value={idtramite}
        style={{ width: 140 }}
        onKeyPress={(event) => {
          if (!/[0-9A-Za-z]/.test(event.key)) {
            event.preventDefault();
          }
        }}

        onChange={(e) => {
          const currValue: string = e.target.value;
          setidtramite(currValue.toUpperCase());

          const filteredDataUsuario: any = data.filter((datos: any) => {
            const funeraria: string = datos.razonSocialSolicitante.toUpperCase();
            if (fechafiltro === null || fechafiltro === undefined) {
              if (currValue === '') {

                return (
                  funeraria.toString().includes(funerariafiltro.toUpperCase()) &&
                  datos.noIdentificacionFallecido.toString().includes(documento.toUpperCase())
                );
              }
              else {

                return (
                  funeraria.toString().includes(funerariafiltro.toUpperCase()) &&
                  (datos.consecutivo === null ? '' : datos.consecutivo.toString().includes(currValue.toUpperCase())) &&
                  datos.noIdentificacionFallecido.toString().includes(documento.toUpperCase())
                );
              }


            }
            else {
              if (currValue === '') {

                return (
                  funeraria.toString().includes(funerariafiltro.toUpperCase()) &&
                  datos.fechaSolicitud.toString().includes(fechafiltro) &&
                  datos.noIdentificacionFallecido.toString().includes(documento.toUpperCase())
                );
              }
              else {

                return (
                  funeraria.toString().includes(funerariafiltro.toUpperCase()) &&
                  datos.fechaSolicitud.toString().includes(fechafiltro) &&
                  (datos.consecutivo === null ? '' : datos.consecutivo.toString().includes(currValue.toUpperCase())) &&
                  datos.noIdentificacionFallecido.toString().includes(documento.toUpperCase())
                );
              }

            }
          });
          setdatosUsuario(filteredDataUsuario);
        }}
      />

    );

  }
  const FilterByNameInputdocumento = () => {
    return (
      <Input
        placeholder='Documento del Fallecido'
        value={documento}
        style={{ width: 200 }}
        onKeyPress={(event) => {
          if (!/[a-zA-Z0-9 ]/.test(event.key)) {
            event.preventDefault();
          }
        }}
        onChange={(e) => {
          const currValue: string = e.target.value;
          setdocumento(currValue);
          const filteredDataUsuario: any = data.filter((datos: any) => {
            const funeraria: string = datos.razonSocialSolicitante.toUpperCase();
            if (fechafiltro === null || fechafiltro === undefined) {
              if (idtramite === '') {
                return (
                  funeraria.toString().includes(funerariafiltro.toUpperCase()) &&

                  datos.noIdentificacionFallecido.toString().includes(currValue.toUpperCase())
                );
              }
              else {
                return (
                  funeraria.toString().includes(funerariafiltro.toUpperCase()) &&
                  (datos.consecutivo === null ? '' : datos.consecutivo.toString().includes(idtramite)) &&
                  datos.noIdentificacionFallecido.toString().includes(currValue.toUpperCase())
                );
              }

            }
            else {
              if (idtramite === '') {
                return (
                  funeraria.toString().includes(funerariafiltro.toUpperCase()) &&
                  datos.fechaSolicitud.toString().includes(fechafiltro) &&
                  datos.noIdentificacionFallecido.toString().includes(currValue.toUpperCase())
                );
              }
              else {
                return (
                  funeraria.toString().includes(funerariafiltro.toUpperCase()) &&
                  datos.fechaSolicitud.toString().includes(fechafiltro) &&
                  (datos.consecutivo === null ? '' : datos.consecutivo.toString().includes(idtramite)) &&
                  datos.noIdentificacionFallecido.toString().includes(currValue.toUpperCase())
                );
              }

            }
          });
          setdatosUsuario(filteredDataUsuario);
        }}
      />
    );
  }




  let structureColumns: any = [];


  if (Validacion == '1') {
    if (Tipo.rol !== 'Ciudadano'
      //  && Tipo.rol !== 'AdminTI'
    ) {
      structureColumns = [
        {
          title: FilterByNameInputid(),
          dataIndex: 'consecutivo',
          key: 'consecutivo',
          defaultSortOrder: 'descend',
          sorter: {
            compare: (a: { consecutivo: string; }, b: { consecutivo: string; }) =>
              a.consecutivo > b.consecutivo ? 1 : -1,
            multiple: 3,
          }
        },
        {
          title: FilterByNameInputdocumento(),
          dataIndex: 'noIdentificacionFallecido',
          key: 'numeroDocumento',
          defaultSortOrder: 'descend',
          sorter: {
            compare: (a: { noIdentificacionFallecido: number; }, b: { noIdentificacionFallecido: number; }) =>
              a.noIdentificacionFallecido - b.noIdentificacionFallecido,
            multiple: 2,
          }
        },
        {
          title: FilterByNameInputfuneraria(),
          dataIndex: 'razonSocialSolicitante',
          key: 'nombreCompleto',

          sorter: {
            compare: (a: { razonSocialSolicitante: string; }, b: { razonSocialSolicitante: string; }) =>
              a.razonSocialSolicitante > b.razonSocialSolicitante ? 1 : -1,
            multiple: 1,
          }
        },
        {
          title: 'Institución Certifica',
          dataIndex: 'institucionCertifica',
          key: 'InstitucionCertifica',

          filters: [
            {
              text: 'Medicina Legal ',
              value: 'INSTITUTO NACIONAL DE MEDICINA LEGAL Y CIENCIAS FORENCES'
            },
            {
              text: 'Otros ',
              value: 'Otros'
            }
          ],
          filterSearch: true,
          onFilter: (value: string, record: { institucionCertifica: string }) => record.institucionCertifica.toString().includes(value),
        },

        {
          title: FilterByNameInputfecha(),
          dataIndex: 'fechaSolicitud',
          key: 'fechaSolicitud',
          with: 600,
          render: (Text: string) => (
            <Form.Item label='' name=''>
              <text>{Text.toString().substring(0, Text.toString().indexOf('T'))}</text>
            </Form.Item>
          )
        },
        {
          title: 'Estado Tramite',
          dataIndex: 'estadoString',
          key: 'estado',
          width: 230,
          filters: [
            {
              text: 'Anulado ',
              value: 'Anulado validador de documentos'
            },
            {
              text: 'Aprobado ',
              value: 'Aprobado validador de documentos'
            },
            {
              text: 'Documentos Inconsistentes',
              value: 'Documentos Inconsistentes'
            },
            {
              text: 'Negado ',
              value: 'Negado validador de documentos'
            }
            ,
            {
              text: 'En tramite ',
              value: 'Registro Usuario Externo'
            }
            ,
            {
              text: 'Cambio de Licencia',
              value: 'Cambio de Licencia'
            }
          ],
          filterSearch: true,
          onFilter: (value: string, record: { estadoString: string }) => record.estadoString.toString().includes(value),


          render: (Text: string) => {

            if (Text === 'Cambio de Licencia') {
              return (<Form.Item label='' name=''>
                <text>{'Cambio tipo de licencia'}</text>
              </Form.Item>)
            }
            else {
              if (Text === 'Registro Usuario Externo') {
                return (<Form.Item label='' name=''>
                  <text>{'En Tramite'}</text>
                </Form.Item>)
              }
              else {
                return (<Form.Item label='' name=''>
                  <text>{Text}</text>
                </Form.Item>)
              }

            }

          }
        },
        {
          title: 'Tipo Solicitud',
          dataIndex: 'idTramite',
          key: 'tipoSolicitud',
          width: 300,
          filters: [
            {
              text: 'Inhumación Individual',
              value: 'a289c362-e576-4962-962b-1c208afa0273'
            },
            {
              text: 'Inhumación Fetal',
              value: 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060'
            },
            {
              text: 'Cremación Individual',
              value: 'e69bda86-2572-45db-90dc-b40be14fe020'
            },
            {
              text: 'Cremación Fetal ',
              value: 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e'
            }
          ],
          filterSearch: true,
          onFilter: (value: string, record: { idTramite: string }) => record.idTramite.toString().includes(value),
          render: (Text: string) => {
            switch (Text) {
              case 'a289c362-e576-4962-962b-1c208afa0273':
                return <Form.Item label='' name=''>
                  <text>{'Inhumación Individual'}</text>
                </Form.Item>

              case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
                //inhumacion fetal
                return <Form.Item label='' name=''>
                  <text>{'Inhumación Fetal'}</text>
                </Form.Item>

              case 'e69bda86-2572-45db-90dc-b40be14fe020':
                //cremacion individual
                return <Form.Item label='' name=''>
                  <text>{'Cremación Individual'}</text>
                </Form.Item>

              case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
                //cremacionfetal
                return <Form.Item label='' name=''>
                  <text>{'Cremación Fetal '}</text>
                </Form.Item>


            }
          }
        },

        {
          title: 'Validar Tramite',
          key: 'Acciones',
          width: 200,
          render: (_: any, row: any, index: any) => {
            const [permiso] = roles;
            if (row.estadoString === 'Cambio de Licencia' || row.estadoString === 'Registro Usuario Externo') {
              return (<Form.Item label='' name=''>
                <Button
                  type='primary'
                  key={`vali-${index}`}
                  onClick={() => onClickValidarInformacion(row)}
                  style={{ marginLeft: '5px' }}
                  icon={<CheckOutlined />}
                >
                  Validar Información
                </Button>
              </Form.Item>)
            }
          }
        },
        {
          title: 'Visualizar PDF',
          key: 'Acciones',
          width: 200,
          render: (_: any, row: any, index: any) => {
            const [permiso] = roles;
            if (row.estadoString === 'Aprobado validador de documentos') {
              return (<Form.Item label='' name=''>
                <FilePdfOutlined
                  onClick={() => onClickVisualizarPDF(row)}
                  style={{ fontSize: '30px' }}
                />
              </Form.Item>)
            }
          }
        }
      ];
    } else {
      structureColumns = [
        {
          title: FilterByNameInputid(),
          dataIndex: 'consecutivo',
          key: 'consecutivo',
          defaultSortOrder: 'descend',
          sorter: {
            compare: (a: { consecutivo: string; }, b: { consecutivo: string; }) =>
              a.consecutivo > b.consecutivo ? 1 : -1,
            multiple: 3,
          }
        },
        {
          title: FilterByNameInputdocumento(),
          dataIndex: 'noIdentificacionFallecido',
          key: 'numeroDocumento',
          defaultSortOrder: 'descend',
          sorter: {
            compare: (a: { noIdentificacionFallecido: number; }, b: { noIdentificacionFallecido: number; }) =>
              a.noIdentificacionFallecido - b.noIdentificacionFallecido,
            multiple: 1,
          }
        },
        {
          title: FilterByNameInputfuneraria(),
          dataIndex: 'razonSocialSolicitante',
          key: 'nombreCompleto',
          sorter: {
            compare: (a: { razonSocialSolicitante: string; }, b: { razonSocialSolicitante: string; }) =>
              a.razonSocialSolicitante > b.razonSocialSolicitante ? 1 : -1,
            multiple: 1,
          }
        },
        {
          title: 'Institución Certifica',
          dataIndex: 'institucionCertifica',
          key: 'InstitucionCertifica',

          filters: [
            {
              text: 'Medicina Legal ',
              value: 'INSTITUTO NACIONAL DE MEDICINA LEGAL Y CIENCIAS FORENCES'
            },
            {
              text: 'Otros ',
              value: 'Otros'
            }
          ],
          filterSearch: true,
          onFilter: (value: string, record: { institucionCertifica: string }) => record.institucionCertifica.toString().includes(value),
        },
        {
          title: FilterByNameInputfecha(),
          dataIndex: 'fechaSolicitud',
          with: 600,
          key: 'fechaSolicitud'
        },
        {
          title: 'Estado Tramite',
          dataIndex: '',
          key: 'estado',
          width: 230,
          filters: [
            {
              text: 'Anulado ',
              value: 'Anulado validador de documentos'
            },
            {
              text: 'Aprobado ',
              value: 'Aprobado validador de documentos'
            },
            {
              text: 'Documentos Inconsistentes',
              value: 'Documentos Inconsistentes'
            },
            {
              text: 'Negado ',
              value: 'Negado validador de documentos'
            }
            ,
            {
              text: 'En tramite ',
              value: 'Registro Usuario Externo'
            }
            ,
            {
              text: 'En espera de aprobacion ',
              value: 'Cambio de Licencia'
            }
          ],
          filterSearch: true,

          onFilter: (value: string, record: { solicitud: string }) => record.solicitud.toString().includes(value),
          render: (row: any) => {
            if (row.solicitud == 'Registro Usuario Externo' || row.solicitud == 'Actualización Documentos') {
              return (<Form.Item label='' name=''>
                <text>{'En Tramite'}</text>
              </Form.Item>)
            }
            else {
              if (row.solicitud == 'Cambio de Licencia' || row.solicitud == 'Actualización Solicitud') {
                return (<Form.Item label='' name=''>
                  <text>{'En espera de aprobacion'}</text>
                </Form.Item>)
              }
              else {
                return (<Form.Item label='' name=''>
                  <text>{row.solicitud}</text>
                </Form.Item>)
              }
            }




          }
        },
        {
          title: 'Tipo Solicitud',
          dataIndex: 'tramite',
          key: 'tipoSolicitud',
          width: 300,
          filters: [
            {
              text: 'Inhumación Individual',
              value: 'Inhumación Individual'
            },
            {
              text: 'Inhumación Fetal',
              value: 'Inhumación Fetal'
            },
            {
              text: 'Cremación Individual',
              value: 'Cremación Individual'
            },
            {
              text: 'Cremación Fetal ',
              value: 'Cremación Fetal'
            }
          ],
          filterSearch: true,

          onFilter: (value: string, record: { tramite: string }) => record.tramite.toString().includes(value),
        },
        {
          title: 'Actualizar',
          key: 'Acciones',
          render: (_: any, row: any, index: any) => {
            if (row.solicitud === 'Documentos Inconsistentes') {
              return (
                <Button
                  type='primary'
                  style={{ marginLeft: '5px' }}
                  icon={<CheckOutlined />}
                  onClick={() => onGestionarDocumento(row)}
                >
                  Gestionar
                </Button>
              );
            } else {
              if (row.solicitud === 'Aprobado validador de documentos' &&
                (row.tramite === 'Cremación Individual' || row.tramite === 'Inhumación Individual')) {
                return (
                  <Button
                    type='primary'
                    disabled={row.cambiolicencia < 4 ? false : true}
                    style={{ marginLeft: '5px', height: 60 }}
                    onClick={() => onClickCambiarLicencia(row)}
                  >
                    <text>{`Cambio de licencia a`}
                    </text>
                    <br />
                    <text>{`
                    ${row.tramite === 'Cremación Individual' ? 'Inhumación Individual' :
                        'Cremación Individual'} `}</text>
                  </Button>
                );
              } else {
                if (row.solicitud === 'Aprobado validador de documentos' &&
                  (row.tramite === 'Cremación Fetal' || row.tramite === 'Inhumación Fetal')) {
                  return (
                    <Button
                      type='primary'
                      disabled={row.cambiolicencia < 4 ? false : true}
                      style={{ marginLeft: '5px', height: 60 }}
                      onClick={() => onClickCambiarLicencia(row)}
                    >
                      <text>{`Cambio de licencia a`}
                      </text>
                      <br />
                      <text>{`
                    ${row.tramite === 'Cremación Fetal' ? 'Inhumación Fetal' :
                          'Cremación Fetal'} `}</text>
                    </Button>
                  );
                }
                else {
                  return null;
                }

              }
            }
          }
        },
        {
          title: 'Recurso de Aclaración',
          key: 'Recurso',
          render: (_: any, row: any, index: any) => {
            if (row.solicitud === 'Aprobado validador de documentos') {
              return (
                <Button
                  type='primary'
                  disabled={row.modificacion < 4 ? false : true}
                  style={{ marginLeft: '5px', height: 60 }}
                  onClick={() => onClickModificarSolicitud(row)}
                >
                  <text>{`Actualizar Datos`}
                  </text>
                </Button>
              );
            } else {
              return null;

            }
          }
        }
      ];
    }
  }

  let tramite = 'En tramite';

  async function onClickVisualizarPDF(row: any): Promise<void> {

    const solicitud = await api.getLicencia(row.idSolicitud);
    const resumenSolicitud = await api.GetResumenSolicitud(row.idSolicitud);

    const idContenedor = solicitud[0]['idTramite'];

    let contenedor: string = '';

    let valor: string = '';

    switch (valor) {
      case 'Inhumación Individual':
        contenedor = 'inhumacionindividual';
        break;
      case 'Inhumación Fetal':
        contenedor = 'inhumacionfetal';
        break;
      case 'Cremación Individual':
        contenedor = 'cremacionindividual';
        break;
      case 'Cremación Fetal ':
        contenedor = 'cremacionfetal';
        break;
    }

    switch (idContenedor) {
      case 'a289c362-e576-4962-962b-1c208afa0273':
        contenedor = 'inhumacionindividual';
        valor = 'Inhumación Individual';
        break;
      case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
        contenedor = 'inhumacionfetal';
        valor = 'Inhumación Fetal';
        break;
      case 'e69bda86-2572-45db-90dc-b40be14fe020':
        contenedor = 'cremacionindividual';
        valor = 'Cremación Individual';
        break;
      case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
        contenedor = 'cremacionfetal';
        valor = 'Cremación Fetal';
        break;
    }

    const oid = solicitud[0]['idUsuarioSeguridad'];

    const nameBlob = 'LICENCIA_' + valor.replace(' ', '_').toLocaleUpperCase() + '_' + 'N°' + resumenSolicitud[0]['numeroLicencia'];

    const path = contenedor + "/" + oid + "/" + nameBlob;

    const urlPDF = await api.GetUrlPdf(path);

    setUrlPdfLicence(urlPDF);

    setIsModalVisiblePdf(true);
  }

  const onClickValidarInformacion = async ({ idSolicitud }: { [x: string]: string }) => {
    const data = await api.getLicencia(idSolicitud);

    localStorage.setItem('register', JSON.stringify(data));
    store.dispatch(SetResetViewLicence());
    history.push('/tramites-servicios/licencia/gestion-inhumacion');
  };

  const onClickCambiarLicencia = async (fila: any) => {
    const data = await api.getLicencia(fila.idSolicitud);

    localStorage.setItem('register', JSON.stringify(data));
    store.dispatch(SetResetViewLicence());
    if (fila.idTramite == 'a289c362-e576-4962-962b-1c208afa0273' || fila.idTramite == 'e69bda86-2572-45db-90dc-b40be14fe020') {
      history.push('/modificar/Cambiar-Tipo-Licencia-Individual');
    }
    else {
      history.push('/modificar/Cambiar-Tipo-Licencia-Fetal');
    }

  };

  const onClickModificarSolicitud = async (fila: any) => {
    const data = await api.getLicencia(fila.idSolicitud);

    localStorage.setItem('register', JSON.stringify(data));
    store.dispatch(SetResetViewLicence());


    if (fila.idTramite == 'a289c362-e576-4962-962b-1c208afa0273' || fila.idTramite == 'e69bda86-2572-45db-90dc-b40be14fe020') {

      history.push('/modificar/Actualizar-Datos-Individual');
    }
    else {

      history.push('/modificar/Actualizar-Datos-Fetal');
    }

  };




  const getNamesAndBlobForm = (values: any, tipoSolitudIN: string) => {
    let { CD, DM, OD, ANFI, DFALL, ACF, DFAMI, AFC, OML } = values;
    const Objs = [];

    /*if (tipoSolitudIN == 'Cremacion Fetal' || tipoSolitudIN == 'Inhumacion Fetal') {
      DFALL = DM;
    }*/

    Objs.push({ file: CD, name: 'Certificado_Defuncion' });
    Objs.push({ file: DM, name: 'Documento_de_la_Madre' });
    Objs.push({ file: OD, name: 'Otros_Documentos' });
    Objs.push({ file: ANFI, name: 'Acta_Notarial_del_Fiscal' });
    Objs.push({ file: DFALL, name: 'Documento_del_fallecido' });
    Objs.push({ file: ACF, name: 'Autorizacion_de_cremacion_del_familiar' });
    Objs.push({ file: DFAMI, name: 'Documento_del_familiar' });
    Objs.push({ file: AFC, name: 'Autorizacion_del_fiscal_para_cremar' });
    Objs.push({ file: OML, name: 'Oficio_de_medicina_legal_al_fiscal_para_cremar' });

    const filesLoaded = Objs.filter((item: { file: any; name: string }) => item.file !== undefined);
    const files: Blob[] = filesLoaded.map((item) => {
      const [file] = item.file;
      return file.originFileObj;
    });
    const names: string[] = filesLoaded.map((item) => item.name);

    return [files, names];
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  /** Evento que se ejecuta cuando se da click en el boton de gestionar */
  const onGestionarDocumento = async (solicitud: Solicitud) => {



    const resultResponse: Array<Document> = await api.getDocumentosRechazados(solicitud.idSolicitud);

    setfechasolicitud(solicitud.fechaSolicitud);
    setObservacion(resultResponse[0].observaciones);
    setTipoSolicitud(solicitud.tramite);
    setListadoDocumento(resultResponse);
    setVisibleDocumentoGestion(true);
  };

  /** Evento que se ejecuta cuando se da click en guardar los cambios */
  const SubmitDocuments = async (form: any, dataComponentUpdate: DataComponentUpdate) => {
    const { tipoSolicitud, listDocument } = dataComponentUpdate;
    const [accountIdentifierSession] = listDocument[0].path.split('/');
    const formData = new FormData();
    let container = null;

    /**De acuerdo al tipo de solicitud se asigna el nombre del contenedor de Azure Storage Blob
     * al que se debe enviar los archivos
     */
    switch (tipoSolicitud) {
      case 'Inhumación Individual':
        container = 'inhumacionindividual';
        break;
      case 'Cremación Individual':
        container = 'cremacionindividual';
        break;
      case 'Cremación Fetal':
        container = 'cremacionfetal';
        break;
      case 'Inhumación Fetal':
        container = 'inhumacionfetal';
        break;
    }

    /** Se verifica que se encontró un contenedor donde almacenar los documentos */
    if (container) {
      formData.append('containerName', container);
      formData.append('oid', accountIdentifierSession);

      const [files, names] = getNamesAndBlobForm(form, tipoSolicitud);
      const supportDocumentsEdit: any[] = [];

      /** Se itera por cada archivo subido por el cliente y se hace mapeo entre el blob y el nombre
       *  que debe tener el archivo
       */
      files.forEach((item: any, i: number) => {
        const name: string = names[i] + '';
        for (let j = 0; j < listDocument.length; j++) {
          if (listDocument[j].path.includes(name)) {
            const [, nameFile] = listDocument[j].path.split('/');
            formData.append('file', item);
            formData.append('nameFile', nameFile);

            supportDocumentsEdit.push({
              idSolicitud: listDocument[j].idSolicitud,
              idDocumentoSoporte: listDocument[j].idDocumentoSoporte,
              fechaModificacion: new Date(),
              esValido: true
            });
          }
        }
      });

      /** Verifica que hay archivos ha subir  y a su vez sirve para validar que se agregue la meta data a cada
       *  uno de los archivos y se mandan a base de datos
       * */
      if (supportDocumentsEdit.length) {
        await api.uploadFiles(formData);
        await api.UpdateSupportDocuments(supportDocumentsEdit);
        await api.updateStateRequest(listDocument[0].idSolicitud, 'C5F3301A-4DBA-463F-8459-EB32C78E7420');

        const idUsuario = await api.getIdUsuario();

        const seguimiento = {
          fechaRegistro: fechasolicitud,
          usuario: idUsuario,
          estado: '00000000-0000-0000-0000-000000000000',
          idSolicitud: listDocument[0].idSolicitud,
          observacion: 'subsanacion documentos inconsistentes'

        }
        await api.addSeguimiento(seguimiento);
        await infoMessage({ title: "Actualización de Documentos Inconsistentes", content: "Los documentos fueron actualizados correctamente" });
        window.location.reload();
      } else {
        console.error("No se cargaron correctamente los archivos a actualizar");
        errorMessage({ title: "Actualización de Documentos Inconsistentes", content: "No se pudo actualizar los archivos. Por favor contactar a soporte técnico" });
      }
    } else {
      console.error("No se encontró un contenedor donde subir los archivos");
      errorMessage({ title: "Actualización de Documentos Inconsistentes", content: "No se pudo actualizar los archivos. Por favor contactar a soporte técnico" });
    }
  };

  /** Componente de función que se usa para la gestionar la actualización de documentos inconsistente*/
  function ComponentUpdateDocument(props: DataComponentUpdate) {
    function GUIDtoString(cadena: string) {
      switch (cadena) {
        /** GUID que corresponde a Certificado de defunción */
        case '19a11490-261c-4114-9152-23c2b991cb36':
          return 'CD';

        /** GUID que corresponde al Documento de la madre */
        case 'd2d3aba7-3b92-446a-aa8c-80a75de246a7':
          return 'DM';

        /** GUID que corresponde a Otros Documentos */
        case 'abe33c1d-9370-4189-9e81-597e5b643481':
          return 'OD';

        /** GUID que corresponde al Acta Notarial del Fiscal */
        case '79320af6-943c-43bf-87d1-847b625f6203':
          return 'ANFI';

        /** GUID que corresponde al Documento del fallecido */
        case '9c4e62a4-ee76-4ba1-8dbe-8be172e23788':
          return 'DFALL';

        /** GUID que corresponde a Autorización de Cremación del familiar */
        case 'f67f1c4e-a6a5-4257-a995-17a926801f7c':
          return 'ACF';

        /** GUID que corresponde al Documento del familiar */
        case 'd6524742-e32d-4548-ab21-7a9cbb367926':
          return 'DFAMI';

        /** GUID que corresponde a Autorización del fiscal para cremar */
        case 'c659a063-e8a3-4f23-9a61-575afb1e1c2b':
          return 'AFC';

        /** GUID que corresponde a Oficio de Medicinal Legal al fiscal para cremar */
        case '1266f06c-0bc1-4cf8-ba51-5e889d5e8178':
          return 'OML';
      }
      return 'default';
    }

    return (
      <Form layout='horizontal' onFinish={(form) => SubmitDocuments(form, props)}>
        {props.listDocument.map((item) => {
          return (
            <Form.Item
              label={item.tipo_documento}
              name={GUIDtoString(item.idTipoDocumento)}
              valuePropName='fileList'
              getValueFromEvent={normFile}
            >
              <Upload
                name={GUIDtoString(item.idTipoDocumento)}
                maxCount={1}
                beforeUpload={() => false}
                listType='text'
                accept='application/pdf'
                className='float-right'
              >
                <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
              </Upload>
            </Form.Item>
          );
        })}

        <Button style={{ margin: 10 }} type='primary' htmlType='submit' onClick={() => setVisibleDocumentoGestion(false)}>
          Guardar
        </Button>
      </Form>
    );
  }



  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body'>
          <div className='row'>
            <div className='col-lg-12 col-sm-12 col-md-12'>

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

              <Table
                id='tableGen'
                dataSource={datosUsuario}
                columns={structureColumns}
                scroll={{ x: 1200 }}
                pagination={{ pageSize: Paginas }}
              />
            </div>
          </div>
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
                <div className='col-gl-12 col-sm-12 col-md-12'>
                  <label>Observaciones:</label>
                  <Input.TextArea defaultValue='default' value={observacion} rows={5} disabled={true} />
                </div>
              </div>
              <div className='row  justify-content-md-center'>
                <label className='mt-3'>Lista de documentos:</label>
                <div className='col-lg-12 col-sm-12 col-md-12 float-right'>
                  <ComponentUpdateDocument listDocument={listadoDocumento} tipoSolicitud={tipoSolicitud} />
                </div>
              </div>
            </Modal>
          </div>
        </div>



      </div>
    </div>
  );
};

interface Solicitud {
  estadoSolicitud: string;
  fechaSolicitud: string;
  iD_Control_Tramite: string;
  idSolicitud: string;
  noIdentificacionSolicitante: string;
  NroIdquienhizolasolicitud: string;
  numeroCertificado: string;
  razonSocialSolicitante: string;
  solicitud: string;
  tramite: string;
}

interface Document {
  idTipoDocumento: string;
  estado_Documento: string;
  fecha_registro: string;
  fecha_ultima_modificacion: string;
  idDocumentoSoporte: string;
  idEstadoDocumento: string;
  idSolicitud: string;
  observaciones: string;
  path: string;
  tipoSeguimiento: string;
  tipoSeguimientoDescripcion: string;
  tipo_documento: string;
}

interface DataComponentUpdate {
  tipoSolicitud: string;
  listDocument: Array<Document>;
}

interface IDataSource {
  data: Array<any>;
}

