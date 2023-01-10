import { BandejaFuncionarios } from 'app/aguasconsumo/Components/BandejaFuncionarios';
import { BandejaCiudadanos } from 'app/aguasconsumo/Components/BandejaCiudadanos';
import { authProvider } from 'app/shared/utils/authprovider.util';
import React, { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import Tabs from 'antd/es/tabs';


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
      const subred = await api.getSubredes();
      localStorage.setItem('subredes', JSON.stringify(subred));

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
    const usuario = api.getIdUsuario();
    if (
      permiso?.rol === 'Ciudadano'
      //|| permiso?.rol === 'AdminTI'
    ) {

      //const resp = await api.getSolicitudesUsuario(usuario, 'usuario');
      const resp = await api.getSolicitudesUsuario();
      //const datossolucionados: any = await api.getSolicitudesUsuario(usuario, 'usuario');
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

        const subredes: any = JSON.parse(localStorage.getItem('subredes') + "");


        let subred: any = null
        for (let index = 0; index < subredes.length; index++) {

          if (usuario === subredes[index].idUsuario) {
            subred = subredes[index].idSubRed;
            break;

          }
        }

        // const datos = await api.getSolicitudesUsuario(subred !== null ? subred : '00000000-0000-0000-0000-000000000000', 'subred');
        const datos = await api.getSolicitudesUsuario();
        const datossolucionados: any = await api.getSolicitudesUsuario();
        //const datossolucionados: any = await api.getSolicitudesUsuario(subred !== null ? subred : '00000000-0000-0000-0000-000000000000', 'subred');

        const filtrado = datossolucionados.filter(function (f: { idEstado: string }) {
          return (
            f.idEstado == '2e8808af-a294-4cde-8e9c-9a78b5172119' || //aprobado
            f.idEstado == '2a31eb34-2aa0-428b-b8ef-a86683d8bb8d' || //cerrado
            f.idEstado == '7e2eaa50-f22f-4798-840d-5b98048d38a9' //anulado
          );
        });

        const filtradodatos = datos.filter(function (f: { idTipodeSolicitud: string }) {
          return (
            f.idTipodeSolicitud == 'b1ba9304-c16b-43f0-9afa-e92d7b7f4df6' ||//adjuntar documento visita
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
          //const datos = await api.getSolicitudesUsuario(usuario, 'asignado');
          //const datossolucionados: any = await api.getSolicitudesUsuario(usuario, 'asignado');

          const datos = await api.getSolicitudesUsuario();
          const datossolucionados: any = await api.getSolicitudesUsuario();

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
              f.idTipodeSolicitud != 'b1ba9304-c16b-43f0-9afa-e92d7b7f3df9' && //Primer Registro
              f.idTipodeSolicitud != '8ca363c0-66aa-4273-8e63-ce3eac234857' && // Gestion Coordinador
              f.idTipodeSolicitud != ' 5290025a-0967-417a-9737-fa5eae85d97b' //Gestion Subdirector
            );
          });

          setdatossolucionadosusuario(filtrado);
          setnotificaciones(filtradonotificaciones);
          sethistoriconotificaciones(filtrado);
          setdatosusuario(filtradodatos);

          //const resp = await api.getSolicitudesUsuario('B1BA9304-C16B-43F0-9AFA-E92D7B7F3DF9', 'tipo');
          const resp = await api.getSolicitudesUsuario();

          setGrid(resp);
        } else {
          //const resp = await api.getSolicitudesUsuario('5290025A-0967-417A-9737-FA5EAE85D97B', 'tipo');
          const resp = await api.getSolicitudesUsuario();
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
          <BandejaFuncionarios
            data={grid}
            datosusuario={datosusuario}
            datossolucionados={datossolucionadosusuario}
            notificaciones={notificaciones}
            historico={historiconotificaciones}
          />
        ) : (
          <BandejaCiudadanos data={grid} datossolucionados={datossolucionadosusuario} />
        )}
      </Tabs>
    </div>
  );
};

export default RedireccionarBandeja;
