import { Grid } from 'antd';
import Tabs from 'antd/es/tabs';
import { IRoles } from 'app/Models/IRoles';
import { ApiService } from 'app/services/Apis.service';
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { Gridview } from 'app/shared/components/table';
import { authProvider } from 'app/shared/utils/authprovider.util';
import React, { useCallback, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ConsoleSqlOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const GridTipoLicencia: React.FC<any> = (props: any) => {
  const [grid, setGrid] = useState<any[]>([]);
  const [roles, setroles] = useState<IRoles[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [search, setSearch] = React.useState('');
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const [selectedOption, setSelectedOption] = useState<String>();
  const [visibleGrid, setVisibleGrid] = useState<String>();
  const [FilterText, setFilterText] = useState<String>();
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

      console.log('DATOS');
      console.log(resp);
      //setGrid(resp);
      setAllData(resp);
      setVisibleGrid('none');
    }
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
    setSelectedOption(value);
  };

  function onChangeFilter(event: any) {
    setFilterText(event.target.value);
  }

  function busquedaFun() {
    var input;
    console.log('Filtro ahora ----' + FilterText);
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
          return f.noIdentificacionSolicitante == FilterText;
        });
        setGrid(resultFilterDoc);
        setVisibleGrid('contents');
        break;
      case 'funOnombre':
        const resultFilterNom = allData.filter(function (f) {
          return f.razonSocialSolicitante == FilterText;
        });
        setGrid(resultFilterNom);
        setVisibleGrid('contents');
        break;
      case 'todos':
        setGrid(allData);
        setVisibleGrid('contents');
        break;
      case 'fechaReg':
        //FALTA IMPLEMENTAR PARA QUE CUANDO SE SELECCIONE FECHA REG MUESTRE UN CALENDARIO... FALTA REALIZAR ESTE PUNTO
        break;
      default:
        setVisibleGrid('none');
        break;
    }
    /*
    if (event.target.value == 'todos') {
      setVisibleGrid('none');
    } else {
      setVisibleGrid('contents');
    }*/
    /*
    var input, filter, table, tr, td, td1, td2, td3, i, txtValue, txtValue1, txtValue2, txtValue3;
    input = document.getElementById('busqueda');
    filter = event.target.value;
    table = document.getElementById('tableGen');
    console.log('tabla ---' + table);
    tr = table?.getElementsByTagName('tr');
    console.log('Columna-----' + tr);
    if (tr != null) {
      console.log('Entro a la fila');
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName('td')[0];
        td1 = tr[i].getElementsByTagName('td')[1];
        td2 = tr[i].getElementsByTagName('td')[2];
        td3 = tr[i].getElementsByTagName('td')[3];
        if (td || td1 || td2 || td3) {
          txtValue = td.textContent || td.innerText;
          txtValue1 = td1.textContent || td1.innerText;
          txtValue2 = td2.textContent || td2.innerText;
          txtValue3 = td3.textContent || td3.innerText;
          if (
            txtValue.toUpperCase().includes(filter.toUpperCase()) ||
            txtValue1.toUpperCase().includes(filter.toUpperCase()) ||
            txtValue2.toUpperCase().includes(filter.toUpperCase()) ||
            txtValue3.toUpperCase().includes(filter.toUpperCase())
          ) {
            tr[i].style.display = '';
            console.log('ENCONTRO FILA');
          } else {
            console.log('No encontro');
            tr[i].style.display = 'none';
          }
        }
      }
    }*/
  }

  return (
    <div className='card card-body py-5 mb-4 fadeInTop'>
      <div>
        <input id='busqueda' placeholder='Filtro de busqueda en la tabla' height='100%' onChange={onChangeFilter}></input>
        <select
          name='selection'
          id='filter'
          onChange={selectChange}
          className='dropdown-menu d-block position-static pt-0 mx-0 rounded-3 shadow overflow-hidden w-280px'
        >
          <option selected disabled>
            Seleccione una opción.
          </option>
          <option value='idSol'>Id Solicitud</option>
          <option value='docFallec'>Documento del fallecido</option>
          <option value='funOnombre'>Funeraria o Nombre</option>
          <option value='fechaReg'>Fecha de registro</option>
          <option value='todos'>Todos</option>
        </select>
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
