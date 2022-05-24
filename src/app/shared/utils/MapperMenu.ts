import { Menu } from '../../Models/IMenu';
export class MapperMenu {
  static mapMenu(menu: Menu[]): any[] {
    let menuPatch: any[] = [];
    menu.forEach((item: Menu) => {
      const fatherchildren = item.menuPadreHijo.map((menu2: Menu) => {
        const fatherchildren = menu2.menuPadreHijo.map((menu3: Menu) => {
          const children = menu3.menuHijo.map((menu: Menu) => {
            return {
              name: menu.titulo,
              describe: menu.description,
              icon: menu.icon,
              path: menu.path
            };
          });
          const json = {
            name: menu3.titulo,
            children
          };
          return json;
        });

        const children = menu2.menuHijo.map((menu: Menu) => {
          return {
            name: menu.titulo,
            describe: menu.description,
            icon: menu.icon,
            path: menu.path
          };
        });
        const json = {
          name: menu2.titulo,
          fatherchildren,
          children
        };
        return json;
      });

      const children = item.menuHijo.map((menu: Menu) => {
        return {
          name: menu.titulo,
          describe: menu.description,
          icon: menu.icon,
          path: menu.path
        };
      });
      const json = {
        name: item.titulo,
        path: item.path,
        fatherchildren,
        children
      };

      menuPatch.push(json);
    });
    return menuPatch;
  }
}
