import { MenuAppItems } from 'app/overmind/effects/vscode/composeMenuAppTree';

// TODO: find out a proper place to TS helpers
type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

type MenuAppItemsSubmenuAsObject =
  | Array<
      Unpacked<MenuAppItems> & {
        submenu: Record<string, MenuAppItemsSubmenuAsObject>;
      }
    >
  | MenuAppItems;

/**
 * Given an array of objects that has the same `group` value
 * Returns an object where the key is the `group` value with its items, recursively
 */
const groupMenu = (
  submenu: MenuAppItemsSubmenuAsObject
): Record<string, MenuAppItemsSubmenuAsObject> =>
  submenu
    .sort((a, b) => (a.group > b.group ? 1 : -1))
    .reduce((acc, curr) => {
      let newGroupItem = curr;

      if (curr.submenu) {
        newGroupItem = {
          ...newGroupItem,
          submenu: groupMenu(curr.submenu) as any,
        };
      }

      const mergedGroup =
        curr.group in acc ? [...acc[curr.group], newGroupItem] : [newGroupItem];
      const sortInnerGroup = mergedGroup.sort((a, b) =>
        a.order > b.order ? 1 : -1
      );

      return { ...acc, [curr.group]: sortInnerGroup };
    }, {});

/**
 * Given an object of array,
 * Returns a two-dimensional data, meaning just remove the key
 */
const flattenObjectToArray = (
  groups: Record<string, MenuAppItemsSubmenuAsObject>
): MenuAppItems[] =>
  Object.entries(groups).reduce((acc, [_, value]) => {
    const flattenSubmenu = value.map(item => {
      if (item.submenu) {
        return { ...item, submenu: flattenObjectToArray(item.submenu) };
      }

      return item;
    });

    return [...acc, flattenSubmenu];
  }, []);

/**
 * Get the menu data and group by names
 * which returns an array bi-dimensional
 */
const formatMenuData = (payload: MenuAppItems): MenuAppItems[] => {
  const groups = groupMenu(payload);
  const flatten = flattenObjectToArray(groups);

  return flatten;
};

export { formatMenuData };
