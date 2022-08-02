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
  function busquedaFun() {
    var input = false;
    var filtroFecha = null;
    console.log('inicial ' + dateSelectedInicial?.toDateString() + ' final ' + dateSelectedFinal?.toDateString());
    if (dateSelectedInicial != undefined && dateSelectedFinal != undefined) {
      console.log('ENTRO FILTRO FECHA');
      filtroFecha = allData.filter(function (f) {
        // var fecha = new Date(dateSelectedPicker == undefined ? new Date() : dateSelectedPicker.toString());

        return new Date(f.fechaSolicitud) >= dateSelectedInicial && new Date(f.fechaSolicitud) <= dateSelectedFinal;
      });
      console.log('---REALIZO FILTRO FECHA');
      input = true;
    } else {
      setTextAlert('Fecha no seleccionada hasta el momento, por favor seleccione una.');
      setVisibleAlert(true);
    }
    if (input == true && FilterTextID != undefined && FilterTextID != '') {
      console.log('ENTRO FILTRO ID');
      filtroFecha = filtroFecha?.filter(function (f) {
        return f.iD_Control_Tramite == FilterTextID;
      });
      console.log('REALIZO FILTRO ID');
    }

    if (input == true && FilterTextDoc != undefined && FilterTextDoc != '') {
      console.log('Entro FILTRO DOC');
      filtroFecha = filtroFecha?.filter(function (f) {
        var filtro = FilterTextDoc != undefined ? FilterTextDoc : '';
        var solicitud = f.noIdentificacionSolicitante != undefined ? f.noIdentificacionSolicitante : '';
        return solicitud.toUpperCase().trim().includes(filtro.toUpperCase().trim());
      });
      console.log('REALIZO FILTRO DOC');
    }
    if (input == true && FilterTextFun != undefined && FilterTextFun != '') {
      console.log('Entro FILTRO FUNERARIA');
      filtroFecha = filtroFecha?.filter(function (f) {
        var filtro = FilterTextFun != undefined ? FilterTextFun : '';
        var solicitud = f.razonSocialSolicitante != undefined ? f.razonSocialSolicitante : '';
        return solicitud.toUpperCase().trim().includes(filtro.toUpperCase().trim());
      });
      console.log('REALIZO FILTRO FUNERARIA');
    }
    if (selectedOption && input) {
      console.log('ENTRO FILTRO TIPO SOLICITUD');
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
      console.log('REALIZO FILTRO TIPO SOLICITUD');
    }

    if (selectedOptionEstado && input) {
      console.log('ENTRO FILTRO ESTADO');
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
      console.log('REALIZO FILTRO ESTADO');
    }
    if (filtroFecha != null) {
      const dataFIN = filtroFecha != undefined ? filtroFecha : null;
      if (dataFIN != null) {
        console.log(JSON.stringify(dataFIN));
        setGrid(dataFIN);
        setVisibleGrid('contents');
      } else {
        console.log('NO DATOS 1');
        setVisibleGrid('none');
      }
    } else {
      console.log('NO DATOS 2');
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
            <div className='col-lg-6 col-md-6 col-sm-12'>
              <DatepickerComponent
                id='datePicker1'
                picker='date'
                placeholder='Fecha Inicial'
                dateDisabledType='default'
                dateFormatType='default'
                style={{ display: 'block' }}
                className='form-control'
                onChange={(date) => {
                  setVisibleAlert(false);
                  setDateIni(new Date(moment(date).format('MM-DD-YYYY')));
                }}
              />
            </div>
            <div className='col-lg-6 col-md-6 col-sm-12'>
              <DatepickerComponent
                id='datePicker2'
                picker='date'
                placeholder='Fecha Final'
                dateDisabledType='default'
                dateFormatType='default'
                style={{ display: 'block' }}
                className='form-control'
                onChange={(date) => {
                  setVisibleAlert(false);
                  setDateFin(new Date(moment(date).format('MM-DD-YYYY') + 1));
                }}
              />
            </div>
          </div>
          <div className='row h-100 justify-content-center align-items-center'>
            <div className='col-gl-6 col-md-6 col-sm-12' style={{ margin: '10px', display: 'block' }}>
              <div style={{ margin: '0 auto', display: 'block' }}>
                <Form.Item label='ID Tramite' name='' rules={[{ required: false }]}>
                  <Input
                    id='tramiteID'
                    placeholder='ID Tramite'
                    className='form-control ml-1'
                    onChange={onChangeFilterID}
                    style={{ display: 'block' }}
                  />
                </Form.Item>
              </div>
              <div style={{ margin: '0 auto', display: 'block' }}>
                <Form.Item label='No. Documento Fallecido' name='' rules={[{ required: false }]}>
                  <Input
                    id='docFallecido'
                    placeholder='No. documento'
                    className='form-control ml-1'
                    onChange={onChangeFilterDoc}
                    style={{ display: 'block' }}
                  />
                </Form.Item>
              </div>
              <div style={{ margin: '0 auto', display: 'block' }}>
                <Form.Item label='Funeraria' name='' rules={[{ required: false }]}>
                  <Input
                    id='funeraria'
                    placeholder='Nombre Funeraria'
                    className='form-control ml-1'
                    onChange={onChangeFilterFun}
                    style={{ display: 'block' }}
                  />
                </Form.Item>
              </div>
              <div style={{ margin: '0 auto', display: 'block' }}>
                <Form.Item label='Tipo Solicitud' name='' rules={[{ required: false }]}>
                  <SelectComponent
                    className='ml-3'
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
              <div style={{ margin: '0 auto', display: 'block' }}>
                <Form.Item label='Estado Tramite' name='' rules={[{ required: false }]}>
                  <SelectComponent
                    className='ml-3'
                    id='filterEstadoTra'
                    onChange={selectChangeEstado}
                    options={[
                      { key: 'registroExt', value: 'Registro Usuario Externo' },
                      { key: 'aprobado', value: 'Aprobado validador de documentos' },
                      { key: 'buscar', value: 'por investigar' }
                    ]}
                    optionPropkey='key'
                    optionPropLabel='value'
                  />
                </Form.Item>
              </div>

              <div className='col-lg-2 col-sm-12 col-md-2 text-center mb-2 ml-5'>
                <Button type='primary' htmlType='submit' onClick={busquedaFun}>
                  Buscar
                </Button>
              </div>
            </div>
          </div>
          <div className='row' style={{ marginTop: '-8px' }}>
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <div style={{ display: visibleGrid == 'none' ? 'none' : 'contents' }}>
                <Tabs style={{ border: 'none' }}>
                  <TabPane tab='Resultados' key='1'>
                    <TablaReportes data={grid} />
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridTipoLicenciaReportes;
