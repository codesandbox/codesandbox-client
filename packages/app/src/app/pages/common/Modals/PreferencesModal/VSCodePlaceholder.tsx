import { Button } from '@codesandbox/common/lib/components/Button';
import { editorUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
import React from 'react';
import { Route } from 'react-router-dom';

interface IVSCodePlaceholderProps {
  hideTitle?: boolean;
}

const VSCodePlaceholder: React.FC<IVSCodePlaceholderProps> = ({
  hideTitle,
}) => {
  const { actions, effects } = useOvermind();

  const openCommand = () => {
    effects.vscode.runCommand('workbench.action.openSettings2').then(() => {
      actions.modalClosed();
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
      Some options are disabled because they are handled by VSCode. You can open
      the settings of VSCode by pressing {"'"}
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
};

export default VSCodePlaceholder;
