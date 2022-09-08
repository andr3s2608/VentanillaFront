import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { CambioLicencia } from 'app/inhumacioncremacion/modules/licencia/components/form/cambiolicencia.form';

// Otros componentes
const { TabPane } = Tabs;

const PruebaPage = () => {
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent title='Cambiar Licencia' />

      <Tabs>
        {<CambioLicencia props={1} />}

      </Tabs>
    </div>
  );
};
//
export default PruebaPage;