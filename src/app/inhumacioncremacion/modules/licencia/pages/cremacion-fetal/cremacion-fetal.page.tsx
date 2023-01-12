// Antd
import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { FetalForm } from 'app/inhumacioncremacion/modules/licencia/components/form/fetal.form';
import App from '../validarCovid/validar';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { ApiService } from 'app/services/Apis.service';
import { useCallback, useEffect, useState } from 'react';

// Otros componentes
const { TabPane } = Tabs;

const CremacionFetalPage = () => {
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
        title='Licencia Cremación - Fetal'
        subTitle='Consulte el trámite de los certificados o registre una nueva solicitud.'
      />
      <p id='ancla-2'></p>
      <Tabs>
        {/*         <TabPane tab='Certificados' key='1'>
          <div className='card card-body py-5 mb-4 fadeInTop'>
            Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table
            craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl
            cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr,
            vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts
            beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui
            sapiente accusamus tattooed echo park.
          </div>
        </TabPane> */}
        <TabPane tab='Registro' key='1'>
          <FetalForm tipoLicencia='Cremación' tramite='f4c4f874-1322-48ec-b8a8-3b0cac6fca8e' />
          {localStorage.getItem('horario') === 'habilitar' && (<App origen={'solicitud'} metodo={null}></App>)}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CremacionFetalPage;
