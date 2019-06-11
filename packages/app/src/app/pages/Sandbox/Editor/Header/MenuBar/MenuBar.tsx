import React, { useEffect, useRef } from 'react';
import vscode from 'app/vscode';
import { TitleBar, Container } from './elements';
import './titlebar.css';

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
    <TitleBar className="part titlebar">
      <Container className="menubar" ref={menuBarEl} />
    </TitleBar>
  );
};
