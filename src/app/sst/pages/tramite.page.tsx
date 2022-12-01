import {PageHeaderComponent} from '../../shared/components/page-header.component';
import Tabs from 'antd/es/tabs';
import {IndividualForm} from '../../inhumacioncremacion/modules/licencia/components/form/individual.form';
import {TramiteForm} from '../component/form/tramite.form';
import App from '../../inhumacioncremacion/modules/licencia/pages/validarCovid/validar';
import Swal from 'sweetalert2';
import {useEffect} from 'react';

// Otros componentes
const { TabPane } = Tabs;

const popInicial = () => {
  Swal.fire({
    icon: 'info',
    title: 'Estimado Ciudadano',
    text: 'Para su comodidad realice el trámite en el ente territorial donde reside o realizo sus estudios, de lo contrario podrá ser anulado.',
  });
};

const TramitePage = () => {

  useEffect(() => {
    popInicial();
  }, []);

  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent
        title='Licencia para prestación de servicios en Seguridad y Salud en el Trabajo'
        subTitle='Consulte el trámite de los certificados o registre una nueva solicitud.'
      />
      <p id='ancla-1'/>
      <Tabs>
        <TabPane tab='Registro' key='1'>
          <TramiteForm/>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TramitePage;
