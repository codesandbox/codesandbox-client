import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import { ModuleTab } from '@codesandbox/common/lib/types';
import { useOvermind } from 'app/overmind';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import { saveAllModules } from 'app/store/modules/editor/utils';
// eslint-disable-next-line import/extensions
import getType from 'app/utils/get-type.ts';
import React from 'react';
import CrossIcon from 'react-icons/lib/md/clear';
import { EntryContainer } from '../elements';
import { WorkspaceItem } from '../WorkspaceItem';
import { CrossIconContainer, Dir, Title } from './elements';
import SaveIcon from './SaveIcon';

export const OpenedTabs: React.FC = () => {
  const { state, actions } = useOvermind();
  const sandbox = state.editor.currentSandbox;
  const { currentModuleShortid } = state.editor;
  const moduleObject = {};
  sandbox.modules.forEach(m => {
    moduleObject[m.shortid] = m;
  });

  const openModules = (state.editor.tabs as ModuleTab[])
    .map(t => moduleObject[t.moduleShortid])
    .filter(x => x);

  return (
    <WorkspaceItem
      title="Open Tabs"
      actions={
        <SaveIcon
          disabled={state.editor.isAllModulesSynced}
          onClick={e => {
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
            saveAllModules(state, actions);
          }}
        />
      }
    >
      {openModules.map((m, i) => (
        <EntryContainer
          onClick={() => {
            actions.editor.moduleSelected({ id: m.id });
          }}
          active={currentModuleShortid === m.shortid}
          key={m.id}
        >
          <EntryIcons
            type={getType(m.title)}
            error={m.errors && m.errors.length > 0}
          />
          <Title>{m.title}</Title>
          <Dir>
            {getModulePath(sandbox.modules, sandbox.directories, m.id)
              .replace('/', '')
              .replace(new RegExp(m.title + '$'), '')}
          </Dir>
          {currentModuleShortid !== m.shortid && (
            <CrossIconContainer
              onClick={e => {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                }

                actions.editor.tabClosed(i);
              }}
            >
              <CrossIcon />
            </CrossIconContainer>
          )}
        </EntryContainer>
      ))}
    </WorkspaceItem>
  );
};
