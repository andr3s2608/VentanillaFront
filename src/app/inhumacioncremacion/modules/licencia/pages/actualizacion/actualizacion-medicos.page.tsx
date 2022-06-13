import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { ModificarMedico } from 'app/inhumacioncremacion/modules/licencia/components/form/modificarmedicos.form';

// Otros componentes
const { TabPane } = Tabs;

const PruebaPage = () => {
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent title='Actualizar Datos' />

      <Tabs>
        <TabPane tab='Actualizar Datos de Medico' key='1'>
          <ModificarMedico props={1} />;
        </TabPane>
      </Tabs>
    </div>
  );
};
//
export default PruebaPage;
