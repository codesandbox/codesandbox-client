import { MenuId } from './Workbench';

interface SubMenu {
  group: string;
  order: number;
  command?: { id: string; title: string };
  title?: string;
  when?: { key: string };
  submenu?: SubMenu[];
}

export type MenuItems = Array<{
  title: string;
  submenu: SubMenu[];
}>;

export const composeMenuTree = (getMenuItems: any): MenuItems => {
  enum RootMenuId {
    File = MenuId.MenubarFileMenu,
    Edit = MenuId.MenubarEditMenu,
    Selection = MenuId.MenubarSelectionMenu,
    View = MenuId.MenubarViewMenu,
    Go = MenuId.MenubarGoMenu,
    Help = MenuId.MenubarHelpMenu,
  }

  const getSubmenu = (menu: Array<{ submenu?: Array<unknown> }>) =>
    menu.map(item => {
      if (item.submenu) {
        const submenu = getMenuItems(item.submenu);

        return {
          ...item,
          submenu: getSubmenu(submenu),
        };
      }

      return item;
    });

  return Object.entries(RootMenuId)
    .map(([rootTitle, id]) => {
      const rootMenu = getMenuItems(id);

      if (rootMenu.length === 0) {
        return null;
      }

      return {
        title: rootTitle,
        submenu: getSubmenu(rootMenu),
      };
    })
    .filter(Boolean);
};
