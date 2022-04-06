import { Grid } from 'antd';
import Tabs from 'antd/es/tabs';
import { IRoles } from 'app/Models/IRoles';
import { ApiService } from 'app/services/Apis.service';
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { Gridview } from 'app/shared/components/table';
import { authProvider } from 'app/shared/utils/authprovider.util';
import React, { useCallback, useEffect, useState } from 'react';

const { TabPane } = Tabs;

const GridTipoLicencia: React.FC<any> = (props: any) => {
  const [grid, setGrid] = useState<any[]>([]);
  const [roles, setroles] = useState<IRoles[]>([]);

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

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
      const resp = await api.GetEstadoSolicitud();
      setGrid(resp);
    }
    if (permiso?.rol === 'Funcionario') {
      let arraydatos = [];
      const resp = await api.getallbyEstado('FDCEA488-2EA7-4485-B706-A2B96A86FFDF');

      setGrid(resp);
    }
  };

  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent title='Maestro detalle' subTitle='Consulte el trámite de los certificados.' />

      <Tabs>
        <TabPane tab='' key='1'>
          <Gridview data={grid} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default GridTipoLicencia;
