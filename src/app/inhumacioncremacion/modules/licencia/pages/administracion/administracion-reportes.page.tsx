// Antd
import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';

// Otros componentes
const { TabPane } = Tabs;

const PruebaPage = () => {
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent title='Gestión de Reportes' />

      <Tabs>
        <TabPane tab='Gestión de Reportes' key='1'></TabPane>
      </Tabs>
    </div>
  );
};

export default PruebaPage;
