export interface IMenu {
  menuPadre: Menu[];
}

export interface Menu {
  idMenu: string;
  idMenuRoot: null | string;
  titulo: string;
  description: string;
  path: string;
  order: number;
  icon: null;
  menuHijo?: Menu[];
}
