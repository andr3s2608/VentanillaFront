// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';

// Utilidades
import { projectInfo } from 'app/shared/utils/constants.util';
import { authProvider } from 'app/shared/utils/authprovider.util';

const ModulePage = () => {
  const { name, userName } = authProvider.getAccount();
  return (
    <div className='fadeInTop container-fluid'>
      <PageHeaderComponent
        title={`¡Bienvenido/a ${name || userName}!`}
        subTitle={`Bienvenido a la aplicación ${projectInfo.name} desarrollada para ${projectInfo.developTo}.`}
        backIcon={null}
      />

      <div className='card card-body'>
        <h4 className='app-subtitle mt-3'>Tramites y Servicios</h4>

        <p>
          La Secretaría Distrital de Salud, en concordancia con la Política de Gobierno Digital, ha dispuesto para la ciudadanía,
          la ventanilla única de trámites en línea, con el fin de hacer más ágil y efectiva la interacción de nuestra institución
          con los ciudadanos. A través de esta ventanilla, cualquier ciudadano o institución podrá igualmente consultar la validez
          y veracidad de los actos administrativos que se generen por cada trámite, respaldando la gestión de la SDS bajo los
          principios de seguridad de la información.
        </p>
        <p>
          Tenga en cuenta, que para realizar nuestros trámites en línea, es obligatorio diligenciar previamente el &nbsp;
          <b>REGISTRO DEL CIUDADANO (persona natural o jurídica)</b>, el cual servirá para la realización de trámites posteriores
          ante la Secretaría Distrital de Salud. Cualquier información adicional, consulta o dificultad frente a la realización de
          sus trámites en línea, podrá escribirnos al correo electrónico &nbsp;
          <a href='mailto:contactenos@saludcapital.gov.co'>contactenos@saludcapital.gov.co</a>.
        </p>
      </div>
    </div>
  );
};

export default ModulePage;
