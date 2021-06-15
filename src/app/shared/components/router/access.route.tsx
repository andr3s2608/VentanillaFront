import React, { useEffect } from 'react';
import { Route, RouteProps } from 'react-router-dom';

// Redux
import { useSelector } from 'react-redux';
import { IItemMenu } from 'app/redux/application/application.types';
import { AppState } from 'app/redux/app.reducers';

// Component
import { NoAuthorizedPage } from 'app/shared/pages/no-authorized.page';

// Servicios
import { warningMessage } from 'app/services/settings/message.service';

/**
 * Componente de ruta privada que incluye la propiedad `ignoreGuards`
 * que por default es `false` y permite pasar la seguridad de la ruta en el ambiente de desarrollo.
 * @param {IRouteProps} props Propiedades de la ruta.
 * @returns Componente de ruta privada.
 */
export const AccessRoute: React.FC<IRouteProps> = (props) => {
  const { component: Component, ignoreGuards = false, path, ...routeProps } = props;
  const _ignoreGuards = process.env.NODE_ENV !== 'production' && ignoreGuards;

  const menu = useSelector<AppState, IItemMenu[]>((state) => state.application.menu);

  /**
   * Validaciones necesarias sobre cada ruta de la aplicación.
   * @returns {boolean} Bandera de acceso.
   */
  const pathGuards = (): boolean => {
    /**
     * Obtener los paths del menu de la aplicación.
     * @param {IItemMenu[]} _menuApplication Menu de la aplicación.
     * @returns {(string | undefined)[]} Arreglo de los paths del menu.
     */
    const getPathsMenu = (_menuApplication: IItemMenu[]): (string | undefined)[] => {
      const pathsMenu = [];

      for (const item of _menuApplication) {
        if (item?.children?.length) {
          pathsMenu.push(...getPathsMenu(item.children));
        } else {
          pathsMenu.push(item?.path);
        }
      }

      return pathsMenu;
    };

    /** Validar si el path al que se esta accediendo existe en el menu de navegación de la aplicación. */
    const pathMenuAccess = getPathsMenu(menu).includes(path as string);

    return pathMenuAccess;
  };

  useEffect(() => {
    if (_ignoreGuards) {
      warningMessage({
        title: 'Propiedad "ignoreGuards" esta habilitada.',
        content: (
          <>
            <p>
              La ruta <b>{path}</b> esta ignorando la seguridad al tener habilitada la propiedad&nbsp;
              <code className='text-danger'>'ignoreGuards'</code> en la configuración de las rutas.
            </p>
            <p>
              La propiedad <code className='text-danger'>'ignoreGuards'</code> se debe utilizar&nbsp;
              <b>solo en ambiente de desarrollo</b> y cuando la ruta no este configurada en el menú de rutas.
            </p>
            <p>
              <b>Por favor elimine la propiedad de la configuración de las rutas cuando termine el desarrollo.</b>
            </p>
            <p className='m-0 text-muted'>
              <b>NOTA:</b> Este mensaje solo es visible en el ambiente de desarrollo.
            </p>
          </>
        ),
        okText: 'Entiendo'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_ignoreGuards]);

  return <Route {...routeProps} path={path} component={_ignoreGuards || pathGuards() ? Component : NoAuthorizedPage} />;
};

export interface IRouteProps extends RouteProps {
  ignoreGuards?: boolean;
}
