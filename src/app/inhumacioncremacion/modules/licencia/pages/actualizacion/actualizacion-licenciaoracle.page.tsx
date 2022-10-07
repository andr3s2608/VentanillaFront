import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { ModificarLicencia } from 'app/inhumacioncremacion/modules/licencia/components/form/modificarlicenciasoracle.form';


// Otros componentes
const { TabPane } = Tabs;

const PruebaPage = () => {
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent title='Actualizar Datos' />

      <Tabs>
        <TabPane tab='Actualizar Datos de Licencia' key='1'>
          {<ModificarLicencia props={1} />}
        </TabPane>
      </Tabs>
    </div>
  );
};
//
export default PruebaPage;
