import './titlebar.css';

import track from '@codesandbox/common/lib/utils/analytics';
import { useAppState, useEffects } from 'app/overmind';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { MenuItems } from 'app/overmind/effects/vscode';
import { Container, SkeletonContainer, SkeletonMenuItem } from './elements';

const MenuBarSkeleton: FunctionComponent = () => (
  <SkeletonContainer>
    <SkeletonMenuItem>File</SkeletonMenuItem>
    <SkeletonMenuItem>Edit</SkeletonMenuItem>
    <SkeletonMenuItem>Selection</SkeletonMenuItem>
    <SkeletonMenuItem>View</SkeletonMenuItem>
    <SkeletonMenuItem>Go</SkeletonMenuItem>
    <SkeletonMenuItem>Help</SkeletonMenuItem>
    <SkeletonMenuItem style={{ visibility: 'hidden' }}>
      <div style={{ width: 20 }} />
    </SkeletonMenuItem>
  </SkeletonContainer>
);

export const MenuBar: FunctionComponent = () => {
  const { isLoading } = useAppState().editor;
  const [menu, setMenu] = useState<MenuItems>([]);

  const vscode = useEffects().vscode;
  const vscodeMenuItems = vscode.getMenuItems();

  useEffect(() => {
    setMenu(vscodeMenuItems);
  }, [vscodeMenuItems]);

  console.log(menu);

  return (
    // Explicitly use inline styles here to override the vscode styles
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <Container onClick={() => track('Editor - Click Menubar')}>
      {isLoading ? (
        <MenuBarSkeleton />
      ) : (
        menu.map(item => (
          <p>
            {item.title}

            {item.submenu.map(subItem => {
              if (subItem.command) return <p>{subItem.command.title}</p>;
              return <p>{subItem.title}</p>;
            })}
          </p>
        ))
      )}
    </Container>
  );
};
