// Antd
import Tabs from 'antd/es/tabs';

// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { FetalForm } from 'app/modules/licencia/components/form/fetal.form';
import App from '../validarCovid/validar';

// Otros componentes
const { TabPane } = Tabs;

const CremacionFetalPage = () => {
  function mostrarPopUp(): boolean {
    let bandera = true;

    const festivos = [
      {
        fecha: {
          mes: 1,
          dia: 1
        },
        nombre: 'Año nuevo'
      },
      {
        fecha: {
          mes: 5,
          dia: 1
        },
        nombre: 'Día del Trabajo'
      },
      {
        fecha: {
          mes: 7,
          dia: 20
        },
        nombre: 'Día de la Independencia de Colombia'
      },
      {
        fecha: {
          mes: 8,
          dia: 7
        },
        nombre: 'Batalla de Boyacá'
      },
      {
        fecha: {
          mes: 12,
          dia: 8
        },
        nombre: 'Día de la Inmaculada Concepción'
      },
      {
        fecha: {
          mes: 12,
          dia: 25
        },
        nombre: 'Navidad'
      }
    ];

    function isHoliday(): boolean {
      let bandera = false;
      let hoy = new Date();

      for (let index = 0; index < festivos.length; index++) {
        if (festivos[index].fecha.mes - 1 == hoy.getMonth() && festivos[index].fecha.dia == hoy.getDate()) {
          bandera = true;
        }
      }
      return bandera;
    }

    let ahora = new Date();
    let dia = ahora.getDate();
    let mes = ahora.getMonth();
    let año = ahora.getFullYear();

    const horaInicialSemana = new Date(año, mes, dia, 7, 0, 0);
    const horaFinalSemana = new Date(año, mes, dia, 15, 30, 0);
    const horaInicialFinSemana = new Date(año, mes, dia, 8, 0, 0);
    const horaFinalFinSemana = new Date(año, mes, dia, 12, 0, 0);

    if ((ahora.getDay() != 1 || ahora.getDay() != 7) && !isHoliday()) {
      if (ahora.getTime() >= horaInicialSemana.getTime() && ahora.getTime() <= horaFinalSemana.getTime()) {
        bandera = false;
      } else {
        bandera = true;
      }
    } else {
      if (ahora.getTime() >= horaInicialFinSemana.getTime() && ahora.getTime() <= horaFinalFinSemana.getTime()) {
        bandera = false;
      } else {
        bandera = true;
      }
    }

    return bandera;
  }

  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent
        title='Licencia Cremación - Fetal'
        subTitle='Consulte el trámite de los certificados o registre una nueva solicitud.'
      />

      <Tabs>
        {/*         <TabPane tab='Certificados' key='1'>
          <div className='card card-body py-5 mb-4 fadeInTop'>
            Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table
            craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl
            cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr,
            vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts
            beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui
            sapiente accusamus tattooed echo park.
          </div>
        </TabPane> */}
        <TabPane tab='Registro' key='1'>
          <FetalForm tipoLicencia='Cremación' tramite='f4c4f874-1322-48ec-b8a8-3b0cac6fca8e' />
          {mostrarPopUp() && <App></App>}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CremacionFetalPage;
