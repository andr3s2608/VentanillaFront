import { IMenu, Menu } from '../../Models/IMenu';
export class MapperMenu {
  static mapMenu(menu: IMenu[]): any[] {
    let menuPatch: any[] = [];
    menu.forEach((item: IMenu) => {
      item.menuPadre.forEach((menu: Menu) => {
        console.log(menu);
        /* const children = menu.menuHijo.map((children: Menu) => {
          return {
            name: children.titulo,
            describe: children.description,
            icon: children.icon,
            patch: children.path
          };
        }); */
        const json = {
          name: menu.titulo,
          children: {}
        };
        menuPatch.push(json);
      });
    });
    return menuPatch;
  }
}
