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
  const [espera, setespera] = useState<any>();
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
  const [rol, setrol] = useState<String>('');
  const [usuario, setusuario] = useState<any>();
  const [subredes, setsubredes] = useState<any>();
  const getListas = useCallback(


    async () => {
      const usuario = await api.getIdUsuario();
      setusuario(usuario)
      const rol: any = JSON.parse(localStorage.getItem('roles') + '');

      const subred = await api.getSubredes();
      setsubredes(subred);



      setrol(rol[0].rol)

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
        let ob;
        if (rol === 'Subdirector') {
          ob = {
            'Numero de Radicado': datos[i].numeroRadicado,
            'Nombre persona Natural': datos[i].nombre,
            'Persona Juridica ': datos[i].razonSocial,
            'Tipo Identificacion': datos[i].tipoIdentificacion,
            'Numero de documento': datos[i].numeroIdentificacion,
            'NIT': datos[i].nit,
            'RUT': datos[i].rut,
            'Fecha de Solicitud': datos[i].fechaSolicitud != '' ? moment(datos[i].fechaSolicitud).format('DD-MM-YYYY') : '',
            'Fecha de Autorizacion': datos[i].fechaAutorizacion != '' ? moment(datos[i].fechaAutorizacion).format('DD-MM-YYYY') : '',
            'Responsable':
              (datos[i].etapa === 'Visita de Revision' ||
                datos[i].etapa === 'Gestion Subred') ? datos[i].responsablesub :
                (datos[i].etapa === 'Gestion Coordinador' ? datos[i].responsableus :
                  ''),
            'Etapa': datos[i].etapa,
            'Estado': datos[i].estado

          }
        }
        else {



          ob = {
            'Numero de Radicado': datos[i].numeroRadicado,
            'Nombre persona Natural': datos[i].nombre,
            'Persona Juridica ': datos[i].razonSocial,
            'Tipo Identificacion': datos[i].tipoIdentificacion,
            'Numero de documento': datos[i].numeroIdentificacion,
            'NIT': datos[i].nit,
            'RUT': datos[i].rut,
            'Fecha de Solicitud': datos[i].fechaSolicitud != '' ? moment(datos[i].fechaSolicitud).format('DD-MM-YYYY') : '',
            'Fecha de Autorizacion': datos[i].fechaAutorizacion != '' ? moment(datos[i].fechaAutorizacion).format('DD-MM-YYYY') : '',
            'Estado': datos[i].estado
          }
        }
        datatable.push(ob);
      }

      opciones = {
        fileName: 'Reporte de Aguas',
        datas: (rol === 'Subdirector' ? [
          {
            sheetData: datatable,
            sheetName: 'Historial solicitudes',
            sheetFilter: ['Numero de Radicado',
              'Nombre persona Natural',
              'Persona Juridica ',
              'Tipo Identificacion',
              'Numero de documento',
              'NIT',
              'RUT',
              'Fecha de Solicitud',
              'Fecha de Autorizacion',
              'Responsable',
              'Etapa',
              'Estado'],
            sheetHeader: ['Numero de Radicado',
              'Nombre persona Natural',
              'Persona Juridica ',
              'Tipo Identificacion',
              'Numero de documento',
              'NIT',
              'RUT',
              'Fecha de Solicitud',
              'Fecha de Autorizacion',
              'Responsable',
              'Etapa',
              'Estado']
          }

        ] : [
          {
            sheetData: datatable,
            sheetName: 'Historial solicitudes',
            sheetFilter: ['Numero de Radicado',
              'Nombre persona Natural',
              'Persona Juridica ',
              'Tipo Identificacion',
              'Numero de documento',
              'NIT',
              'RUT',
              'Fecha de Solicitud',
              'Fecha de Autorizacion',
              'Estado'],
            sheetHeader: ['Numero de Radicado',
              'Nombre persona Natural',
              'Persona Juridica ',
              'Tipo Identificacion',
              'Numero de documento',
              'NIT',
              'RUT',
              'Fecha de Solicitud',
              'Fecha de Autorizacion',
              'Estado']
          }
        ])
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
      confirmButtonColor: 'green',
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
    setVisibleGrid('none');
    setespera(undefined);
    if (dateSelectedInicial != undefined && dateSelectedFinal != undefined && dateSelectedInicial.toString() != 'Invalid Date' && dateSelectedFinal.toString() != 'Invalid Date') {

      let resp: any[] = [];


      let subred: any = null;
      for (let index = 0; index < subredes.length; index++) {

        if (usuario === subredes[index].idUsuario) {
          subred = subredes[index].idSubRed;
          break;

        }
      }

      if (rol === 'Subdirector' || rol === 'AdminFuncional') {
        resp = await api.getallReportsAguas(moment(dateSelectedInicial).format('YYYY-MM-DD'),
          moment(dateSelectedFinal).format('YYYY-MM-DD'), ' ', 'subdirector');
      }

      if (rol === 'Ciudadano' || rol === 'Funeraria' || rol === 'MedicinaLegal') {
        resp = await api.getallReportsAguas(moment(dateSelectedInicial).format('YYYY-MM-DD'),
          moment(dateSelectedFinal).format('YYYY-MM-DD'), usuario + '', 'usuario');
      }
      if (rol === 'Coordinador') {
        resp = await api.getallReportsAguas(moment(dateSelectedInicial).format('YYYY-MM-DD'),
          moment(dateSelectedFinal).format('YYYY-MM-DD'), usuario + '', 'asignado');
      }
      if (rol === 'Funcionario' || rol === 'AdminTI') {
        resp = await api.getallReportsAguas(moment(dateSelectedInicial).format('YYYY-MM-DD'),
          moment(dateSelectedFinal).format('YYYY-MM-DD'), subred != null ? subred + '' : '00000000-0000-0000-0000-000000000000', 'subred');
      }





      filtroFecha = resp;


      //filtroFecha = resp

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

      const dataFIN = filtroFecha != undefined ? filtroFecha : null;
      if (dataFIN != null) {
        setGrid(dataFIN);
        setespera('');
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
                style={{ display: 'block', width: 400 }}
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
                style={{ display: 'block', width: 400 }}
                className='form-control'
                onChange={(date) => {
                  setVisibleAlert(false);
                  setDateFin(new Date(moment(date).format('MM/DD/YYYY')));
                }}
              />
            </div>
          </div>

          <div className='row mt-5' style={{ marginLeft: '2px' }}>


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
                  {espera != undefined && (<TablaReportes data={grid} />)}

                </Tabs>
                {espera != undefined && (<section>
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
                </section>)}

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
