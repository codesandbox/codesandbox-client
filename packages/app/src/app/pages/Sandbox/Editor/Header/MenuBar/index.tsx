import track from '@codesandbox/common/lib/utils/analytics';
import React, { FunctionComponent, useEffect, useRef } from 'react';

import { useOvermind } from 'app/overmind';

import { Child, Container } from './elements';
import './titlebar.css';

export const MenuBar: FunctionComponent = () => {
  const {
    effects: {
      vscode: { getMenubarElement },
    },
  } = useOvermind();
  const menuBarEl = useRef(null);

  useEffect(() => {
    // Get the menu bar part from vscode and mount it
    menuBarEl.current.appendChild(getMenubarElement());
  }, [getMenubarElement]);

  return (
    // Explicitly use inline styles here to override the vscode styles
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <Container
      className="part titlebar"
      onClick={() => track('Editor - Click Menubar')}
    >
      <Child className="menubar" ref={menuBarEl} />
    </Container>
  );
};
