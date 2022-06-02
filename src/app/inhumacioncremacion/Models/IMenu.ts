export interface Menu {
  idMenu: string;
  idMenuRoot: null | string;
  titulo: string;
  description: string;
  path: string;
  order: number;
  icon: null;
  menuPadreHijo: Menu[];
  menuHijo: Menu[];
}
