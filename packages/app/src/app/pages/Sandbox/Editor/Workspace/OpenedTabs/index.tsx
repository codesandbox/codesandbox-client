import * as React from 'react';
import { connect } from 'app/fluent';

import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import getType from 'app/utils/get-type';
import { getModulePath } from 'common/sandbox/modules';

import CrossIcon from 'react-icons/lib/md/clear';

import WorkspaceItem from '../WorkspaceItem';
import { EntryContainer } from '../elements';
import { Title, Dir, CrossIconContainer } from './elements';
import SaveIcon from './SaveIcon';

export default connect()
    .with(({ state, signals }) => ({
        sandbox: state.editor.currentSandbox,
        isAllModulesSynced: state.editor.isAllModulesSynced,
        currentModuleShortid: state.editor.currentModuleShortid,
        tabs: state.editor.tabs,
        saveClicked: signals.editor.saveClicked,
        moduleSelected: signals.editor.moduleSelected,
        tabClosed: signals.editor.tabClosed
    }))
    .to(function OpenedTabs({
        sandbox,
        currentModuleShortid,
        tabs,
        isAllModulesSynced,
        saveClicked,
        moduleSelected,
        tabClosed
    }) {
        const moduleObject = {};
        sandbox.modules.forEach((m) => {
            moduleObject[m.shortid] = m;
        });

        const openModules = tabs.map((t) => moduleObject[t.moduleShortid]).filter((x) => x);

        return (
            <WorkspaceItem
                title='Open Tabs'
                actions={
                    <SaveIcon
                        disabled={isAllModulesSynced}
                        onClick={(e) => {
                            if (e) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            saveClicked();
                        }}
                    />
                }
            >
                {openModules.map((m, i) => (
                    <EntryContainer
                        onClick={() => {
                            moduleSelected({ id: m.id });
                        }}
                        active={currentModuleShortid === m.shortid}
                        key={m.id}
                    >
                        <EntryIcons type={getType(m.title, m.code)} error={m.errors && m.errors.length > 0} />
                        <Title>{m.title}</Title>
                        <Dir>
                            {getModulePath(sandbox.modules, sandbox.directories, m.id)
                                .replace('/', '')
                                .replace(new RegExp(m.title + '$'), '')}
                        </Dir>
                        {currentModuleShortid !== m.shortid && (
                            <CrossIconContainer
                                onClick={(e) => {
                                    if (e) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }

                                    tabClosed({ tabIndex: i });
                                }}
                            >
                                <CrossIcon />
                            </CrossIconContainer>
                        )}
                    </EntryContainer>
                ))}
            </WorkspaceItem>
        );
    });
