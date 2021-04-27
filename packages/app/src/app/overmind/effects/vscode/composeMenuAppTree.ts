import { MenuId } from './Workbench';

export type MenuAppItems = Array<{
  group: string;
  order: number;
  command?: {
    id: string;
    title: string;
    when?: { key: string };
    precondition?: { key: string };
    toggled?: { key: string };
  };
  title?: string;
  when?: { key: string };
  submenu?: MenuAppItems;
  submenuId?: number;
}>;

type InternalMenuType = Array<{ submenu?: string }>;

const DEFAULT_ITEMS = [
  {
    title: '&&File',
    submenu: MenuId.MenubarFileMenu,
    group: '2_root',
    order: 1,
  },
  {
    title: '&&Edit',
    submenu: MenuId.MenubarEditMenu,
    group: '2_root',
    order: 2,
  },
  {
    title: '&&Selection',
    submenu: MenuId.MenubarSelectionMenu,
    group: '2_root',
    order: 3,
  },
  {
    title: '&&View',
    submenu: MenuId.MenubarViewMenu,
    group: '2_root',
    order: 4,
  },
  {
    title: '&&Go',
    submenu: MenuId.MenubarGoMenu,
    group: '2_root',
    order: 5,
  },
  {
    title: '&&Help',
    submenu: MenuId.MenubarHelpMenu,
    group: '3_support',
    order: 1,
  },
];

export const composeMenuAppTree = (
  getVsCodeMenuItems: (id: string | MenuId) => Array<unknown>
): MenuAppItems => {
  const rootMenu = [...getVsCodeMenuItems(MenuId.Root), ...DEFAULT_ITEMS];

  const getSubmenu = (menu: InternalMenuType) =>
    menu.map(item => {
      const submenuId = item.submenu;

      if (submenuId) {
        const submenu = getVsCodeMenuItems(submenuId);
        return { ...item, submenuId, submenu: getSubmenu(submenu) };
      }

      return item;
    });

  return getSubmenu((rootMenu as unknown) as InternalMenuType);
};
