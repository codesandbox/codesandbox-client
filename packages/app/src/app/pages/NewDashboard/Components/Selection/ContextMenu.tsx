import React from 'react';
import { Stack, Element } from '@codesandbox/components';
import css from '@styled-system/css';

export const ContextMenu = ({
  visible,
  position,
  setVisibility,
  selectedIds,
  sandboxes,
  folders,
}) => {
  React.useEffect(() => {
    const handler = () => {
      if (visible) setVisibility(false);
    };

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [visible, setVisibility]);

  if (!visible) return null;

  // const selectedItems = selectedIds.map(id => {
  //   if (id.startsWith('/')) {
  //     const folder = folders.find(f => f.path === id);
  //     return {
  //       type: 'folder',
  //       title: folder.name,
  //       path: folder.path,
  //     };
  //   }

  //   const sandbox = sandboxes.find(s => s.id === id);
  //   return {
  //     type: 'sandbox',
  //     id: sandbox.id,
  //     title: sandbox.title || sandbox.path || sandbox.alias,
  //     url: sandbox.screenshotUrl,
  //   };
  // });

  return (
    <>
      <Stack
        data-reach-menu-list
        data-component="MenuList"
        css={css({
          position: 'absolute',
          top: position.y,
          left: position.x,
        })}
      >
        <Element data-reach-menu-item data-component="MenuItem">
          Open sandbox
        </Element>
      </Stack>
    </>
  );
};
