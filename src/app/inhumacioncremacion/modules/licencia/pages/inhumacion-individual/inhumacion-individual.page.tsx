// Antd
import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { IndividualForm } from 'app/inhumacioncremacion/modules/licencia/components/form/individual.form';
import App from '../validarCovid/validar';
import { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

// Otros componentes
const { TabPane } = Tabs;

const InhumacionIndividualPage = () => {
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [HIA_LV, setHIA_LV] = useState<string[]>(['0', '0', '0']);
  const [HFA_LV, setHFA_LV] = useState<string[]>(['23', '5', '9']);
  const [HIA_SD, setHIA_SD] = useState<string[]>(['0', '0', '0']);
  const [HFA_SD, setHFA_SD] = useState<string[]>(['23', '5', '9']);

  const getListas = useCallback(async () => {
    await GetValidateRol();
  }, []);

  function obtenerHora(hora: string): string[] {
    let aux = hora[0];

    let horario: string[] = ['', '', ''];

    if (aux == '0') {
      horario[0] = hora[1];
      horario[1] = hora[3];
      horario[2] = hora[4];
    } else {
      horario[0] = hora[0] + hora[1];
      horario[1] = hora[3];
      horario[2] = hora[4];
    }

    return horario;
  }

  const GetValidateRol = async () => {
    let HoraInicioAtencion_LV = await api.getCostante('5DF03735-503B-4D22-8169-E4FCDD19DA26');
    let HoraFinAtencion_LV = await api.getCostante('818AA32D-C90D-45D0-975F-486D069F7CB1');
    let HoraInicioAtencion_SD = await api.getCostante('CE62162E-5E79-4E05-AEDE-276B6C89D886');
    let HoraFinAtencion_SD = await api.getCostante('A196007F-BCCB-4160-B345-1F8605949E46');
    var aux1 = obtenerHora(HoraInicioAtencion_LV.valor);
    var aux2 = obtenerHora(HoraFinAtencion_LV.valor);
    var aux3 = obtenerHora(HoraInicioAtencion_SD.valor);
    var aux4 = obtenerHora(HoraFinAtencion_SD.valor);

    setHIA_LV(aux1);
    setHFA_LV(aux2);
    setHIA_SD(aux3);
    setHFA_SD(aux4);
  };

  useEffect(() => {
    getListas();
  }, []);
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent
        title='Licencia Inhumación - Individual'
        subTitle='Consulte el trámite de los certificados o registre una nueva solicitud.'
      />
      <p id='ancla-1'></p>
      <Tabs>
        <TabPane tab='Registro' key='1'>
          <IndividualForm tipoLicencia='Inhumación' tramite='a289c362-e576-4962-962b-1c208afa0273' />
          {<App origen={'solicitud'} metodo={null}></App>}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default InhumacionIndividualPage;
