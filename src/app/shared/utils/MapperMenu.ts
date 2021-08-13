import { Menu } from '../../Models/IMenu';
export class MapperMenu {
  static mapMenu(menu: Menu[]): any[] {
    let menuPatch: any[] = [];
    menu.forEach((item: Menu) => {
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
        children
      };
      menuPatch.push(json);
    });
    return menuPatch;
  }
}
