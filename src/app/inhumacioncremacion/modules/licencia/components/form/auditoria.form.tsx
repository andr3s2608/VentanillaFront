import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';

// Componentes

import { ApiService } from 'app/services/Apis.service';
import documentoNoEncontrado from '../../../../../../assets/images/inhumacioncremacion/documentoNoEncontrado.jpg';


import { authProvider } from 'app/shared/utils/authprovider.util';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import Swal from 'sweetalert2';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import Button from 'antd/es/button';
import { SetResetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';

//Redux
import { store } from 'app/redux/app.reducers';
import { CheckOutlined, FilePdfOutlined, UploadOutlined } from '@ant-design/icons';
import { Input, Modal, Radio, Switch, Table, Upload } from 'antd';
import moment from 'moment';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { InformacionDocumentosGestion } from './seccions/documentos-gestion.seccion';

export const Auditoria = () => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [form] = Form.useForm<any>();

  const [valores, setvalores] = useState<string>('consecutivo');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleDocumentos, setIsModalVisibleDocumentos] = useState(false);

  const [objdocumento, setobjdocumento] = useState<any>();
  const [dataTable, setDataTable] = useState<[]>();

  const [licencia, setLicencia] = useState<boolean>(false);


  const [isModalVisiblePdf, setIsModalVisiblePdf] = useState(false);
  const [urlPdfLicence, setUrlPdfLicence] = useState<any>('');

  const [fechafiltro, setfechafiltro] = useState<any>();

  const [datosUsuario, setdatosUsuario] = useState<any>([]);
  const [data, setdata] = useState<any>([]);


  ///////////////

  const { setStatus } = useStepperForm<any>(form);

  const getListas = useCallback(async () => {

  }, []);

  useEffect(() => {
    getListas();
  }, []);

  const BuscarSolicitud = async () => {
    const numero: string = form.getFieldValue('numero');
    const listaauditoria: any = await api.Auditoria(numero, valores);

    setdata(listaauditoria);
    setdatosUsuario(listaauditoria);
    setUrlPdfLicence('');
    setLicencia(true);
  }



  const onClickSeguimiento = async (solicitud: any) => {
    //const solicitante = await api.GetResumenSolicitud(idSolicitud);

    const seguimiento: any = await api.getSeguimientoporSolicitud(solicitud.idSolicitud);


    const strAscending: any = [...seguimiento].sort((a, b) =>
      a.fechaActualizacion > b.fechaActualizacion ? 1 : -1,
    )

    setDataTable(strAscending);
    showModal();
  };


  const onClickDocumentosAsociados = async (solicitud: any) => {
    //const solicitante = await api.GetResumenSolicitud(idSolicitud);

    setobjdocumento({ idSolicitud: solicitud.idSolicitud, idTramite: solicitud.idTramite })

    showModalDocumentos();
  };

  const getDataDocumentos = () => {
  };
  const onSubmit = async (values: any) => {
  };



  const onSubmitFailed = () => {
    setStatus('error');
    store.dispatch(SetResetViewLicence());
  };




  const FilterByNameInputfecha = () => {

    return (
      <Form.Item style={{ width: 300, marginTop: 4, marginRight: 4 }} initialValue={fechafiltro}>
        <DatepickerComponent
          id='datePicker1'
          picker='date'
          placeholder='Fecha de Licencia'
          dateDisabledType='default'
          dateFormatType='default'
          className='form-control'
          onChange={(e) => {

            setfechafiltro(e);
            if (e != null) {
              let fecha: any = '';
              fecha = moment(e).format('YYYY-MM-DD');
              setfechafiltro(fecha);

              const filteredDataUsuario: any = data.filter((datos: any) => {

                return (
                  datos.fechaSolicitud.toString().includes(fecha)
                );
              });
              setdatosUsuario(filteredDataUsuario);

            }
            else {
              setdatosUsuario(data);
            }
          }}
        />
      </Form.Item>
    );
  }

  async function onClickVisualizarPDF(row: any): Promise<void> {
    try {
      //const solicitud = await api.getLicencia(row.idSolicitud);
      //const resumenSolicitud = await api.GetResumenSolicitud(row.idSolicitud);

      const idContenedor = row.idTramite;

      let contenedor: string = '';

      let valor: string = '';

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

      const oid = row.idUsuarioSeguridad;

      const nameBlob = 'LICENCIA_' + valor.replace(' ', '_').toLocaleUpperCase() + '_' + 'N°' + row.numeroLicencia;

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
            'El documento que intenta visualizar no se encuentra. Por favor comuníquese con el area de soporte para informar el caso y vuelva a intentarlo mas tarde.'
        });
      }

    } catch (error) {
      Swal.fire({
        imageUrl: documentoNoEncontrado,
        imageHeight: 150,
        title: 'DOCUMENTO NO ENCONTRADO',
        confirmButtonColor: '#b6e5ef',
        text:
          'El documento que intenta visualizar no se encuentra. Por favor comuníquese con el area de soporte para informar el caso y vuelva a intentarlo mas tarde.'
      });
    }

  }
  let structureColumns: any = [];
  structureColumns = [

    {
      title: 'Segumiento',
      key: 'seguimiento',
      render: (_: any, row: any, index: any) => {
        return (
          <Button
            type='primary'
            style={{ marginLeft: '5px' }}
            icon={<CheckOutlined />}
            onClick={() => onClickSeguimiento(row)}
          >
            Ver seguimiento
          </Button>
        );

      }
    },
    {
      title: 'Documentos Asociados',
      key: 'documentos',
      render: (_: any, row: any, index: any) => {
        return (
          <Button
            type='primary'
            style={{ marginLeft: '5px' }}
            icon={<CheckOutlined />}
            onClick={() => onClickDocumentosAsociados(row)}
          >
            Ver Documentos
          </Button>
        );

      }
    },
    {
      title: 'Visualizar PDF',
      key: 'visualizar',
      width: 200,
      render: (_: any, row: any, index: any) => {

        if (row.numeroLicencia !== '') {
          return (<Form.Item label='' name=''>
            <FilePdfOutlined
              onClick={() => onClickVisualizarPDF(row)}
              style={{ fontSize: '30px' }}
            />
          </Form.Item>)
        }
      }
    },
    {
      title: 'Consecutivo de Tramite',
      dataIndex: 'consecutivo',
      key: 'consecutivo',
      width: 300,

    },
    {
      title: FilterByNameInputfecha(),
      dataIndex: 'fechaSolicitud',
      width: 200,
      key: 'fechaSolicitud',
      render: (Text: any) => (
        <Form.Item label='' name=''>
          <text>{moment(Text.toString().substring(0, Text.toString().indexOf(' '))).format('DD-MM-YYYY')}</text>
        </Form.Item>
      )
    },
    {
      title: 'Numero de Licencia',
      dataIndex: 'numeroLicencia',
      width: 200,
      key: 'numeroLicencia'

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
            return (<Form.Item label='' name=''>
              <text>{'Inhumación Individual'}</text>
            </Form.Item>)
            break;
          case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
            return (<Form.Item label='' name=''>
              <text>{'Inhumación Fetal'}</text>
            </Form.Item>)
            break;
          case 'e69bda86-2572-45db-90dc-b40be14fe020':
            return (<Form.Item label='' name=''>
              <text>{'Cremación Individual'}</text>
            </Form.Item>)
            break;
          case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
            return (<Form.Item label='' name=''>
              <text>{'Cremación Fetal'}</text>
            </Form.Item>)
            break;
        }

      }

    },
    {
      title: 'Estado Tramite',
      dataIndex: 'estado',
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
          text: 'Negado ',
          value: 'Negado validador de documentos'
        },
        {
          text: 'En tramite ',
          value: 'Registro Usuario Externo'
        },
        {
          text: 'Documentos Inconsistentes',
          value: 'Documentos Inconsistentes'
        },
        {
          text: 'Cambio de Licencia',
          value: 'Cambio de Licencia'
        },

        {
          text: 'Actualización de Documentos',
          value: 'Actualización Documentos'
        },
        {
          text: 'Actualización de Datos',
          value: 'Actualización Solicitud'
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
    }
  ];


  const columnFake = [

    {
      title: 'Fecha de Solicitud',
      dataIndex: 'fechaRegistro',
      key: 'fechaRegistro',
      render: (Text: any) => {
        const fecha: Date = new Date(Text)
        const horas: number = fecha.getHours() - 5;
        fecha.setHours(horas)
        const fechaparseada = moment(fecha).format('DD-MM-YYYY HH:mm');
        return (<Form.Item label='' name=''>
          <text>{fechaparseada.toString()}</text>
        </Form.Item>)
      }

    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado'
    },
    {
      title: 'Observación',
      dataIndex: 'observacion',
      key: 'Observacion'
    },
    {
      title: 'Fecha de Actualización',
      dataIndex: 'fechaActualizacion',
      key: 'FechaActualizacion',
      render: (Text: any) => {
        const fecha: Date = new Date(Text)
        const horas: number = fecha.getHours() - 5;
        fecha.setHours(horas)
        const fechaparseada = moment(fecha).format('DD-MM-YYYY HH:mm');
        return (<Form.Item label='' name=''>
          <text>{fechaparseada.toString()}</text>
        </Form.Item>)
      }
    },
    {
      title: 'Nombre Completo',
      dataIndex: 'usuarioName',
      key: 'usuarioName'
    }
  ];

  const showModalDocumentos = () => {
    setIsModalVisibleDocumentos(true);
  };

  const handleCancelDocumentos = () => {
    setIsModalVisibleDocumentos(false);
  };


  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const changeRadioButton = (values: any) => {
    setvalores(values.target.value);
    form.resetFields(['numero']);
  };

  return (
    <div className='container-fluid'>
      <div className='card'>
        <div className='card-body'>
          <Form form={form} {...layoutItems} layout='horizontal' onFinish={onSubmit} onFinishFailed={onSubmitFailed}>
            <div className='row justify-content-center'>
              <div className='col-lg-12 col-sm-12 col-md-12 justify-content-center text-center'>
                <p
                  style={{ fontSize: '16px', color: '#3366cc', fontFamily: ' Roboto' }}
                  className='text-uppercase font-weight-bold'
                >
                  Seguimiento de Solicitudes
                </p>
              </div>
            </div>

            <div className='row mt-3 justify-content-center text-center'>
              <div className='col-lg-12 col-sm-12 col-md-12'>
                <p style={{ fontSize: '16px', color: '#000', fontFamily: ' Roboto' }}>Buscar por:</p>
                <Radio.Group onChange={changeRadioButton} defaultValue={'consecutivo'}>
                  <Radio value='consecutivo'>Consecutivo de tramite</Radio>
                  <Radio value='licencia'>Número de Licencia</Radio>
                  <Radio value='id'>Número de Identificación</Radio>
                </Radio.Group>
              </div>
            </div>

            <div className='row mt-5 mr-5 justify-content-center'>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <Form.Item label='Número' name='numero'>
                  <Input
                    allowClear
                    placeholder='Número'
                    autoComplete='off'
                    onKeyPress={(event) => {
                      if (valores === 'consecutivo') {
                        if (!/[0-9A-Za-z]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }
                      else {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }

                    }}
                  />
                </Form.Item>
              </div>
            </div>

            <div className='row ml-5'>
              <div className='col-lg-12 col-sm-12 col-md-12 text-center'>
                <Button type='primary' onClick={BuscarSolicitud}>
                  Buscar Solicitud
                </Button>
              </div>
            </div>






            {licencia && (
              <>
                <div className='row'>
                  <div className='col-lg-12 col-sm-12 col-md-12'>
                    <Table
                      id='tableGen'
                      dataSource={datosUsuario}
                      size='middle'
                      columns={structureColumns}
                      scroll={{ x: 1200 }}
                      pagination={{ pageSize: 10 }}
                    />
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

                <Modal
                  title={
                    <p className='text-center text-dark text-uppercase mb-0 titulo'>
                      Documentos Asociados
                    </p>
                  }
                  visible={isModalVisibleDocumentos}
                  onCancel={handleCancelDocumentos}
                  width={1500}
                  okButtonProps={{ hidden: true }}
                  cancelText='Cerrar'
                >
                  <InformacionDocumentosGestion prop={getDataDocumentos} obj={objdocumento} id={'No Aplica'} escambio={'actualizacion'}
                    instType={'otros'} reconocido={false} tramite={'No Aplica'} />

                </Modal>
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
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};
