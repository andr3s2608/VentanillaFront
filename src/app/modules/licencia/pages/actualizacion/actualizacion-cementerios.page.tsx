import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { ModificarCementerio } from 'app/modules/licencia/components/form/modificarcementerios.form';

// Otros componentes
const { TabPane } = Tabs;

const PruebaPage = () => {
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent title='Actualizar Datos' />

      <Tabs>
        <TabPane tab='Actualizar Datos de Cementerios' key='1'>
          <ModificarCementerio props={1} />;
        </TabPane>
      </Tabs>
    </div>
  );
};
//
export default PruebaPage;
