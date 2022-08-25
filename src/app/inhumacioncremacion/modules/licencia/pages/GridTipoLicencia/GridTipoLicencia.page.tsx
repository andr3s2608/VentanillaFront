import { Form } from 'antd';
import Tabs from 'antd/es/tabs';

import { IRoles } from 'app/inhumacioncremacion/Models/IRoles';
import { ApiService } from 'app/services/Apis.service';
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { Gridview } from 'app/shared/components/table';
import { authProvider } from 'app/shared/utils/authprovider.util';
import React, { useCallback, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


const { TabPane } = Tabs;

const GridTipoLicencia: React.FC<any> = (props: any) => {
  const [grid, setGrid] = useState<any[]>([]);

  const [roles, setroles] = useState<IRoles[]>([]);

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const [visibleGrid, setVisibleGrid] = useState<String>();

  ;
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
      localStorage.setItem('tablainhcrem', JSON.stringify(resp));
      setGrid(resp);
      setVisibleGrid('contents');
    } else {
      let arraydatos = [];
      const resp = await api.getallbyEstado('FDCEA488-2EA7-4485-B706-A2B96A86FFDF');
      localStorage.setItem('tablainhcrem', JSON.stringify(resp));
      setGrid(resp);
      setVisibleGrid('contents');
    }



  };



  return (
    <div className='container-fluid mt-5  fadeInTop '>
      <PageHeaderComponent
        title='Listado de Solicitudes Inhumación-Cremación'
      />
      <div className='card'>
        <div className='card-body'>
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
