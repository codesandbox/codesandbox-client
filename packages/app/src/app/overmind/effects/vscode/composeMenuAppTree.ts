import { MenuId } from './Workbench';

interface SubMenu {
  group: string;
  order: number;
  command?: { id: string; title: string };
  title?: string;
  when?: { key: string };
  submenu?: SubMenu[];
}

export type MenuAppItems = Array<{
  title: string;
  submenu: SubMenu[];
}>;

enum RootMenuId {
  '&&File' = MenuId.MenubarFileMenu,
  '&&Edit' = MenuId.MenubarEditMenu,
  '&&Selection' = MenuId.MenubarSelectionMenu,
  '&&View' = MenuId.MenubarViewMenu,
  '&&Go' = MenuId.MenubarGoMenu,
  '&&Help' = MenuId.MenubarHelpMenu,
}

export const composeMenuAppTree = (
  getVsCodeMenuItems: (id: string | RootMenuId) => Array<unknown>
): MenuAppItems => {
  const getSubmenu = (menu: Array<{ submenu?: string }>) =>
    menu.map(item => {
      if (item.submenu) {
        const submenu = getVsCodeMenuItems(item.submenu);

        return {
          ...item,
          submenu: getSubmenu(submenu),
        };
      }

      return item;
    });

  return Object.entries(RootMenuId)
    .map(([rootTitle, id]) => {
      const rootMenu = getVsCodeMenuItems(id);

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
