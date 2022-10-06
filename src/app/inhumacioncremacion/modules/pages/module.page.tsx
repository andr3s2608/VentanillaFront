// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';

// Utilidades
import { projectInfo } from 'app/shared/utils/constants.util';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { ModalComponent } from 'app/shared/components/modal.component';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';
import { ApiService } from 'app/services/Apis.service';
import { useCallback, useContext, useEffect, useState } from 'react';
import { IRoles } from 'app/inhumacioncremacion/Models/IRoles';


import { dominioService, ETipoDominio } from 'app/services/dominio.service';
import Swal from 'sweetalert2';
import { ResetApplication } from 'app/redux/application/application.actions';
import { ChangeTheme } from 'app/Theme';

const ModulePage = () => {
  const history = useHistory();
  const [roles, setroles] = useState<IRoles[]>();

  const [validacioninfo, setvalidacioninfo] = useState<any>('');
  const { name } = authProvider.getAccount();
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [banderaPolicaSeguridad, setBanderaPolicaSeguridad] = useState<boolean>(false);

  //Aumentar y disminuir texto
  const [size, setSize] = useState(16);
  const styles = { fontSize: size };


  //Cambiar de tema oscuro y claro
  const [isDarkTheme, setIsSetDarkTheme] = useState(false);
  const onViewValue = () => {
    debugger;
    ChangeTheme();
  }

  const onPersonNatural = () => history.push('/registro/Natural');
  const onPersonJuridica = () => history.push('/registro/Juridico');

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
      const idUsuario = await api.getIdUsuario();

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

  //Funcion que permite aumentar o disminuir el tamaño de la
  const onCancel = (): void => { };
  function handleClick(symbol: string) {
    if (symbol === "+") setSize(size + 2);
    else if (symbol === "-") setSize(size - 2);
  }


  return (

    <div className='fadeInTop container-fluid ' style={{ position: 'relative' }}>
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

      <PageHeaderComponent style={styles}
        title={`¡Bienvenido/a ${validacioninfo}!`}
        subTitle={`Bienvenido a la aplicación ${projectInfo.name} desarrollada para ${projectInfo.developTo}.`}
        backIcon={null}
      />

      <div className='sidebar_help'>
        <ul className="social">
          <li><button className='btn ant-btn-primary' onClick={() => handleClick("+")}><span className='text'>+</span><i className="fa-solid fa-a ml-2"></i></button></li>
          <li><button style={{ marginTop: '-19px' }} className='btn ant-btn-primary' onClick={() => handleClick("-")}><span className='text'>-</span><i className="fa-solid fa-a ml-2"></i></button></li>
          <li><button onClick={onViewValue} style={{ marginTop: '-20px' }} className='btn ant-btn-primary'><i className="fa-sharp fa-solid fa-circle-half-stroke fa-lg"></i></button></li>
        </ul>
      </div>


      <div className='card card-body' >
        <span ><h4 className='app-subtitle mt-3' style={styles}><span>Tramites y Servicios</span></h4></span>


        <p style={styles} className="mt-2">
          <span >
            La Secretaría Distrital de Salud, en concordancia con la Política de Gobierno Digital, ha dispuesto para la ciudadanía,
            la ventanilla única de trámites en línea, con el fin de hacer más ágil y efectiva la interacción de nuestra institución
            con los ciudadanos. A través de esta ventanilla, cualquier ciudadano o institución podrá igualmente consultar la validez
            y veracidad de los actos administrativos que se generen por cada trámite, respaldando la gestión de la SDS bajo los
            principios de seguridad de la información.
          </span>
        </p>

        <p style={styles}>
          <span >
            Tenga en cuenta, que para realizar nuestros trámites en línea, es obligatorio diligenciar previamente el &nbsp;
            <b>REGISTRO DEL CIUDADANO (persona natural o jurídica)</b>, el cual servirá para la realización de trámites posteriores
            ante la Secretaría Distrital de Salud. Cualquier información adicional, consulta o dificultad frente a la realización de
            sus trámites en línea, podrá escribirnos al correo electrónico &nbsp;<br />
            <a className="enlace_inicio" style={styles} href='mailto:contactenos@saludcapital.gov.co'><span >contactenos@saludcapital.gov.co</span></a>.
          </span>
        </p>
      </div>

    </div>

  );
};

export default ModulePage;
