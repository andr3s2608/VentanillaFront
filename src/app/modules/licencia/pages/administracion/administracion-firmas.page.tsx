// Antd
import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { GestionFirma } from 'app/modules/licencia/components/form/firmas.form';
import { ValidationForm } from 'app/modules/licencia/components/form/Validation.form';

// Otros componentes
const { TabPane } = Tabs;

const PruebaPage = () => {
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent title='Gestión de Firmas' />

      <Tabs>
        <TabPane tab='Gestión de Firmas' key='1'>
          <GestionFirma props={1} />;
        </TabPane>
      </Tabs>
    </div>
  );
};
//
export default PruebaPage;
