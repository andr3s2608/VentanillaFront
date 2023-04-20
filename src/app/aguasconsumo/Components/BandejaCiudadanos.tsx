import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { layoutItems } from 'app/shared/utils/form-layout.util';
import { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import { CheckOutlined, FilePdfOutlined } from '@ant-design/icons';
import { Form, Input, Button, Modal } from 'antd';
import { useHistory } from 'react-router';
import '../../../css/estilos.css';
import Table from 'antd/es/table';
import Swal from 'sweetalert2';
import moment from 'moment';
import documentoNoEncontrado from '../../../assets/images/aguas/documentoNoEncontrado.jpg';


export const BandejaCiudadanos = (props: IDataSource) => {
  const history = useHistory();
  const { data, datossolucionados } = props;
  const Paginas: number = 5;
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();
  const [dataInter, setDataInter] = useState<any[]>([]);
  const [dataSolucionado, setDataSolucionado] = useState<any[]>([]);
  const [dateSelectedInicial, setDateIni] = useState<Date>();
  const [dateSelectedFinal, setDateFin] = useState<Date>();
  const [value, setValue] = useState('');
  const [isModalVisiblePdf, setIsModalVisiblePdf] = useState(false);
  const [urlPdfLicence, setUrlPdfLicence] = useState<any>('');


  const getListas = useCallback(
    async () => {

      setDataInter(data);
      setDataSolucionado(datossolucionados);
    },
    []
  );

  useEffect(() => {
    getListas();
  }, []);

  function onClickFiltrar(datos: String) {

    let datossinfiltrar = false;

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
            f.consecutivo.toString().includes(value) &&
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
            f.consecutivo.toString().includes(value) &&
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
    const data = await api.getSolicitudbyidAguas(datos.idSolicitud);
    localStorage.setItem('register', JSON.stringify(data));
    if (tipo == 'tramite') {
      localStorage.setItem('subsanacion', 'true');
      history.push('/tramites-servicios-aguas/Revision/Crear-Solicitud');
    } else {
      history.push('/tramites-servicios-aguas/Revision/visita-revision');
    }

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
        placeholder='Consecutivo'
        style={{ width: 200, marginTop: 4, marginRight: 4 }}
        value={value}
        onChange={(e) => {
          const currValue: string = e.target.value;
          setValue(currValue);
          const filteredData: any = data.filter((datos: any) => {
            if (fecha) {
              return (
                datos.consecutivo.toString().includes(currValue) &&
                (new Date(datos.fechaSolicitud) >= fechain && new Date(datos.fechaSolicitud) < fechafin)
              );

            }
            else {
              return datos.consecutivo.toString().includes(currValue);
            }
          });
          setDataInter(filteredData);

          const filteredData2: any = datossolucionados.filter((datos: any) => {
            if (fecha) {
              return (
                datos.consecutivo.toString().includes(currValue) &&
                (new Date(datos.fechaSolicitud) >= fechain && new Date(datos.fechaSolicitud) < fechafin)
              );

            }
            else {
              return datos.consecutivo.toString().includes(currValue);
            }

          });

          setDataSolucionado(filteredData2);

        }}
      />
    );
  };
  //comentario para actualizar bandejas


  let structureColumns: any[] = [];

  structureColumns = [
    {
      title: FilterByNameInput(),
      dataIndex: 'consecutivo',
      key: 'consecutivo',
      width: 200,
      sorter: {
        compare: (a: { consecutivo: number; }, b: { consecutivo: number; }) => a.consecutivo - b.consecutivo,
        multiple: 1,
      },
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
      }
    },
    {
      title: 'Fecha de Registro',
      dataIndex: 'fechaSolicitud',
      key: 'fechaSolicitud',
      width: 230,
    },
    {
      title: 'Estado ',
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
              {row.tipodeSolicitud === 'Subsanacion' && (
                <Button
                  type='primary'
                  key={`vali`}
                  onClick={() => onClickValidarInformacion(row, 'tramite')}
                  style={{ marginRight: '8px' }}
                  icon={<CheckOutlined />}
                >
                  Subsanar Solicitud
                </Button>
              )}
              <br></br>
              {row.tipodeSolicitud == 'Visita de Revision' && (
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
          )
        }



      }
    }
  ];


  return (
    <div className='container-fluid'>
      <div className='card main' id="principal_card">
        <div className='card-body tarjeta card_tarjeta h-100'>
          <Form form={form} {...layoutItems} layout='horizontal'>
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

            <section className='inbox'>
              <div className='container'>
                <div className='row'>
                  <div className='col-md-3 col-sm-12 col-lg-3 prueba'>
                    <div id='accordion' className='mt-3'>
                      <div className='card' id="card_content">
                        <div className='card-header' id='heading-2'>
                          <h5 className='mb-0'>
                            <a
                              className='bandeja '
                              role='button'
                              data-toggle='collapse'
                              href='#collapse-2'
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
                    <div
                      id='collapse-2'
                    >
                      <ul className='nav nav-tabs' role='tablist'>
                        <li className='nav-item encabezados'>
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
                        <li className='nav-item encabezados'>
                          <a className='nav-link' data-toggle='tab' onClick={() => resetdata()}
                            href='#tabs-2' role='tab' style={{ borderTop: '3px solid orange' }}>
                            Solucionados
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
