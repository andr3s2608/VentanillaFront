import { Form, Grid } from 'antd';
import Tabs from 'antd/es/tabs';
import { IRoles } from 'app/inhumacioncremacion/Models/IRoles';
import { ApiService } from 'app/services/Apis.service';
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { Gridview } from 'app/shared/components/table';
import { authProvider } from 'app/shared/utils/authprovider.util';
import React, { useCallback, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import moment from 'moment';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import Input from 'antd/es/input/Input';
import Button from 'antd/es/button/button';

const { TabPane } = Tabs;

const GridTipoLicencia: React.FC<any> = (props: any) => {
  const [grid, setGrid] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [roles, setroles] = useState<IRoles[]>([]);
  const [search, setSearch] = React.useState('');
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [selectedOption, setSelectedOption] = useState<String>();
  const [visibleGrid, setVisibleGrid] = useState<String>();
  const [visiblePicker, setVisiblePicker] = useState<String>();
  const [dateSelectedPicker, setDate] = useState<String>();
  const [FilterText, setFilterText] = useState<String>();
  const [disableFilter, setDisableFilter] = useState<Boolean>();
  const [textAlerta, setTextAlert] = useState<String>();
  const [visibleAlerta, setVisibleAlert] = useState<Boolean>();
  const getListas = useCallback(
    async () => {
      await api.GetRoles().then(async (res) => {
        setroles(res);
        await GetValidateRol(res);
      });
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

  const GetValidateRol = async (toRoles: IRoles[]) => {
    const [permiso] = roles.length > 0 ? roles : toRoles;

    if (permiso?.rol === 'Ciudadano') {
      const resp = await api.GetEstadoSolicitudNuevo();
      setGrid(resp);
    } else {
      let arraydatos = [];
      const resp = await api.getallbyEstado('FDCEA488-2EA7-4485-B706-A2B96A86FFDF');

      setGrid(resp);
      setAllData(resp);
      setVisibleGrid('contents');
    }
    setVisiblePicker('none');
    setVisibleAlert(false);
    /*
    if (permiso?.rol === 'Funcionario') {
      let arraydatos = [];
      const resp = await api.getallbyEstado('FDCEA488-2EA7-4485-B706-A2B96A86FFDF');

      setGrid(resp);
    }
    */
  };
  const selectChange = (event: any) => {
    const value = event;
    setVisibleAlert(false);
    if (value == 'fechaReg') {
      setVisiblePicker('block');
    } else {
      if (value == 'inhuIndi' || value == 'inhuFetal' || value == 'cremInd' || value == 'cremFetal' || value == 'todos') {
        setDisableFilter(true);
      } else {
        setDisableFilter(false);
      }
      setVisiblePicker('none');
    }
    setSelectedOption(value);
  };
  function changeValuePicker(event: any) {}
  function onChangeFilter(event: any) {
    setVisibleAlert(false);
    setFilterText(event.target.value);
  }
  function closeAlert() {
    setVisibleAlert(false);
  }

  function busquedaFun() {
    var input;
    switch (selectedOption) {
      case 'idSol':
        const resultFilter = allData.filter(function (f) {
          return f.iD_Control_Tramite == FilterText;
        });
        setGrid(resultFilter);
        setVisibleGrid('contents');
        break;
      case 'docFallec':
        const resultFilterDoc = allData.filter(function (f) {
          var filtro = FilterText != undefined ? FilterText : '';
          var solicitud = f.noIdentificacionSolicitante != undefined ? f.noIdentificacionSolicitante : '';
          return solicitud.toUpperCase().trim() == filtro.toUpperCase().trim();
        });
        setGrid(resultFilterDoc);
        setVisibleGrid('contents');
        break;
      case 'funOnombre':
        const resultFilterNom = allData.filter(function (f) {
          var filtro = FilterText != undefined ? FilterText : '';
          var solicitud = f.razonSocialSolicitante != undefined ? f.razonSocialSolicitante : '';
          return solicitud.toUpperCase().trim().includes(filtro.toUpperCase().trim());
        });
        setGrid(resultFilterNom);
        setVisibleGrid('contents');
        break;
      case 'todos':
        setGrid(allData);
        setVisibleGrid('contents');
        break;
      case 'fechaReg':
        if (dateSelectedPicker != 'Invalid Date' && dateSelectedPicker != undefined) {
          const resultFilterFec = allData.filter(function (f) {
            // var fecha = new Date(dateSelectedPicker == undefined ? new Date() : dateSelectedPicker.toString());
            return new Date(f.fechaSolicitud).toDateString() == dateSelectedPicker;
          });

          setGrid(resultFilterFec);
          setVisibleGrid('contents');
        } else {
          setTextAlert('Fecha no seleccionada hasta el momento, por favor seleccione una.');
          setVisibleAlert(true);
        }
        break;
      case 'inhuIndi':
        const resultFilterinhum = allData.filter(function (f) {
          return f.idTramite == 'a289c362-e576-4962-962b-1c208afa0273';
        });
        setGrid(resultFilterinhum);
        setVisibleGrid('contents');
        break;
      case 'inhuFetal':
        const resultFilterinhfet = allData.filter(function (f) {
          return f.idTramite == 'ad5ea0cb-1fa2-4933-a175-e93f2f8c0060';
        });
        setGrid(resultFilterinhfet);
        setVisibleGrid('contents');
        break;
      case 'cremInd':
        const resultFilterCrem = allData.filter(function (f) {
          return f.idTramite == 'e69bda86-2572-45db-90dc-b40be14fe020';
        });
        setGrid(resultFilterCrem);
        setVisibleGrid('contents');
        break;
      case 'cremFetal':
        const resultFilterCremFet = allData.filter(function (f) {
          return f.idTramite == 'f4c4f874-1322-48ec-b8a8-3b0cac6fca8e';
        });
        setGrid(resultFilterCremFet);
        setVisibleGrid('contents');
        break;
      default:
        setVisibleGrid('none');
        break;
    }
  }

  return (
    <div className='container-fluid mt-5  fadeInTop '>
      <PageHeaderComponent
        title='Listado de Solicitudes Inhumación-Cremación'
        subTitle='Seleccione el filtro de busqueda para enlistar las solicitudes'
      />
      <div className='card'>
        <div className='card-body'>
          <div className='row h-100 justify-content-center align-items-center'>
            <div className='col-gl-6 col-md-6 col-sm-12'>
              <div style={{ margin: '0 auto', display: 'block' }}>
                <Form.Item label='' name='' initialValue={'Todos'} rules={[{ required: true }]}>
                  <SelectComponent
                    className='ml-3'
                    id='filter'
                    onChange={selectChange}
                    defaultValue={'todos'}
                    options={[
                      { key: 'idSol', value: 'Id Tramite' },
                      { key: 'docFallec', value: 'Documento del fallecido' },
                      { key: 'funOnombre', value: 'Funeraria o Nombre' },
                      { key: 'fechaReg', value: 'Fecha de registro' },
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
            <div className='col-lg-3 col-md-3 col-sm-12'>
              <Form.Item label='' name='' rules={[{ required: true }]}>
                <Input
                  id='busqueda'
                  placeholder='Filtro de busqueda en la tabla'
                  className='form-control ml-5'
                  onChange={onChangeFilter}
                  style={{ display: visiblePicker != 'none' ? 'none' : 'block' }}
                  disabled={disableFilter == true ? true : false}
                />
                <DatepickerComponent
                  id='datePicker'
                  picker='date'
                  dateDisabledType='default'
                  dateFormatType='default'
                  style={{ display: visiblePicker == 'none' ? 'none' : 'block' }}
                  className='form-control'
                  onChange={(date) => {
                    setVisibleAlert(false);
                    const d = new Date(moment(date).format('MM-DD-YYYY')).toDateString();
                    setDate(d);
                  }}
                />
              </Form.Item>
            </div>
            <div className='col-lg-2 col-sm-12 col-md-2 text-center mb-2 ml-5'>
              <Button type='primary' htmlType='submit' onClick={busquedaFun}>
                Buscar
              </Button>
            </div>
          </div>
          <div className='row' style={{ marginTop: '-8px' }}>
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <div style={{ display: visibleGrid == 'none' ? 'none' : 'contents' }}>
                <Tabs style={{ border: 'none' }}>
                  <TabPane tab='' key='1'>
                    <Gridview data={grid} />
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

export default GridTipoLicencia;
