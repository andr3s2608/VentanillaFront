import { useCallback, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { SetApplicationMenu } from 'app/redux/application/application.actions';
import { ToggleSideNav } from 'app/redux/ui/ui.actions';
import { AppState } from 'app/redux/app.reducers';
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
import LogoNegativo from '../../assets/images/brand/logo_alcaldia.png';
import { ApiService } from 'app/services/Apis.service';
import { MapperMenu } from 'app/shared/utils/MapperMenu';
import { authProvider } from 'app/shared/utils/authprovider.util';

// Fragmentos
const { Content } = Layout;

export const ModuleLayout = (props: { logout: () => void }) => {
  //#region Redux settings
  const { accountIdentifier } = authProvider.getAccount();
  const { loading, sidenav }: UIState = useSelector<AppState, UIState>((state) => state.ui);

  const dispatch = useDispatch();
  const toggleSidenav = () => dispatch(ToggleSideNav(!sidenav));

  const api = new ApiService(accountIdentifier);

  //#endregion
  //#region Application settings menu

  const getListas = useCallback(
    async () => {
      const myMenu = await api.GetMenuUser();
      const menu = MapperMenu.mapMenu(myMenu);
      dispatch(SetApplicationMenu(menu));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //#endregion

  const classLayout = sidenav ? 'app-layout-content' : '';
  const marginTop = 64;

  const assetsDocuments = require.context('../../assets/documents', true);

  return (
    <BrowserRouter>
      {loading && <Spin className='fadeIn app-loading' tip='Cargando Componentes...' />}
      <Layout className='fadeIn' style={{ minHeight: '100vh' }}>
        <SidenavComponent style={{ marginTop }} />
        <Layout>
          <NavbarComponent {...props} />
          {sidenav && (
            <div className='d-block d-md-none app-layout-backdrop' style={{ marginTop }} onClick={toggleSidenav} role='button' />
          )}
          <Content className={classLayout} style={{ marginTop }}>
            <ModuleRoutes />
          </Content>
          <FooterComponent className={classLayout}>
            <div className='mt-3 d-flex justify-content-between align-items-center'>
              <ul className='list-unstyled mb-0'>
                <li>
                  <a href={assetsDocuments('./Politica_Proteccion_Datos.pdf').default} rel='noreferrer' target='_blank'>
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
    </BrowserRouter>
  );
};
