// Antd
import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { ValidationForm } from 'app/modules/licencia/components/form/Validation.form';

// Otros componentes
const { TabPane } = Tabs;

const PruebaPage = () => {
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent title='Validar Tramite' />

      <Tabs>
        <TabPane tab='Registro' key='1'>
          <ValidationForm tipoLicencia='Inhumación' tramite='a289c362-e576-4962-962b-1c208afa0273' />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PruebaPage;
