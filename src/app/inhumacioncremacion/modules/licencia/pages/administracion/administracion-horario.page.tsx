// Antd
import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { HorariosGestion } from 'app/inhumacioncremacion/modules/licencia/components/form/horarios.form';
import { EmergenciaSanitaria } from 'app/inhumacioncremacion/modules/licencia/components/form/emergenciasanitaria.form';

// Otros componentes
const { TabPane } = Tabs;

const PruebaPage = () => {
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent title='Gestión de Variables del Sistema' />

      <Tabs>
        <TabPane tab='Gestión de Variables del Sistema' key='1'>
          <div id='accordion' className='mt-3'>
            <div className='card'>
              <div className='card-header' id='heading-2'>
                <h5 className='mb-0'>
                  <a
                    className='collapsed'
                    role='button'
                    data-toggle='collapse'
                    href='#collapse-1'
                    aria-expanded='false'
                    aria-controls='collapse-2'
                  >
                    Emergencia Sanitaria
                  </a>
                </h5>
              </div>
              <div id='collapse-1' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                <div className='fadeInRight d-block'>
                  <EmergenciaSanitaria props={1} />;

                </div>
              </div>
            </div>
          </div>
          <div id='accordion' className='mt-3'>
            <div className='card'>
              <div className='card-header' id='heading-2'>
                <h5 className='mb-0'>
                  <a
                    className='collapsed'
                    role='button'
                    data-toggle='collapse'
                    href='#collapse-2'
                    aria-expanded='false'
                    aria-controls='collapse-2'
                  >
                    Horarios de Atencion
                  </a>
                </h5>
              </div>
              <div id='collapse-2' className='collapse' data-parent='#accordion' aria-labelledby='heading-2'>
                <div className='fadeInRight d-block'>
                  <HorariosGestion props={1} />;

                </div>
              </div>
            </div>
          </div>



        </TabPane>
      </Tabs>
    </div>
  );
};

export default PruebaPage;
