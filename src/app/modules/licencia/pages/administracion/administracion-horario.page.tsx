// Antd
import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';

// Otros componentes
const { TabPane } = Tabs;

const PruebaPage = () => {
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent title='Gestion de Horario de Atención' />

      <Tabs>
        <TabPane tab='Gestion de Horario de Atención' key='1'></TabPane>
      </Tabs>
    </div>
  );
};

export default PruebaPage;
