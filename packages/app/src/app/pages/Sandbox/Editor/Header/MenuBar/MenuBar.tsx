import React, { useEffect, useRef } from 'react';
import { vscode } from 'app/vscode';
import './titlebar.css';
import track from '@codesandbox/common/lib/utils/analytics';

export const MenuBar = () => {
  const menuBarEl = useRef(null);

  useEffect(() => {
    // Get the menu bar part from vscode and mount it
    vscode.getMenubarPart().then(part => {
      part.create(menuBarEl.current);
    });

    return () => {
      // Don't dispose, it kills listeners that are not remounted
      // vscode.getMenubarPart().then(part => {
      //   part.dispose();
      // });
    };
  }, []);

  return (
    // Explicitly use inline styles here to override the vscode styles
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginLeft: ' 0.5rem',
      }}
      className="part titlebar"
      onClick={() => {
        track('Editor - Click Menubar');
      }}
    >
      <div
        style={{
          alignItems: 'center',
          height: 38,
          fontSize: '0.875rem',
        }}
        className="menubar"
        ref={menuBarEl}
      />
    </div>
  );
};
