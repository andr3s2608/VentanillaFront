// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';

// Utilidades
import { projectInfo } from 'app/shared/utils/constants.util';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { ModalComponent } from 'app/shared/components/modal.component';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';
import { ApiService } from 'app/services/Apis.service';
import { useCallback, useEffect, useState } from 'react';
import { IRoles } from 'app/inhumacioncremacion/Models/IRoles';

import { dominioService, ETipoDominio } from 'app/services/dominio.service';

const ModulePage = () => {
  const history = useHistory();
  const [roles, setroles] = useState<IRoles[]>();

  const [validacioninfo, setvalidacioninfo] = useState<any>('');
  const { name } = authProvider.getAccount();
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [banderaPolicaSeguridad, setBanderaPolicaSeguridad] = useState<boolean>(false);

  const onPersonNatural = () => history.push('/registro/Natural');
  const onPersonJuridica = () => history.push('/registro/Juridico');
  const onNoAutorizo = () => {
    setBanderaPolicaSeguridad(false);
    history.push('/');
  };

  const getListas = useCallback(
    async () => {
      const paises = await dominioService.get_type(ETipoDominio.Pais);
      const tiposdocumento = await dominioService.get_type(ETipoDominio['Tipo Documento']);
      const estadocivil = await dominioService.get_type(ETipoDominio['Estado Civil']);
      const nivel = await dominioService.get_type(ETipoDominio['Nivel Educativo']);
      const etnia = await dominioService.get_type(ETipoDominio.Etnia);
      const tipomuerte = await dominioService.get_type(ETipoDominio['Tipo de Muerte']);
      const departamentos = await dominioService.get_departamentos_colombia();
      const localidades = await dominioService.get_localidades_bogota();
      const municipiosbogota = await dominioService.get_all_municipios_by_departamento('31b870aa-6cd0-4128-96db-1f08afad7cdd');
      const roles = await api.GetRoles();
      const idUser = await api.getCodeUser();
      const infouser = await api.GetInformationUser(idUser);
      const subredes = await api.getSubredes();

      localStorage.setItem('paises', JSON.stringify(paises));
      localStorage.setItem('tipoid', JSON.stringify(tiposdocumento));
      localStorage.setItem('estadocivil', JSON.stringify(estadocivil));
      localStorage.setItem('nivel', JSON.stringify(nivel));
      localStorage.setItem('etnia', JSON.stringify(etnia));
      localStorage.setItem('tipomuerte', JSON.stringify(tipomuerte));
      localStorage.setItem('departamentos', JSON.stringify(departamentos));
      localStorage.setItem('localidades', JSON.stringify(localidades));
      localStorage.setItem('municipiosbogota', JSON.stringify(municipiosbogota));
      localStorage.setItem('roles', JSON.stringify(roles));
      localStorage.setItem('idUser', JSON.stringify(idUser));
      localStorage.setItem('infouser', JSON.stringify(infouser));
      localStorage.setItem('subredes', JSON.stringify(subredes));
      setroles(roles);

      if (infouser == undefined) {
        setvalidacioninfo(name);
      } else {
        if (infouser.razonSocial != null) {
          setvalidacioninfo(infouser.razonSocial);
        } else {
          setvalidacioninfo(infouser.fullName);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  //const getMenu = UpdateMenu();

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCancel = (): void => {};

  return (
    <div className='fadeInTop container-fluid'>
      {banderaPolicaSeguridad ? (
        <ModalComponent
          visible={banderaPolicaSeguridad}
          className='Política text-center'
          title={`Política protección de datos personales`}
          cancelButtonProps={{ hidden: true }}
          okButtonProps={{ hidden: true }}
          onCancel={onCancel}
          closable={false}
        >
          <PageHeaderComponent
            className='PageHeaderComponent text-justify'
            title={''}
            subTitle={`Autorizo en forma previa expresa e informada como titular de mis datos a la Secretaría Distrital de Salud y
            el Fondo Financiero Distrital de Salud, para hacer uso y tratamiento de mis datos personales de conformidad con lo previsto
            en el Decreto 1377 de 2013 que reglamenta la Ley 1581 de 2012. Los datos personales serán gestionados de forma segura y algunos
            tratamientos podrán ser realizados de manera directa o a través de encargados, El tratamiento de los datos personales por parte
            de la Secretaría Distrital de Salud se realizará dando cumplimiento a la Política de Privacidad y Protección de Datos personales
            que puede ser consultada en: `}
            backIcon={null}
          />
          <a
            className='H d-flex'
            style={{ marginTop: '-15px' }}
            href={'http://www.saludcapital.gov.co/Documents/Politica_Proteccion_Datos_P.pdf'}
            rel='noreferrer'
            target='_blank'
          >
            Política de Protección de Datos
          </a>
          <div className='d-flex justify-content-between mt-4'>
            <Button type='primary' htmlType='button' onClick={onNoAutorizo}>
              Autorizo
            </Button>
            <Button type='primary' htmlType='submit' onClick={onNoAutorizo}>
              No autorizo
            </Button>
          </div>
        </ModalComponent>
      ) : null}

      {roles?.length === 0 ? (
        <ModalComponent
          visible={true}
          title={`Registro ventanilla única`}
          cancelButtonProps={{ hidden: true }}
          okButtonProps={{ hidden: true }}
          onCancel={onCancel}
          closable={false}
        >
          <PageHeaderComponent
            title={''}
            subTitle={`Tenga en cuenta, que para realizar nuestros trámites en línea, es obligatorio diligenciar previamente el
          REGISTRO DEL CIUDADANO (persona natural o jurídica),
          el cual servirá para la realización de trámites posteriores ante la Secretaría Distrital de Salud.`}
            backIcon={null}
          />
          <div className='d-flex justify-content-between'>
            <Button type='primary' htmlType='button' onClick={onPersonNatural}>
              Registro persona natural
            </Button>
            <Button type='primary' htmlType='submit' onClick={onPersonJuridica}>
              Registro persona juridica
            </Button>
          </div>
        </ModalComponent>
      ) : null}

      <PageHeaderComponent
        title={`¡Bienvenido/a ${validacioninfo}!`}
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
