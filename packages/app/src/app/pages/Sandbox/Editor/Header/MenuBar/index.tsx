import * as React from 'react';
import vscode from 'app/vscode';

import './titlebar.css';

export function MenuBarContainer() {
  const menuBarEl = React.useRef(null);

  React.useEffect(() => {
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
    <div
      style={{
        marginLeft: '.5rem',
        display: 'flex',
        alignItems: 'center',
      }}
      className="part titlebar"
    >
      <div
        style={{ alignItems: 'center', height: 38, fontSize: '.875rem' }}
        className="menubar"
        ref={menuBarEl}
      />
    </div>
  );
}
