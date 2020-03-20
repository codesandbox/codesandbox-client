import './titlebar.css';

import track from '@codesandbox/common/lib/utils/analytics';
import { useOvermind } from 'app/overmind';
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
  const { state, effects } = useOvermind();
  const menuBarEl = useRef(null);

  useEffect(() => {
    // Get the menu bar part from vscode and mount it
    menuBarEl.current.appendChild(effects.vscode.getMenubarElement());
  }, [effects.vscode]);

  return (
    // Explicitly use inline styles here to override the vscode styles
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <Container
      className="part titlebar"
      onClick={() => track('Editor - Click Menubar')}
    >
      <Child
        ref={menuBarEl}
        style={state.editor.isLoading ? { display: 'none' } : null}
      />
      {state.editor.isLoading ? <MenuBarSkeleton /> : null}
    </Container>
  );
};
