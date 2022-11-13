// Antd
import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { Auditoria } from 'app/inhumacioncremacion/modules/licencia/components/form/auditoria.form';

// Otros componentes
const { TabPane } = Tabs;

const PruebaPage = () => {
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent title='Auditoría y Seguimiento' />

      <Tabs>
        <TabPane tab='Seguimiento' key='1'>
          <Auditoria />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PruebaPage;
