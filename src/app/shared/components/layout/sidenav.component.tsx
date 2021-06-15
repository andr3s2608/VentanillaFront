import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

// Antd
import Layout from 'antd/es/layout';
import Menu from 'antd/es/menu';
import { BasicProps } from 'antd/es/layout/layout';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { ToggleSideNav } from 'app/redux/ui/ui.actions';
import { AppState } from 'app/redux/app.reducers';
import { IItemMenu } from 'app/redux/application/application.types';

// Fragmentos
const { Sider } = Layout;

export const SidenavComponent: React.FC<BasicProps> = (props) => {
  const sidenav = useSelector<AppState, boolean>((state) => state.ui.sidenav);
  const menu = useSelector<AppState, IItemMenu[]>((state) => state.application.menu);

  const dispatch = useDispatch();

  const [openKeys, setOpenKeys] = useState<any>({ openKeys: [] });

  const onOpenChangeMenu = ({ key }: any) =>
    setOpenKeys(({ openKeys: _openKeys, ...state }: any) => {
      const latestOpenKey = _openKeys.findIndex((_key: any) => _key === key);

      if (latestOpenKey !== -1) {
        _openKeys.splice(latestOpenKey, 1);
        return { ...state, openKeys: [..._openKeys] };
      } else {
        return { ...state, openKeys: [..._openKeys, key] };
      }
    });

  const onCloseSidenav = () => dispatch(ToggleSideNav(false));

  const renderMenu = (items: IItemMenu[]) =>
    items.map((item, idx) => {
      const key = `${idx}_${item.name.replace(/\s/g, '_')}`;
      if (item?.children?.length) {
        return (
          <Menu.SubMenu key={key} title={item.name} onTitleClick={onOpenChangeMenu}>
            {renderMenu(item.children)}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item key={key} onClick={onCloseSidenav}>
            <NavLink to={item.path || ''}>{item.name}</NavLink>
          </Menu.Item>
        );
      }
    });

  return (
    <Sider {...props} className='app-sidenav' trigger={null} collapsible collapsedWidth={0} collapsed={!sidenav} width={250}>
      <Menu className='pt-3 pb-5' theme='dark' mode='inline' {...openKeys}>
        <Menu.Item key='home' onClick={onCloseSidenav}>
          <NavLink to='/'>Inicio</NavLink>
        </Menu.Item>
        {renderMenu(menu)}
      </Menu>
    </Sider>
  );
};
