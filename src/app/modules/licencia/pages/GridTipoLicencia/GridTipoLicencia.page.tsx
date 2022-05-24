import { Form, Grid } from 'antd';
import Tabs from 'antd/es/tabs';
import { IRoles } from 'app/Models/IRoles';
import { ApiService } from 'app/services/Apis.service';
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { Gridview } from 'app/shared/components/table';
import { authProvider } from 'app/shared/utils/authprovider.util';
import React, { useCallback, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import moment from 'moment';

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

      //setGrid(resp);
      setAllData(resp);
      setVisibleGrid('none');
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
  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
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
    <div className='card card-body py-5 mb-4 fadeInTop'>
      <div
        id='idAlert'
        className='alert alert-danger justify-content-center'
        role={'alert'}
        style={{ display: visibleAlerta == false ? 'none' : 'block' }}
      >
        <h1>
          {' '}
          <strong>¡Importante!</strong>
        </h1>{' '}
        <br />
        <h3>{textAlerta == undefined ? '' : textAlerta.toUpperCase()}</h3>
        <button type='button' className='close' aria-label='Close' onClick={closeAlert}>
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>
      <div className='d-flex gap-5 justify-content-center'>
        <select name='selection' id='filter' onChange={selectChange} className='custom-select custom-select-lg mb-3'>
          <option selected disabled>
            Seleccione una opción.
          </option>
          <option value='idSol'>Id Tramite</option>
          <option value='docFallec'>Documento del fallecido</option>
          <option value='funOnombre'>Funeraria o Nombre</option>
          <option value='fechaReg'>Fecha de registro</option>
          <option value='inhuIndi'>Inhumación Indivual</option>
          <option value='inhuFetal'>Inhumación Fetal</option>
          <option value='cremInd'>Cremación Individual</option>
          <option value='cremFetal'>Cremación Fetal</option>
          <option value='todos'>Todos</option>
        </select>
        <input
          id='busqueda'
          placeholder='Filtro de busqueda en la tabla'
          className='form-control'
          onChange={onChangeFilter}
          style={{ display: visiblePicker != 'none' ? 'none' : 'block' }}
          disabled={disableFilter == true ? true : false}
        ></input>
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

        <div style={{ display: 'contents' }}>
          <button type='button' onClick={busquedaFun} style={{ backgroundColor: 'white', width: '85px' }}>
            Buscar datos
          </button>
        </div>
      </div>
      <div style={{ display: visibleGrid == 'none' ? 'none' : 'contents' }}>
        <PageHeaderComponent title='Maestro detalle' subTitle='Consulte el trámite de los certificados. ' />
        <Tabs>
          <TabPane tab='' key='1'>
            <Gridview data={grid} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default GridTipoLicencia;
