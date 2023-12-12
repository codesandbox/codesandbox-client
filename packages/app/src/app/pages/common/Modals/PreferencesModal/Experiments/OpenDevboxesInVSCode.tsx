import { Text, Element } from '@codesandbox/components';
import React from 'react';

import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
import { PaddedPreference } from '../elements';

export const OpenDevboxesInVSCode = () => {
  const [defaultEditor, setDefaultEditor] = useGlobalPersistedState<
    'csb' | 'vscode'
  >('DEFAULT_EDITOR', 'csb');

  return (
    <Element>
      <PaddedPreference
        value={defaultEditor === 'vscode'}
        setValue={() =>
          setDefaultEditor(defaultEditor === 'csb' ? 'vscode' : 'csb')
        }
        title="Use VS Code as the default editor"
        type="boolean"
      />

      <Text block marginTop={2} size={3} variant="muted">
        Prefer direct links to open the devboxes in VS Code, when possible.
      </Text>
    </Element>
  );
};
