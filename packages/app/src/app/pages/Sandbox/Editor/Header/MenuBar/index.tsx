import track from '@codesandbox/common/lib/utils/analytics';
import React, { FunctionComponent, useEffect, useRef } from 'react';

import { useOvermind } from 'app/overmind';

import { Child, Container } from './elements';
import './titlebar.css';

export const MenuBar: FunctionComponent = () => {
  const { effects } = useOvermind();
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
      <Child ref={menuBarEl} />
    </Container>
  );
};
