import { Bandeja } from 'app/aguasconsumo/Components/Bandeja';
import { BandejaU } from 'app/aguasconsumo/Components/BandejaU';
//import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { IRoles } from 'app/inhumacioncremacion/Models/IRoles';
import { ApiService } from 'app/services/Apis.service';
import Tabs from 'antd/es/tabs';
import { authProvider } from 'app/shared/utils/authprovider.util';
import React, { useCallback, useEffect, useState } from 'react';
import { setgid } from 'process';

// Otros componentes

const RedireccionarBandeja: React.FC<any> = (props: any) => {
  const [roles, setroles] = useState<IRoles[]>([]);

  const [bandeja, setBandeja] = useState<boolean>(false);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [grid, setGrid] = useState<any[]>([]);

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
      const resp = await api.getSolicitudesUsuario();
      setGrid(resp);
      setBandeja(false);
    } else {
      let arraydatos = [];
      const resp = await api.getSolicitudesByTipoSolicitud('8F5B3DA8-1CD1-4E6C-874C-501245AE9279');
      setGrid(resp);
      setBandeja(true);
    }
  };
  const { TabPane } = Tabs;

  return (
    <div className='fadeInTop container-fluid'>
      <Tabs>{bandeja ? <Bandeja data={grid} /> : <BandejaU data={grid} />}</Tabs>
    </div>
  );
};

export default RedireccionarBandeja;
