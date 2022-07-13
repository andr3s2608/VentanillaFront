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
  const [datosusuario, setdatosusuario] = useState<any[]>([]);
  const [datossolucionadosusuario, setdatossolucionadosusuario] = useState<any[]>([]);

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

    if (permiso?.rol === 'Ciudadano' || permiso?.rol === 'AdminTI') {
      const resp = await api.getSolicitudesUsuario();

      const datossolucionados: any = await api.getSolicitudesUsuario();

      const filtrado = datossolucionados.filter(function (f: { idEstado: string }) {
        return (
          f.idEstado == '2e8808af-a294-4cde-8e9c-9a78b5172119' || //aprobado
          f.idEstado == '2a31eb34-2aa0-428b-b8ef-a86683d8bb8d' || //cerrado
          f.idEstado == '7e2eaa50-f22f-4798-840d-5b98048d38a9' //anulado
        );
      });

      setdatossolucionadosusuario(filtrado);
      setGrid(resp);
      setBandeja(false);
    } else {
      if (
        //permiso?.rol === 'AdminTI' ||
        permiso?.rol === 'Funcionario'
      ) {
        const datos = await api.GetSolicitudesUsuarioSubred();
        const datossolucionados: any = await api.GetSolicitudesUsuarioSubred();

        const filtrado = datossolucionados.filter(function (f: { idEstado: string }) {
          return (
            f.idEstado == '2e8808af-a294-4cde-8e9c-9a78b5172119' || //aprobado
            f.idEstado == '2a31eb34-2aa0-428b-b8ef-a86683d8bb8d' || //cerrado
            f.idEstado == '7e2eaa50-f22f-4798-840d-5b98048d38a9' //anulado
          );
        });

        setdatossolucionadosusuario(filtrado);
        setdatosusuario(datos);
      } else {
        console.log('entro');
        const datos = await api.getSolicitudesUsuarioAsignado();
        const datossolucionados: any = await api.getSolicitudesUsuarioAsignado();

        const filtrado = datossolucionados.filter(function (f: { idEstado: string }) {
          return (
            f.idEstado == '2e8808af-a294-4cde-8e9c-9a78b5172119' || //aprobado
            f.idEstado == '2a31eb34-2aa0-428b-b8ef-a86683d8bb8d' || //cerrado
            f.idEstado == '7e2eaa50-f22f-4798-840d-5b98048d38a9' //anulado
          );
        });

        setdatossolucionadosusuario(filtrado);
        setdatosusuario(datos);
      }

      const resp = await api.getSolicitudesByTipoSolicitud('B1BA9304-C16B-43F0-9AFA-E92D7B7F3DF9');

      setGrid(resp);

      setBandeja(true);
    }
  };
  const { TabPane } = Tabs;

  return (
    <div className='fadeInTop container-fluid'>
      <Tabs>
        {bandeja ? (
          <Bandeja data={grid} datosusuario={datosusuario} datossolucionados={datossolucionadosusuario} />
        ) : (
          <BandejaU data={grid} datossolucionados={datossolucionadosusuario} />
        )}
      </Tabs>
    </div>
  );
};

export default RedireccionarBandeja;
