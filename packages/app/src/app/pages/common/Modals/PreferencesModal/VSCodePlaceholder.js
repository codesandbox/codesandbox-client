import React from 'react';
import { observer, inject } from 'mobx-react';
import { Route } from 'react-router-dom';

import vscode from 'app/vscode';
import { Button } from 'common/lib/components/Button';
import { editorUrl } from 'common/lib/utils/url-generator';

const VSCodePlaceholder = ({ children, store, signals, hideTitle }) => {
  if (store.preferences.settings.experimentVSCode) {
    const openCommand = () => {
      vscode.runCommand('workbench.action.openSettings2').then(() => {
        signals.modalClosed();
      });
    };

    return hideTitle ? null : (
      <div
        style={{
          fontSize: '.875rem',
          fontStyle: 'italic',
          color: 'rgba(255, 255, 255, 0.5)',
          lineHeight: 1.4,
          fontWeight: 500,
          marginBottom: '1.5rem',
        }}
      >
        Some options are disabled because they are handled by VSCode. You can
        open the settings of VSCode by pressing {"'"}
        CTRL/CMD + ,{"'"}.
        <Route path={editorUrl()}>
          {res =>
            res.match && (
              <div style={{ marginTop: '1rem' }}>
                <Button small onClick={openCommand}>
                  Open VSCode Settings
                </Button>
              </div>
            )
          }
        </Route>
      </div>
    );
  }

  return children;
};

export default inject('store', 'signals')(observer(VSCodePlaceholder));
