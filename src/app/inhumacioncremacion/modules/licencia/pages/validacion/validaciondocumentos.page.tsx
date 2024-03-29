// Antd
import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { ValidarDocumentos } from 'app/inhumacioncremacion/modules/licencia/components/form/validaciondocumentos.form';

// Otros componentes
const { TabPane } = Tabs;

const PruebaPage = () => {
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent title='Validar Documento' />

      <Tabs>
        <TabPane>
          <ValidarDocumentos props={1} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PruebaPage;
