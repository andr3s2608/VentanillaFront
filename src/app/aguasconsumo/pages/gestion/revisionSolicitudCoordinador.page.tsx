import { RevisarSc } from 'app/aguasconsumo/Components/RevisarSc';
import { RevisarSv } from 'app/aguasconsumo/Components/RevisarSv';

import { IRoles } from 'app/inhumacioncremacion/Models/IRoles';
import { ApiService } from 'app/services/Apis.service';
import Tabs from 'antd/es/tabs';
import { authProvider } from 'app/shared/utils/authprovider.util';
import React, { useCallback, useEffect, useState } from 'react';

// Otros componentes

const RevisarSolicitudCoordinador: React.FC<any> = (props: any) => {
  const [roles, setroles] = useState<IRoles[]>([]);

  const [bandeja, setBandeja] = useState<boolean>(false);
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

    if (
      permiso?.rol === 'Coordinador'
      //|| permiso?.rol === 'AdminTI'
    ) {
      setBandeja(false);
    } else {
      setBandeja(true);
    }
  };
  const { TabPane } = Tabs;

  return (
    <div className='fadeInTop container-fluid'>
      <Tabs>{bandeja ? <RevisarSv /> : <RevisarSc />}</Tabs>
    </div>
  );
};

export default RevisarSolicitudCoordinador;
