// Antd
import { Form, Grid } from 'antd';
import Tabs from 'antd/es/tabs';

import { IRoles } from 'app/inhumacioncremacion/Models/IRoles';
import { ApiService } from 'app/services/Apis.service';
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { TablaReportes } from '../administracion/tablaReportes';
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
  const [dateSelectedPicker, setDate] = useState<String>();
  const [dateSelectedInicial, setDateIni] = useState<Date>();
  const [dateSelectedFinal, setDateFin] = useState<Date>();
  const [FilterText, setFilterText] = useState<String>();
  const [FilterTextID, setFilterTextID] = useState<String>();
  const [FilterTextDoc, setChangeFilterDoc] = useState<String>();
  const [FilterTextFun, setChangeFilterFun] = useState<String>();
  const [disableFilter, setDisableFilter] = useState<Boolean>();
  const [textAlerta, setTextAlert] = useState<String>();
  const [visibleAlerta, setVisibleAlert] = useState<Boolean>();
  const getListas = useCallback(
    async () => {
      const resp = await api.getallReports();

      setGrid(resp);
      setAllData(resp);
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

  function onChangeFilter(event: any) {
    setFilterText(event.target.value);
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
        let tipo = '';
        switch (datos[i].idTramite) {
          case 'a289c362-e576-4962-962b-1c208afa0273':
            tipo = 'Inhumación Individual';
            break;
          case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
            //inhumacion fetal
            tipo = 'Inhumación Fetal'
            break;
          case 'e69bda86-2572-45db-90dc-b40be14fe020':
            //cremacion individual
            tipo = 'Cremación Individual'
            break;
          case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
            //cremacionfetal
            tipo = 'Cremación Fetal '
            break;

        }
        let ob = {
          'Consecutivo': datos[i].consecutivo,
          'Numero Licencia': datos[i].numerolicenciainfo,
          'Fecha de Licencia': datos[i].fechaLicencia,
          'Tipo Solicitud': tipo,
          'Número de Certificado': datos[i].numeroCertificado,
          'Tipo de Documento': datos[i].idTipoDocumento,
          'Número de documento': datos[i].noIdentificacionSolicitante,
          'Primer Apellido': datos[i].primerApellidoRep,
          'Segundo Apellido': datos[i].segundoApellidoRep,
          'Primer Nombre': datos[i].primerNombreRep,
          'Segundo Nombre': datos[i].segundoNombreRep,
          'Fecha de Nacimiento': datos[i].fechaNacimientoRep,
          'Sexo': datos[i].nombreSexo,
          'Fecha de Fallecimiento': datos[i].fechaDefuncion,
          'Tipo de Muerte': datos[i].tipoMuerteRep,
          'Cementerio': datos[i].cementerio,
          'Pais': datos[i].paisRep,
          'Departamento': datos[i].departamentoRep,
          'Municipio': datos[i].municipioRep,
          'Area': datos[i].areaDefuncionRep,
          'Sitio': datos[i].Sitio,
          'Ins. que expidio Certificado Def.': datos[i].razonSocialInstitucionRep,
          'NIT': datos[i].numeroIdentificacionInstitucionRep,
          'Num. Acta levantamiento': datos[i].numeroActaLevantamientoInstitucionRep,
          'Fecha de Acta Levantamiento': datos[i].fechaActaInstitucionRep,
          'Fiscal Número': datos[i].noFiscalInstitucionRep,
          'Seccional de Fiscalia': datos[i].seccionalFiscaliaInstitucionRep,
          'Num. Protocolo': datos[i].numeroProtocoloInstitucionRep
        }
        datatable.push(ob);
      }

      opciones = {
        fileName: 'Solicitudes inhumacion - cremacion',
        datas: [
          {
            sheetData: datatable,
            sheetName: 'Historial solicitudes',
            sheetFilter: ['Consecutivo',
              'Numero Licencia',
              'Fecha de Licencia',
              'Tipo Solicitud',
              'Número de Certificado',
              'Tipo de Documento',
              'Número de documento',
              'Primer Apellido',
              'Segundo Apellido',
              'Primer Nombre',
              'Segundo Nombre',
              'Fecha de Nacimiento',
              'Sexo',
              'Fecha de Fallecimiento',
              'Tipo de Muerte',
              'Cementerio',
              'Pais',
              'Departamento',
              'Municipio',
              'Area',
              'Sitio',
              'Ins. que expidio Certificado Def.',
              'NIT',
              'Num. Acta levantamiento',
              'Fecha de Acta Levantamiento',
              'Fiscal Número',
              'Seccional de Fiscalia',
              'Num. Protocolo'],
            sheetHeader: ['Consecutivo',
              'Numero Licencia',
              'Fecha de Licencia',
              'Tipo Solicitud',
              'Número de Certificado',
              'Tipo de Documento',
              'Número de documento',
              'Primer Apellido',
              'Segundo Apellido',
              'Primer Nombre',
              'Segundo Nombre',
              'Fecha de Nacimiento',
              'Sexo',
              'Fecha de Fallecimiento',
              'Tipo de Muerte',
              'Cementerio',
              'Pais',
              'Departamento',
              'Municipio',
              'Area',
              'Sitio',
              'Ins. que expidio Certificado Def.',
              'NIT',
              'Num. Acta levantamiento',
              'Fecha de Acta Levantamiento',
              'Fiscal Número',
              'Seccional de Fiscalia',
              'Num. Protocolo']
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
  function downloadTxt() {
    var element = document.createElement('a');
    let datos = grid;
    let datatable = [];
    let opciones = {};
    if (datos && datos.length > 0) {
      for (let i in datos) {
        let tipo = '';
        switch (datos[i].idTramite) {
          case 'a289c362-e576-4962-962b-1c208afa0273':
            tipo = 'Inhumación Individual';
            break;
          case 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060':
            //inhumacion fetal
            tipo = 'Inhumación Fetal'
            break;
          case 'e69bda86-2572-45db-90dc-b40be14fe020':
            //cremacion individual
            tipo = 'Cremación Individual'
            break;
          case 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e':
            //cremacionfetal
            tipo = 'Cremación Fetal '
            break;

        }
        let ob = {
          'Consecutivo': datos[i].consecutivo,
          'Numero Licencia': datos[i].numerolicenciainfo,
          'Fecha de Licencia': datos[i].fechaLicencia,
          'Tipo Solicitud': tipo,
          'Número de Certificado': datos[i].numeroCertificado,
          'Tipo de Documento': datos[i].idTipoDocumento,
          'Número de documento': datos[i].noIdentificacionSolicitante,
          'Primer Apellido': datos[i].primerApellidoRep,
          'Segundo Apellido': datos[i].segundoApellidoRep,
          'Primer Nombre': datos[i].primerNombreRep,
          'Segundo Nombre': datos[i].segundoNombreRep,
          'Fecha de Nacimiento': datos[i].fechaNacimientoRep,
          'Sexo': datos[i].nombreSexo,
          'Fecha de Fallecimiento': datos[i].fechaDefuncion,
          'Tipo de Muerte': datos[i].tipoMuerteRep,
          'Cementerio': datos[i].cementerio,
          'Pais': datos[i].paisRep,
          'Departamento': datos[i].departamentoRep,
          'Municipio': datos[i].municipioRep,
          'Area': datos[i].areaDefuncionRep,
          'Sitio': datos[i].Sitio,
          'Ins. que expidio Certificado Def.': datos[i].razonSocialInstitucionRep,
          'NIT': datos[i].numeroIdentificacionInstitucionRep,
          'Num. Acta levantamiento': datos[i].numeroActaLevantamientoInstitucionRep,
          'Fecha de Acta Levantamiento': datos[i].fechaActaInstitucionRep,
          'Fiscal Número': datos[i].noFiscalInstitucionRep,
          'Seccional de Fiscalia': datos[i].seccionalFiscaliaInstitucionRep,
          'Num. Protocolo': datos[i].numeroProtocoloInstitucionRep
        }
        datatable.push(ob);
      }
    }
    let textoPlano = 'Consecutivo  | Numero Licencia | Fecha de Licencia  |  Tipo Solicitud  |  Tipo Solicitud  |  Número de Certificado  |  Tipo de Documento  |  Número de documento | ' +
      'Primer Apellido  | Segundo Apellido | Primer Nombre  |  Segundo Nombre  |  Fecha de Nacimiento  |  Sexo  |  Fecha de Fallecimiento  |  Tipo de Muerte | ' +
      'Cementerio  | Pais | Departamento  |  Municipio  |  Area  |  Sitio  |  Ins. que expidio Certificado Def.  |  NIT | ' +
      'Num. Acta levantamiento  | Fecha de Acta Levantamiento | Fiscal Número  |  Seccional de Fiscalia  |  Num. Protocolo  \n';
    for (let inf in datatable) {
      textoPlano += datatable[inf]['Consecutivo'] + '  |  ' + datatable[inf]['Numero Licencia'] + '  |  ' + datatable[inf]['Fecha de Licencia'] + '  |  '
        + datatable[inf]['Tipo Solicitud'] + '  |  ' + datatable[inf]['Número de Certificado'] +
        '  |  ' + datatable[inf]['Tipo de Documento'] + '  |  ' + datatable[inf]['Número de documento'] + datatable[inf]['Primer Apellido'] + '  |  ' + datatable[inf]['Segundo Apellido'] + '  |  ' + datatable[inf]['Primer Nombre'] + '  |  '
        + datatable[inf]['Segundo Nombre'] + '  |  ' + datatable[inf]['Fecha de Nacimiento'] +
        '  |  ' + datatable[inf]['Sexo'] + '  |  ' + datatable[inf]['Fecha de Fallecimiento'] + datatable[inf]['Tipo de Muerte'] + '  |  ' + datatable[inf]['Cementerio'] + '  |  ' + datatable[inf]['Pais'] + '  |  '
        + datatable[inf]['Departamento'] + '  |  ' + datatable[inf]['Municipio'] +
        '  |  ' + datatable[inf]['Area'] + '  |  ' + datatable[inf]['Sitio'] + datatable[inf]['Ins. que expidio Certificado Def.'] + '  |  ' + datatable[inf]['NIT'] + '  |  ' + datatable[inf]['Num. Acta levantamiento'] + '  |  '
        + datatable[inf]['Fecha de Acta Levantamiento'] + '  |  ' + datatable[inf]['Fiscal Número'] +
        '  |  ' + datatable[inf]['Seccional de Fiscalia'] + '  |  ' + datatable[inf]['Num. Protocolo'] + ' \n';

    }


    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textoPlano));
    element.setAttribute('download', 'Solicitudes inhumacion - cremacion.txt');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
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
      } else if (result.isDenied) {
        downloadTxt();
      }
    })

  }

  function busquedaFun() {
    var input = false;
    var filtroFecha = null;
    if (dateSelectedInicial != undefined && dateSelectedFinal != undefined && dateSelectedInicial.toString() != 'Invalid Date' && dateSelectedFinal.toString() != 'Invalid Date') {
      filtroFecha = allData.filter(function (f) {
        // var fecha = new Date(dateSelectedPicker == undefined ? new Date() : dateSelectedPicker.toString());

        return new Date(f.fechaSolicitud) >= dateSelectedInicial && new Date(f.fechaSolicitud) < dateSelectedFinal;
      });
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
      filtroFecha = filtroFecha?.filter(function (f) {
        return f.consecutivo == FilterTextID;
      });
    }

    if (input == true && FilterTextDoc != undefined && FilterTextDoc != '') {
      filtroFecha = filtroFecha?.filter(function (f) {
        var filtro = FilterTextDoc != undefined ? FilterTextDoc : '';
        var solicitud = f.noIdentificacionSolicitante != undefined ? f.noIdentificacionSolicitante : '';
        return solicitud.toUpperCase().trim().includes(filtro.toUpperCase().trim());
      });
    }
    if (input == true && FilterTextFun != undefined && FilterTextFun != '') {
      filtroFecha = filtroFecha?.filter(function (f) {
        var filtro = FilterTextFun != undefined ? FilterTextFun : '';
        var solicitud = f.razonSocialSolicitante != undefined ? f.razonSocialSolicitante : '';
        return solicitud.toUpperCase().trim().includes(filtro.toUpperCase().trim());
      });
    }
    if (selectedOption && input) {
      switch (selectedOption) {
        case 'inhuIndi':
          filtroFecha = filtroFecha?.filter(function (f) {
            return f.idTramite == 'a289c362-e576-4962-962b-1c208afa0273';
          });
          break;
        case 'inhuFetal':
          filtroFecha = filtroFecha?.filter(function (f) {
            return f.idTramite == 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060';
          });

          break;
        case 'cremInd':
          filtroFecha = filtroFecha?.filter(function (f) {
            return f.idTramite == 'e69bda86-2572-45db-90dc-b40be14fe020';
          });

          break;
        case 'cremFetal':
          filtroFecha = filtroFecha?.filter(function (f) {
            return f.idTramite == 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e';
          });

          break;
        default:
          setVisibleGrid('none');
          break;
      }
    }

    if (selectedOptionEstado && input) {
      switch (selectedOptionEstado) {
        case 'registroExt':
          filtroFecha = filtroFecha?.filter(function (f) {
            return f.estadoString == 'Registro Usuario Externo';
          });
          break;
        case 'aprobado':
          filtroFecha = filtroFecha?.filter(function (f) {
            return f.estadoString == 'Aprobado validador de documentos';
          });

          break;
        default:
          setVisibleGrid('none');
          break;
      }
    }
    if (filtroFecha != null) {
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
        title='Reporte de Solicitudes Inhumación-Cremación'
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
            <div className='col-lg-12 col-sm-12 co-md-12'>
              <div className='form-group row'>
                <label className='col-sm-2 col-form-label'>Funeraria</label>
                <div className='col-sm-10'>
                  <Form.Item name='' rules={[{ required: false }]}>
                    <Input
                      id='funeraria'
                      placeholder='Nombre Funeraria'
                      className='form-control ml-1'
                      onChange={onChangeFilterFun}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className='col-lg-12 col-sm-12 co-md-12'>
              <div className='form-group row'>
                <label className='col-sm-2 col-form-label'>Tipo Solicitud</label>
                <div className='col-sm-10'>
                  <Form.Item name='' rules={[{ required: false }]}>
                    <SelectComponent
                      style={{ width: '1012px', marginLeft: '5px' }}
                      id='filterTipoSol'
                      onChange={selectChange}
                      options={[
                        { key: 'inhuIndi', value: 'Inhumación Indivual' },
                        { key: 'inhuFetal', value: 'Inhumación Fetal' },
                        { key: 'cremInd', value: 'Cremación Individual' },
                        { key: 'cremFetal', value: 'Cremación Fetal' },
                        { key: 'todos', value: 'Todos' }
                      ]}
                      optionPropkey='key'
                      optionPropLabel='value'
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

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

export default GridTipoLicenciaReportes;
