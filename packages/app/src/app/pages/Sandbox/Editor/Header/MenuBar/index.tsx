import './titlebar.css';

import track from '@codesandbox/common/lib/utils/analytics';
import { useAppState, useEffects } from 'app/overmind';
import React, { FunctionComponent, useEffect, useRef } from 'react';

import {
  Child,
  Container,
  SkeletonContainer,
  SkeletonMenuItem,
} from './elements';

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
  const vscode = useEffects().vscode;
  const menuBarEl = useRef(null);

  useEffect(() => {
    // Get the menu bar part from vscode and mount it
    menuBarEl.current.appendChild(vscode.getMenubarElement());
  }, [vscode]);

  return (
    // Explicitly use inline styles here to override the vscode styles
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <Container
      className="part titlebar"
      onClick={() => track('Editor - Click Menubar')}
    >
      <Child ref={menuBarEl} style={isLoading ? { display: 'none' } : null} />
      {isLoading ? <MenuBarSkeleton /> : null}
    </Container>
  );
};
