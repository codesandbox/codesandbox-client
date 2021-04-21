import './titlebar.css';

import track from '@codesandbox/common/lib/utils/analytics';
import { useAppState, useEffects } from 'app/overmind';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { MenuAppItems } from 'app/overmind/effects/vscode/composeMenuAppTree';
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

// TODO: find out a proper place to TS helpers
type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

export const MenuBar: FunctionComponent = () => {
  const { isLoading } = useAppState().editor;
  const [menu, setMenu] = useState<MenuAppItems>([]);

  const { vscode } = useEffects();
  const vscodeMenuItems = vscode.getMenuAppItems();

  useEffect(() => {
    setMenu(vscodeMenuItems);
  }, [vscodeMenuItems]);

  const renderSubMenu = (submenu: Unpacked<MenuAppItems>['submenu']) =>
    submenu.map(subItem => {
      if (subItem.submenu) {
        return (
          <div className="menu">
            <p>
              {subItem.title} {'>'}
            </p>
            <div className="menu sub-menu">
              {renderSubMenu(subItem.submenu)}
            </div>
          </div>
        );
      }

      if (subItem.command) {
        return (
          <div className="item">
            <button
              type="button"
              onClick={() => vscode.runCommand(subItem.command.id)}
            >
              {subItem.command.title}
            </button>
          </div>
        );
      }

      return null;
    });

  return (
    // Explicitly use inline styles here to override the vscode styles
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <Container onClick={() => track('Editor - Click Menubar')}>
      {isLoading ? (
        <MenuBarSkeleton />
      ) : (
        menu.map(item => (
          <div className="menu">
            <button type="button">{item.title}</button>

            {renderSubMenu(item.submenu)}
          </div>
        ))
      )}
    </Container>
  );
};
