import './titlebar.css';

import { useOvermind } from 'app/overmind';
import React, { useEffect, useRef } from 'react';

export const MenuBar = () => {
  const { effects } = useOvermind();
  const menuBarEl = useRef(null);

  useEffect(() => {
    // Get the menu bar part from vscode and mount it
    menuBarEl.current.appendChild(effects.vscode.getMenubarElement());
  }, [effects.vscode]);

  return (
    // Explicitly use inline styles here to override the vscode styles
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginLeft: ' 0.5rem',
      }}
      className="part titlebar"
      ref={menuBarEl}
    />
  );
};
