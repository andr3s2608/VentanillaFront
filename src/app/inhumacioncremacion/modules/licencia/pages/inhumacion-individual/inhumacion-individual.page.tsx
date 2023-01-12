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



  const getListas = useCallback(async () => {
    await GetValidateRol();
    localStorage.setItem('horario', 'habilitar')

  }, []);



  const GetValidateRol = async () => {

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
          {localStorage.getItem('horario') === 'habilitar' && (<App origen={'solicitud'} metodo={null}></App>)}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default InhumacionIndividualPage;
