import React from 'react';

// Antd
import Menu from 'antd/es/menu';
import Layout from 'antd/es/layout';
import { BasicProps } from 'antd/es/layout/layout';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { ToggleSideNav } from 'app/redux/ui/ui.actions';
import { ResetApplication } from 'app/redux/application/application.actions';
import { AppState } from 'app/redux/app.reducers';

// Herramientas
import { confirmMessage } from 'app/services/settings/message.service';

// Iconos
import { LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

// Utilidades
import { authProvider } from 'app/shared/utils/authprovider.util';
import { projectInfo } from 'app/shared/utils/constants.util';

// Componentes
const { Header } = Layout;

export const NavbarComponent: React.FC<INavbarComponent> = (props) => {
  const { logout, ...basicProps } = props;
  const { name, userName } = authProvider.getAccount();

  const sidenav = useSelector<AppState, boolean>((state) => state.ui.sidenav);
  const dispatch = useDispatch();

  const toggleSidenav = () => dispatch(ToggleSideNav(!sidenav));

  const onLogout = () => {
    confirmMessage({
      title: 'Cerrar sesión',
      content: '¿Esta seguro de cerrar sesión?',
      okText: 'Si, cerrar sesión',
      okButtonProps: { type: 'primary', danger: true },
      onOk: () => {
        dispatch(ResetApplication());
        logout();
      }
    });
  };

  return (
    <Header
      {...basicProps}
      className='d-flex justify-content-between app-bg-transparent border-bottom shadow w-100 fixed-top px-0'
      style={{ zIndex: 1003 }}
    >
      <div className='d-flex'>
        <b className='text-primary px-3 d-none d-md-flex align-items-center' style={{ lineHeight: 1, maxWidth: 250 }}>
          {projectInfo.name}
        </b>
        <Menu className='bg-transparent' theme='dark' mode='horizontal'>
          <Menu.Item className='bg-transparent' key='1' onClick={toggleSidenav} title='Mostrar / Ocultar menú'>
            {React.createElement(sidenav ? MenuFoldOutlined : MenuUnfoldOutlined, {
              className: 'text-muted',
              style: { fontSize: 18 }
            })}
          </Menu.Item>
        </Menu>
        {props.children}
      </div>

      <b className='text-primary px-3 d-flex d-md-none align-items-center text-center' style={{ lineHeight: 1 }}>
        {projectInfo.name}
      </b>

      <div className='d-flex'>
        <span className='app-navbar-user text-truncate d-none d-md-block' title={`${name} <${userName}>`}>
          <span className='h5'>
            <b className='text-primary'>{name}</b>
          </span>
        </span>
        <Menu className='bg-transparent' theme='dark' mode='horizontal'>
          <Menu.Item className='bg-transparent' key='1' onClick={onLogout} title='Cerrar sesión'>
            <LogoutOutlined className='text-muted' style={{ fontSize: 18 }} />
          </Menu.Item>
        </Menu>
      </div>
    </Header>
  );
};

interface INavbarComponent extends BasicProps {
  logout: () => void;
}
