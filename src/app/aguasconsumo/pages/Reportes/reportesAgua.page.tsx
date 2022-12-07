// Antd
import { Form, Grid, Radio } from 'antd';
import Tabs from 'antd/es/tabs';

import { IRoles } from 'app/inhumacioncremacion/Models/IRoles';
import { ApiService } from 'app/services/Apis.service';
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { TablaReportes } from '../Reportes/tablaReportes';
import React, { useCallback, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import moment from 'moment';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import Input from 'antd/es/input/Input';
import Button from 'antd/es/button/button';
import Swal from 'sweetalert2';
import { formatTimeStr } from 'antd/lib/statistic/utils';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { layoutWrapper } from 'app/shared/utils/form-layout.util';
const { TabPane } = Tabs;

const GridTipoLicenciaReportes: React.FC<any> = (props: any) => {
  const [grid, setGrid] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [selectedOption, setSelectedOption] = useState<String>();
  const [selectedOptionEstado, setSelectedOptionEstado] = useState<String>();
  const [visibleGrid, setVisibleGrid] = useState<String>();
  const [visiblePicker, setVisiblePicker] = useState<String>();
  const [busquedaseleccionada, setbusquedaseleccionada] = useState<String>('solicitud');
  const [dateSelectedInicial, setDateIni] = useState<Date>();
  const [dateSelectedFinal, setDateFin] = useState<Date>();


  const [FilterTextID, setFilterTextID] = useState<String>();
  const [FilterTextDoc, setChangeFilterDoc] = useState<String>();
  const [FilterTextFun, setChangeFilterFun] = useState<String>();
  const [disableFilter, setDisableFilter] = useState<Boolean>();
  const [textAlerta, setTextAlert] = useState<String>();
  const [visibleAlerta, setVisibleAlert] = useState<Boolean>();
  const getListas = useCallback(
    async () => {
      setVisibleGrid('none');

      setVisiblePicker('none');
      setVisibleAlert(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    setDisableFilter(true);
    setSelectedOption('todos');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectChange = (event: any) => {
    const value = event;
    setSelectedOption(value);
  };

  const selectChangeEstado = (event: any) => {
    const value = event;
    setSelectedOptionEstado(value);
  };

  function onChangefecha(values: any) {
    setbusquedaseleccionada(values.target.value)
  }
  function onChangeFilterID(event: any) {
    setFilterTextID(event.target.value);
  }
  function onChangeFilterDoc(event: any) {
    setChangeFilterDoc(event.target.value);
  }
  function onChangeFilterFun(event: any) {
    setChangeFilterFun(event.target.value);
  }

  function downloadFileExcel() {


    // FALTA AGREGAR LOS NUEVOS CAMPOS DE LA GRILLA AL DOCUMENTO QUE SE VA A DESCARGAR

    const ExportJsonExcel = require('js-export-excel');
    var datos = grid;
    let datatable = [];
    let opciones = {};
    if (datos && datos.length > 0) {
      for (let i in datos) {

        let ob = {
          'Numero de Radicado': datos[i].numeroRadicado,
          'Tipo Identificacion': datos[i].tipoIdentificacion,
          'Nombre persona Natural': datos[i].nombre,
          'Persona juridica razon social': datos[i].RazonSocial,
          'Tipo de documento': datos[i].TipoDocumentoRazon,
          'Numero de documento': datos[i].NumeroIdentificacion,
          'RUT': datos[i].Rut,
          'NIT': datos[i].Nit,
          'Fecha de Autorizacion': datos[i].fechaAutorizacion,
          'Estado': datos[i].estado

        }
        datatable.push(ob);
      }

      opciones = {
        fileName: 'Reporte de Aguas',
        datas: [
          {
            sheetData: datatable,
            sheetName: 'Historial solicitudes',
            sheetFilter: ['Numero de Radicado',
              'Tipo Identificacion',
              'Nombre persona Natural',
              'Persona juridica razon social',
              'Tipo de documento',
              'Numero de documento',
              'RUT',
              'NIT',
              'Fecha de Autorizacion',
              'Estado'],
            sheetHeader: ['Numero de Radicado',
              'Tipo Identificacion',
              'Nombre persona Natural',
              'Persona juridica razon social',
              'Tipo de documento',
              'Numero de documento',
              'RUT',
              'NIT',
              'Fecha de Autorizacion',
              'Estado']
          }
        ]
      };

      //downloadPDF(datatable);
      //console.log("🚀 ~ file: administracion-reportes.page.tsx ~ line 141 ~ downloadFileExcel ~ prueba", prueba);
      var toExcel = new ExportJsonExcel(opciones);
      toExcel.saveExcel()
    }
  }

  function downloadPDF(datos: any[]) {

    fetch('https://localhost:5001/api/GeneratePDF/GeneratePDFWord',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(datos)
      }
    ).then(function (response) {
      return response.blob();
    }).then(function (myBlob) {
      var objectURL = URL.createObjectURL(myBlob);
      let link = document.createElement('a');
      link.href = objectURL;
      link.download = 'Historial Solicitudes.docx';
      link.click();
    });
  }
  function downloadFileExportar() {
    Swal.fire({
      title: 'Exportar archivo',
      text: 'Esta a punto de exportar los datos encontrados, seleccione el tipo de documento deseado:',
      showCloseButton: true,
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'xlsx',
      denyButtonText: 'txt',
      confirmButtonColor: 'green',
      denyButtonColor: 'blue',
      showClass: {
        popup: 'animate_animated animate_fadeInDown'
      },
      hideClass: {
        popup: 'animate_animated animate_fadeOutUp'
      },
      icon: 'info'
    }).then((result) => {
      if (result.isConfirmed) {
        downloadFileExcel();
      }
    })

  }

  async function busquedaFun() {
    var input = false;
    var filtroFecha = null;
    if (dateSelectedInicial != undefined && dateSelectedFinal != undefined && dateSelectedInicial.toString() != 'Invalid Date' && dateSelectedFinal.toString() != 'Invalid Date') {


      const resp: any = await api.getallReportsAguas(moment(dateSelectedInicial).format('YYYY-MM-DD'),
        moment(dateSelectedFinal).format('YYYY-MM-DD'));

      console.log(resp)




      filtroFecha = resp.filter(function (f: { fechaSolicitud: string | number | Date; fechaLicencia: string | number | Date; }) {
        var fecha = new Date(moment(f.fechaSolicitud).format('DD-MM-YYYY HH:mm:ssss') + "");
        console.log(f.fechaSolicitud);
        console.log(fecha);
        console.log(moment(f.fechaSolicitud));
        if (busquedaseleccionada === 'solicitud' || busquedaseleccionada === 'todos') {
          return new Date(f.fechaSolicitud) >= dateSelectedInicial && new Date(f.fechaSolicitud) < dateSelectedFinal;
        }
        else {
          return new Date(f.fechaSolicitud) >= dateSelectedInicial && new Date(f.fechaSolicitud) < dateSelectedFinal;

        }

      });
      filtroFecha = resp
      console.log(filtroFecha)
      input = true;
    } else {
      setTextAlert('Fecha no seleccionada hasta el momento, por favor seleccione una.');
      Swal.fire({
        title: 'Fecha invalida',
        text: 'La Fecha no ha sido seleccionada hasta el momento, por favor seleccione una',

        icon: 'error'
      });
      setVisibleAlert(true);
    }
    if (input == true && FilterTextID != undefined && FilterTextID != '') {
      filtroFecha = filtroFecha?.filter(function (f: { consecutivo: String; }) {
        return f.consecutivo == FilterTextID;
      });
    }

    if (input == true && FilterTextDoc != undefined && FilterTextDoc != '') {
      filtroFecha = filtroFecha?.filter(function (f: { noIdentificacionSolicitante: undefined; }) {
        var filtro = FilterTextDoc != undefined ? FilterTextDoc : '';
        var solicitud = f.noIdentificacionSolicitante != undefined ? f.noIdentificacionSolicitante : '';
        return solicitud.toUpperCase().trim().includes(filtro.toUpperCase().trim());
      });
    }
    if (input == true && FilterTextFun != undefined && FilterTextFun != '') {
      filtroFecha = filtroFecha?.filter(function (f: { razonSocialSolicitante: undefined; }) {
        var filtro = FilterTextFun != undefined ? FilterTextFun : '';
        var solicitud = f.razonSocialSolicitante != undefined ? f.razonSocialSolicitante : '';
        return solicitud.toUpperCase().trim().includes(filtro.toUpperCase().trim());
      });
    }
    if (selectedOptionEstado && input) {
      switch (selectedOptionEstado) {
        case 'registroExt':
          filtroFecha = filtroFecha?.filter(function (f: { estadoString: string; }) {
            return f.estadoString == 'Registro Usuario Externo';
          });
          break;
        case 'aprobado':
          filtroFecha = filtroFecha?.filter(function (f: { estadoString: string; }) {
            return f.estadoString == 'Aprobado validador de documentos';
          });

          break;
        default:
          setVisibleGrid('none');
          break;
      }
    }
    if (filtroFecha != null) {
      console.log(filtroFecha);
      const dataFIN = filtroFecha != undefined ? filtroFecha : null;
      if (dataFIN != null) {
        setGrid(dataFIN);
        Swal.fire({
          title: 'Resultados encontrados',
          text: 'Señor usuario con los filtros de busqueda se encontraron ' + dataFIN.length + ' resultados.',

          icon: 'info'
        });
        setVisibleGrid('contents');
      } else {
        setVisibleGrid('none');
      }
    } else {
      setVisibleGrid('none');
    }
  }

  return (
    <div className='container-fluid mt-5  fadeInTop '>
      <PageHeaderComponent
        title='Reporte de Solicitudes Aguas'
        subTitle='Seleccione el filtro de busqueda para enlistar las solicitudes, el rango de fecha es obligatorio'
      />
      <div className='card'>
        <div className='card-body'>
          <div className='row h-100'>
            <div className='col-md-12 col-lg-12 col-sm-12  mt-3'>
              <label>
                <span style={{ color: 'red', fontWeight: 'bold' }}>*</span>Ingrese el rango de fechas que desea consultar
              </label>
            </div>
            <div className='col-lg-6 col-md-6 col-sm-12 mt-2'>
              <label>Fecha Inicial</label>
              <DatepickerComponent
                id='datePicker1'
                picker='date'
                placeholder='Fecha Inicial'
                dateDisabledType='before'
                dateFormatType='default'
                style={{ display: 'block' }}
                className='form-control'
                onChange={(date) => {
                  setVisibleAlert(false);
                  setDateIni(new Date(moment(date).format('MM/DD/YYYY')));
                }}
              />
            </div>
            <div className='col-lg-6 col-md-6 col-sm-12 mt-2'>
              <label>Fecha Final</label>
              <DatepickerComponent
                id='datePicker2'
                picker='date'
                placeholder='Fecha Final'
                dateDisabledType='before'
                dateFormatType='default'
                style={{ display: 'block' }}
                className='form-control'
                onChange={(date) => {
                  setVisibleAlert(false);
                  setDateFin(new Date(moment(date).add(1, 'day').format('MM/DD/YYYY')));
                }}
              />
            </div>
          </div>
          <div className='row mt-3 justify-content-center text-center'>
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <p style={{ fontSize: '16px', color: '#000', fontFamily: ' Roboto' }}>Buscar por:</p>
              <Radio.Group onChange={onChangefecha} defaultValue={'solicitud'}>
                <Radio value='solicitud'>Fecha de Solicitud</Radio>
                <Radio value='aprobada'>Fecha de Aprobacion</Radio>
                <Radio value='todos'>Todos</Radio>
              </Radio.Group>
            </div>
          </div>

          <div className='row mt-5' style={{ marginLeft: '2px' }}>
            <div className='col-md-12 col-lg-12 col-sm-12 mt-3'>
              <label>Ingrese los valores que desea buscar</label>
            </div>

            <div className='col-lg-12 col-sm-12 co-md-12'>
              <div className='form-group row mt-3'>
                <label className='col-sm-2 col-form-label'>Id Tramite</label>
                <div className='col-sm-10'>
                  <Form.Item name='' rules={[{ required: false }]}>
                    <Input id='tramiteID' placeholder='ID Tramite' className='form-control ml-1' onChange={onChangeFilterID} />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className='col-lg-12 col-sm-12 co-md-12'>
              <div className='form-group row'>
                <label className='col-sm-2 col-form-label'>No. Documento Fallecido</label>
                <div className='col-sm-10'>
                  <Form.Item name='' rules={[{ required: false }]}>
                    <Input
                      id='docFallecido'
                      placeholder='No. documento'
                      className='form-control ml-1'
                      onChange={onChangeFilterDoc}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>


            <section>
              <div className='container-fluid'>
                <div className='row'>
                  <div className="col-lg-15 col-sm-15 col-md-15 col-xl-15">
                    <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
                      <div className='d-flex center-block' style={{ margin: '0 auto' }}>
                        <Button type='primary'
                          htmlType='submit'
                          onClick={busquedaFun}
                          style={{ marginLeft: '10px' }}>
                          Buscar
                        </Button>
                      </div>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className='row mt-3'>
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <div className='mt-3' style={{ display: visibleGrid == 'none' ? 'none' : 'contents' }}>

                <Tabs style={{ border: 'none' }} className='mt-3'>
                  <TablaReportes data={grid} />
                </Tabs>

                <section>
                  <div className='container-fluid'>
                    <div className='row'>
                      <div className="col-lg-15 col-sm-15 col-md-15 col-xl-15">
                        <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
                          <div className='d-flex center-block' style={{ margin: '0 auto' }}>
                            <Button type='primary'
                              htmlType='submit'
                              onClick={downloadFileExportar}
                            >
                              Exportar
                            </Button>
                          </div>
                        </Form.Item>

                      </div>

                    </div>
                  </div>
                </section>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
/*

<div className='col-lg-12 col-sm-12 co-md-12'>
  <div className='form-group row'>
    <label className='col-sm-2 col-form-label'>Estado Tramite</label>
    <div className='col-sm-10'>
      <Form.Item name='' rules={[{ required: false }]}>
        <SelectComponent
          style={{ width: '1012px', marginLeft: '5px' }}
          id='filterEstadoTra'
          onChange={selectChangeEstado}
          options={[
            { key: 'registroExt', value: 'Pendiente Validación Funcionario' },
            { key: 'aprobado', value: 'Aprobado Validador de Documentos' },
            { key: 'buscar', value: 'Mostrar Todos' }
          ]}
          optionPropkey='key'
          optionPropLabel='value'
        />
      </Form.Item>
    </div>
  </div>
</div>
*/


export default GridTipoLicenciaReportes;
