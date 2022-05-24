// Antd
import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { ValidarDocumentos } from 'app/modules/licencia/components/form/validaciondocumentos.form';

// Otros componentes
const { TabPane } = Tabs;

const PruebaPage = () => {
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent title='Validar Tramite' />

      <Tabs>
        <TabPane tab='Registro' key='1'>
          <ValidarDocumentos props={1} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PruebaPage;
