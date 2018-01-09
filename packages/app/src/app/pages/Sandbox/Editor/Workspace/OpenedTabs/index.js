import React from 'react';
import { inject, observer } from 'mobx-react';

import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import getType from 'app/utils/get-type';
import { getModulePath } from 'common/sandbox/modules';

import WorkspaceItem from '../WorkspaceItem';
import { EntryContainer } from '../elements';
import { Title, Dir } from './elements';
import SaveIcon from './SaveIcon';

const OpenedTabs = ({ store, signals }) => {
  const sandbox = store.editor.currentSandbox;
  const currentModuleShortid = store.editor.currentModuleShortid;
  const moduleObject = {};
  sandbox.modules.forEach(m => {
    moduleObject[m.shortid] = m;
  });

  const openModules = store.editor.tabs.map(t => moduleObject[t.moduleShortid]);

  return (
    <WorkspaceItem
      defaultOpen
      keepState
      title="Open Tabs"
      actions={
        <SaveIcon
          onClick={e => {
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
            signals.editor.saveClicked();
          }}
        />
      }
    >
      {openModules.map(m => (
        <EntryContainer
          onClick={() => {
            signals.editor.moduleSelected({ id: m.id });
          }}
          active={currentModuleShortid === m.shortid}
          key={m.id}
        >
          <EntryIcons
            isNotSynced={m.isNotSynced}
            type={getType(m.title, m.code)}
            error={m.errors && m.errors.length > 0}
          />
          <Title>{m.title}</Title>
          <Dir>
            {getModulePath(sandbox.modules, sandbox.directories, m.id)
              .replace('/', '')
              .replace(new RegExp(m.title + '$'), '')}
          </Dir>
        </EntryContainer>
      ))}
    </WorkspaceItem>
  );
};

export default inject('signals', 'store')(observer(OpenedTabs));
