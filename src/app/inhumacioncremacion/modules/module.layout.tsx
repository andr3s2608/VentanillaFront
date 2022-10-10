import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
//import { ThemeProvider } from "styled-components";

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { SetApplicationMenu } from 'app/redux/application/application.actions';
import { ToggleSideNav } from 'app/redux/ui/ui.actions';
import { AppState, store } from 'app/redux/app.reducers';
import { UIState } from 'app/redux/ui/ui.reducer';

// Antd
import Spin from 'antd/es/spin';
import Layout from 'antd/es/layout';
import BackTop from 'antd/es/back-top';

// Componentes
import { SidenavComponent } from 'app/shared/components/layout/sidenav.component';
import { NavbarComponent } from 'app/shared/components/layout/navbar.component';
import { FooterComponent } from 'app/shared/components/layout/footer.component';

// Módulos
import { ModuleRoutes } from './module.routes';

// Utils
import { projectInfo } from 'app/shared/utils/constants.util';

// Imágenes & Documentos
import LogoNegativo from '../../../../src/assets/images/brand/logo_alcaldia.png';
import { ApiService } from 'app/services/Apis.service';
import { MapperMenu } from 'app/shared/utils/MapperMenu';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { ResetGrid } from 'app/redux/Grid/grid.actions';
import { ModalComponent } from 'app/shared/components/modal.component';
import { PageHeaderComponent } from 'app/shared/components/page-header.component';
import { Button } from 'antd';
import Swal from 'sweetalert2';
import { ButtonsComponent } from 'app/shared/components/layout/buttonsFixed.component';
import themes from 'app/Theme/themes';
import { ChangeTheme } from 'app/Theme';


// Fragmentos
const { Content } = Layout;

export const ModuleLayout = (props: { logout: () => void }) => {
  const { logout, ...basicProps } = props;

  const [idUsuario, setIdUsuario] = useState<string>('');
  const [primerNombre, setPrimerNombre] = useState<string>('');
  const [primerApellido, setPrimerApellido] = useState<string>('');

  const [banderaPolicaSeguridad, setBanderaPolicaSeguridad] = useState<boolean>(false);
  const [theme, setTheme] = useState('');

  //#region Redux settings
  const { accountIdentifier, idTokenClaims } = authProvider.getAccount();
  const { loading, sidenav }: UIState = useSelector<AppState, UIState>((state) => state.ui);

  const dispatch = useDispatch();
  const toggleSidenav = () => dispatch(ToggleSideNav(!sidenav));

  const api = new ApiService(accountIdentifier);
  const email = idTokenClaims.emails;
  //#endregion
  //#region Application settings menu

  const getListas = useCallback(
    async () => {
      try {
        const token = await authProvider.getAccessToken();
      } catch (error) {
        console.log('Error obteniendo el token de sesión', error);
      }


      await api.AddUser({
        oid: accountIdentifier,
        email: email[0]
      });

      const myMenu = await api.GetMenuUser();
      const menu = MapperMenu.mapMenu(myMenu);

      const idUser = await api.getCodeUser();
      const infouser = await api.GetInformationUser(idUser);
      const idUsuario = await api.getIdUsuario();

      setIdUsuario(idUsuario);
      if (infouser != null) {
        setPrimerNombre(infouser.primerNombre.toLocaleUpperCase());
        setPrimerApellido(infouser.primerApellido.toLocaleUpperCase());
      }


      //Hasta que se publiquen las APIs

      const politicaSeguridad = await api.getPoliticaSeguridad(idUsuario);

      if (politicaSeguridad == null) {
        setBanderaPolicaSeguridad(true);
      }

      dispatch(SetApplicationMenu(menu));

    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  store.subscribe(() => {
    const { grid } = store.getState();
    if (grid.dataSource.length >= 1) {
      store.dispatch(ResetGrid());
      getListas();
    }
  });
  //#endregion

  const classLayout = sidenav ? 'app-layout-content' : '';
  const marginTop = 64;

  const assetsDocuments = require.context('../../../assets/documents', true);

  const onCancel = (): void => { };

  const onNoAutorizo = () => {
    setBanderaPolicaSeguridad(false);
    Swal.fire({
      icon: 'warning',
      title: '<h3>Política protección de datos personales<h3>',

      html: `<div style="text-align:justify;">Se ha rechazado la politica de protección de datos personales, por lo tanto no puede realizar ningún tramite y sera desconectado de la sesión.</div>`,
      showDenyButton: true,
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
      confirmButtonColor: '#3366cc',
      denyButtonColor: '#3366cc'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      } else if (result.isDenied) {
        setBanderaPolicaSeguridad(true);
      }
    });
  };
  const onAutorizo = async () => {
    setBanderaPolicaSeguridad(false);
    await api.AddPoliticaSeguridad({
      fecha: new Date(),
      id_usuario: idUsuario,
      nombre: primerNombre,
      apellido: primerApellido
    });
    Swal.fire({
      icon: 'success',

      title: 'Política protección de datos personales',
      text: `Se ha aceptado la politica de protección de datos personales exitosamente`
    });
  };

  const handleChange = (selectedTheme: any) => {
    setTheme(selectedTheme);
  };

  const refCallback = (node: any) => {
    if (node) {
      theme &&
        // Object.keys(theme).forEach((element: any) => {
        //   console.log("🚀 ~ file: module.layout.tsx ~ line 173 ~ Object.keys ~ element", element)
        //   node.style.setProperty(element, theme[element], 'important');
        //   if (element === 'background-color' || element === 'background') {
        //     // apply the same background mentioned for theme to the body of the website
        //     document.body.style.background = theme[element];
        //   }
        // });
        //debugger;
        ChangeTheme();

    }
  };
  return (
    <BrowserRouter>
      <div ref={refCallback}>
        <>

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
                <Button type='primary' htmlType='button' onClick={onAutorizo}>
                  Autorizo
                </Button>
                <Button type='primary' htmlType='submit' onClick={onNoAutorizo}>
                  No autorizo
                </Button>
              </div>
            </ModalComponent>
          ) : null}
        </>
        {loading && <Spin className='fadeIn app-loading' tip='Cargando Componentes...' />}
        <Layout className='fadeIn' style={{ minHeight: '100vh' }}>
          <SidenavComponent style={{ marginTop }} />
          <Layout>
            <NavbarComponent {...props} />
            {sidenav && (
              <div className='d-block d-md-none app-layout-backdrop' style={{ marginTop }} onClick={toggleSidenav} role='button' />
            )}
            <ButtonsComponent handleChange={handleChange} />
            <Content className={classLayout} style={{ marginTop }}>
              <ModuleRoutes />
            </Content>
            <FooterComponent className={classLayout}>
              <div className='mt-3 d-flex justify-content-between align-items-center'>
                <ul className='list-unstyled mb-0'>
                  <li>
                    <a
                      href={'http://www.saludcapital.gov.co/Documents/Politica_Proteccion_Datos_P.pdf'}
                      rel='noreferrer'
                      target='_blank'
                    >
                      Política de Protección de Datos
                    </a>
                  </li>
                  <li>
                    <a href={assetsDocuments('./Terminos_Condiciones.pdf').default} rel='noreferrer' target='_blank'>
                      Términos y condiciones
                    </a>
                  </li>
                </ul>
                <img src={LogoNegativo} alt='Logotipo' height={50} />
              </div>
            </FooterComponent>
          </Layout>
          <BackTop />
        </Layout>
      </div>

    </BrowserRouter>
  );
};
function then(arg0: () => void) {
  throw new Error('Function not implemented.');
}
