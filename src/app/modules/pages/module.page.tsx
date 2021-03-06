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
      /*
      const validar: string = mysRoles[0].codigoUsuario;
      console.log('validar ' + validar);
      if (validar == 'e2d9efd7-de49-46e3-9782-36e2aee6270f') {
        console.log('entro');
        setroles([]);
      } else {
        console.log('entro2');
        setroles(mysRoles);
      }
      */

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

  return (
    <div className='fadeInTop container-fluid'>
      {roles?.length === 0 ? (
        <ModalComponent
          visible={true}
          title={`Registro ventanilla ??nica`}
          cancelButtonProps={{ hidden: true }}
          okButtonProps={{ hidden: true }}
          onCancel={onCancel}
          closable={false}
        >
          <PageHeaderComponent
            title={''}
            subTitle={`Tenga en cuenta, que para realizar nuestros tr??mites en l??nea, es obligatorio diligenciar previamente el
          REGISTRO DEL CIUDADANO (persona natural o jur??dica),
          el cual servir?? para la realizaci??n de tr??mites posteriores ante la Secretar??a Distrital de Salud.`}
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
        title={`??Bienvenido/a ${validacioninfo}!`}
        subTitle={`Bienvenido a la aplicaci??n ${projectInfo.name} desarrollada para ${projectInfo.developTo}.`}
        backIcon={null}
      />

      <div className='card card-body'>
        <h4 className='app-subtitle mt-3'>Tramites y Servicios</h4>

        <p>
          La Secretar??a Distrital de Salud, en concordancia con la Pol??tica de Gobierno Digital, ha dispuesto para la ciudadan??a,
          la ventanilla ??nica de tr??mites en l??nea, con el fin de hacer m??s ??gil y efectiva la interacci??n de nuestra instituci??n
          con los ciudadanos. A trav??s de esta ventanilla, cualquier ciudadano o instituci??n podr?? igualmente consultar la validez
          y veracidad de los actos administrativos que se generen por cada tr??mite, respaldando la gesti??n de la SDS bajo los
          principios de seguridad de la informaci??n.
        </p>
        <p>
          Tenga en cuenta, que para realizar nuestros tr??mites en l??nea, es obligatorio diligenciar previamente el &nbsp;
          <b>REGISTRO DEL CIUDADANO (persona natural o jur??dica)</b>, el cual servir?? para la realizaci??n de tr??mites posteriores
          ante la Secretar??a Distrital de Salud. Cualquier informaci??n adicional, consulta o dificultad frente a la realizaci??n de
          sus tr??mites en l??nea, podr?? escribirnos al correo electr??nico &nbsp;
          <a href='mailto:contactenos@saludcapital.gov.co'>contactenos@saludcapital.gov.co</a>.
        </p>
      </div>
    </div>
  );
};

export default ModulePage;
