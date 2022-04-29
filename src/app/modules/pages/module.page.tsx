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
import { IRoles } from 'app/Models/IRoles';
import { store } from 'app/redux/app.reducers';
import { ResetGrid } from 'app/redux/Grid/grid.actions';

const ModulePage = () => {
  const history = useHistory();
  const [roles, setroles] = useState<IRoles[]>();
  const [info, setinfo] = useState<any>();
  const [validacioninfo, setvalidacioninfo] = useState<any>(false);
  const { name, userName } = authProvider.getAccount();
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const onPersonNatural = () => history.push('/registro/Natural');
  const onPersonJuridica = () => history.push('/registro/Juridico');

  const getListas = useCallback(
    async () => {
      const mysRoles = await api.GetRoles();
      //solo era para permitir volver a registrar sin necesidad de crear otro correo(prueba)

      const validar: string = mysRoles[0].codigoUsuario;

      if (validar == '8f779d2f-9fc9-471e-a902-7ed8d49bf1da') {
        setroles([]);
        console.log('entro');
      } else {
        setroles(mysRoles);
      }

      setroles(mysRoles);
      const idUser = await api.getCodeUser();
      const resp = await api.GetInformationUser(idUser);

      if (resp == undefined) {
        setvalidacioninfo(name);
      } else {
        if (resp.tipoIdentificacion == 5) {
          setvalidacioninfo(resp.razonSocial);
        } else {
          setvalidacioninfo(resp.fullName);
        }
      }
      setinfo(resp);
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
  console.log(roles?.length, +'ROLES');
  return (
    <div className='fadeInTop container-fluid'>
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
