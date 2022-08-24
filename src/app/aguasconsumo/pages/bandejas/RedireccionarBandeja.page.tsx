import { Bandeja } from 'app/aguasconsumo/Components/Bandeja';
import { BandejaU } from 'app/aguasconsumo/Components/BandejaU';
//import { PageHeaderComponent } from 'app/shared/components/page-header.component';
//import { IRoles } from 'app/inhumacioncremacion/Models/IRoles';
import { ApiService } from 'app/services/Apis.service';
import Tabs from 'antd/es/tabs';
import { authProvider } from 'app/shared/utils/authprovider.util';
import React, { useCallback, useEffect, useState } from 'react';
import { setgid } from 'process';

// Otros componentes

const RedireccionarBandeja: React.FC<any> = (props: any) => {
  const [roles, setroles] = useState<any[]>([]);

  const [bandeja, setBandeja] = useState<boolean>(false);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [grid, setGrid] = useState<any[]>([]);
  const [datosusuario, setdatosusuario] = useState<any[]>([]);
  const [datossolucionadosusuario, setdatossolucionadosusuario] = useState<any[]>([]);
  const [notificaciones, setnotificaciones] = useState<any[]>([]);
  const [historiconotificaciones, sethistoriconotificaciones] = useState<any[]>([]);

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

  const GetValidateRol = async (toRoles: any[]) => {
    const [permiso] = roles.length > 0 ? roles : toRoles;

    if (
      permiso?.rol === 'Ciudadano'
      //|| permiso?.rol === 'AdminTI'
    ) {
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
      if (permiso?.rol === 'AdminTI' || permiso?.rol === 'Funcionario') {
        const datos = await api.GetSolicitudesUsuarioSubred();
        const datossolucionados: any = await api.GetSolicitudesUsuarioSubred();

        const filtrado = datossolucionados.filter(function (f: { idEstado: string }) {
          return (
            f.idEstado == '2e8808af-a294-4cde-8e9c-9a78b5172119' || //aprobado
            f.idEstado == '2a31eb34-2aa0-428b-b8ef-a86683d8bb8d' || //cerrado
            f.idEstado == '7e2eaa50-f22f-4798-840d-5b98048d38a9' //anulado
          );
        });

        const filtradodatos = datos.filter(function (f: { idTipodeSolicitud: string }) {
          return (
            f.idTipodeSolicitud == '492e1c24-b2a4-45fd-8845-d9ac1e569928' || //Citacion
            f.idTipodeSolicitud == 'd33fbb9c-9f47-4015-bbe6-96ff43f0dde4' //Gestion Validador
          );
        });

        setdatossolucionadosusuario(filtrado);
        setdatosusuario(filtradodatos);
      } else {
        if (
          //permiso?.rol === 'AdminTI' ||
          permiso?.rol === 'Coordinador'
        ) {
          const datos = await api.getSolicitudesUsuarioAsignado();
          const datossolucionados: any = await api.getSolicitudesUsuarioAsignado();

          const filtrado = datossolucionados.filter(function (f: { idEstado: string }) {
            return (
              f.idEstado == '2e8808af-a294-4cde-8e9c-9a78b5172119' || //aprobado
              f.idEstado == '2a31eb34-2aa0-428b-b8ef-a86683d8bb8d' || //cerrado
              f.idEstado == '7e2eaa50-f22f-4798-840d-5b98048d38a9' //anulado
            );
          });

          const filtradodatos = datos.filter(function (f: { idTipodeSolicitud: string }) {
            return (
              f.idTipodeSolicitud == '8ca363c0-66aa-4273-8e63-ce3eac234857' //Gestion Coordinador
            );
          });

          const filtradonotificaciones = datos.filter(function (f: { idEstado: string; idTipodeSolicitud: string }) {
            return (
              f.idEstado != '2e8808af-a294-4cde-8e9c-9a78b5172119' && //aprobado
              f.idEstado != '2a31eb34-2aa0-428b-b8ef-a86683d8bb8d' && //cerrado
              f.idEstado != '7e2eaa50-f22f-4798-840d-5b98048d38a9' && //anulado
              f.idTipodeSolicitud != 'b1ba9304-c16b-43f0-9afa-e92d7b7f3df9' &&
              f.idTipodeSolicitud != '8ca363c0-66aa-4273-8e63-ce3eac234857' &&
              f.idTipodeSolicitud != ' 5290025a-0967-417a-9737-fa5eae85d97b'
            );
          });

          setdatossolucionadosusuario(filtrado);
          setnotificaciones(filtradonotificaciones);
          sethistoriconotificaciones(filtrado);
          setdatosusuario(filtradodatos);

          const resp = await api.getSolicitudesByTipoSolicitud('B1BA9304-C16B-43F0-9AFA-E92D7B7F3DF9');

          setGrid(resp);
        } else {
          const resp = await api.getSolicitudesByTipoSolicitud('5290025A-0967-417A-9737-FA5EAE85D97B');

          setGrid(resp);
        }
      }

      setBandeja(true);
    }
  };
  const { TabPane } = Tabs;

  return (
    <div className='fadeInTop container-fluid'>
      <Tabs>
        {bandeja ? (
          <Bandeja
            data={grid}
            datosusuario={datosusuario}
            datossolucionados={datossolucionadosusuario}
            notificaciones={notificaciones}
            historico={historiconotificaciones}
          />
        ) : (
          <BandejaU data={grid} datossolucionados={datossolucionadosusuario} />
        )}
      </Tabs>
    </div>
  );
};

export default RedireccionarBandeja;
