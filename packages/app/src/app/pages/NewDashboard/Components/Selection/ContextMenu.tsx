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
