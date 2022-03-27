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
        console.log('TERMINOOOO');
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
      const resp = await api.GetAllLicencias();
      //modificar api licencias para traer solo los datos necesarios

      var stringData: string = resp.reduce((result: any, item: any) => {
        return `${result}${item.idSolicitud}|`;
      }, '');

      /*
      for (var i = 0; i < resp.length; i++) {
        var posicion = stringData.indexOf('|');
        var cadena: any = stringData.substring(0, posicion);
        //console.log('id:', cadena, '///', 'salta?');

        let solicitudes = await api.getLicencia(cadena);

        console.log('cadena', solicitudes);
        cadena = stringData;
        stringData = cadena.substring(posicion + 1, stringData.length);

        //console.log('stringdatanueva', stringData);
        arraydatos.push(solicitudes);
        console.log('array', arraydatos);
      }
      console.log(arraydatos, 'datos ');
*/

      setGrid(resp);
    }
  };

  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent title='Maestro detalle' subTitle='Consulte el trámite de los certificados.' />

      <Tabs>
        <TabPane tab='' key='1'>
          <div className='card card-body py-5 mb-4 fadeInTop'>
            Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table
            craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl
            cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr,
            vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts
            beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui
            sapiente accusamus tattooed echo park.
          </div>
          <Gridview data={grid} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default GridTipoLicencia;
