import { Form } from 'antd';
import Tabs from 'antd/es/tabs';

import { IRoles } from 'app/inhumacioncremacion/Models/IRoles';
import { ApiService } from 'app/services/Apis.service';
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { Gridview } from 'app/shared/components/table';
import { authProvider } from 'app/shared/utils/authprovider.util';
import React, { useCallback, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { DatepickerComponent } from 'app/shared/components/inputs/datepicker.component';
import moment from 'moment';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import Input from 'antd/es/input/Input';
import Button from 'antd/es/button/button';

const { TabPane } = Tabs;

const GridTipoLicencia: React.FC<any> = (props: any) => {
  const [grid, setGrid] = useState<any[]>([]);
  const [espera, setespera] = useState<any>();
  const [mostrar, setmostrar] = useState<boolean>(false);
  const [allData, setAllData] = useState<any[]>([]);
  const [roles, setroles] = useState<IRoles[]>([]);

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [selectedOption, setSelectedOption] = useState<String>();
  const [visibleGrid, setVisibleGrid] = useState<String>();
  const [visiblePicker, setVisiblePicker] = useState<String>();
  const [dateSelectedPicker, setDate] = useState<Date>();
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


    if (permiso?.rol === 'Ciudadano'
      || permiso?.rol === 'MedicinaLegal'
      //|| permiso?.rol === 'AdminTI'
    ) {

      const resp: any = await api.GetEstadoSolicitudNuevoCambio();
      localStorage.setItem('tablainhcrem', JSON.stringify(resp));
      setGrid(resp);
      setespera(resp);
      setAllData(resp);
      setmostrar(true);
      setVisibleGrid('contents');
    } else {
      // const resp = await api.getallbyEstado('FDCEA488-2EA7-4485-B706-A2B96A86FFDF');
      const resp = await api.getallrequesttovalidate();
      localStorage.setItem('tablainhcrem', JSON.stringify(resp));
      setmostrar(true);
      setGrid(resp);
      setespera(resp);
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
  function changeValuePicker(event: any) { }
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
          return solicitud.toUpperCase().trim().includes(filtro.toUpperCase().trim());
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
        if (dateSelectedPicker != undefined && dateSelectedPicker.toString() != 'Invalid Date') {
          const resultFilterFec = allData.filter(function (f) {
            // var fecha = new Date(dateSelectedPicker == undefined ? new Date() : dateSelectedPicker.toString());
            return new Date(f.fechaSolicitud).toISOString().slice(0, 10) == dateSelectedPicker.toISOString().slice(0, 10);
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

  const RefrescarBandeja = async () => {
    setespera(undefined);

    await GetValidateRol(roles);

    // window.location.reload();

    //history.push('/tramites-servicios');
  };


  return (
    <div className='container-fluid mt-5  fadeInTop '>
      <PageHeaderComponent
        title='Listado de Solicitudes Inhumación-Cremación'
        subTitle='Seleccione el filtro de busqueda para enlistar las solicitudes'
      />
      <div className='card'>
        <div className='card-body'>
          <div className='row' style={{ marginTop: '-8px' }}>
            <div className='col-lg-12 col-sm-12 col-md-12'>
              <div style={{ display: visibleGrid == 'none' ? 'none' : 'contents' }}>
                <Tabs style={{ border: 'none' }}>
                  <TabPane tab='' key='1'>
                    {mostrar && (<Button type='primary' style={{ width: 150 }} onClick={RefrescarBandeja}>
                      Refrescar Bandeja
                    </Button>)}

                    {espera != undefined && (<Gridview data={grid} />)}
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
