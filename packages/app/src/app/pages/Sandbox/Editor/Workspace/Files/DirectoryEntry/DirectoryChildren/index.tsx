import * as React from 'react';
<<<<<<< HEAD:packages/app/src/app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/DirectoryChildren/index.js
import { inject, observer } from 'mobx-react';
import { sortBy } from 'lodash';
=======
import getType from 'app/utils/get-type';
>>>>>>> refactored sandbox:packages/app/src/app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/DirectoryChildren/index.tsx
import validateTitle from '../validateTitle';
import ModuleEntry from './ModuleEntry';
import DirectoryEntry from '../';
import { Directory, Module, SandboxError, Correction } from 'app/store/modules/editor/types'

<<<<<<< HEAD:packages/app/src/app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/DirectoryChildren/index.js
class DirectoryChildren extends React.Component {
    validateTitle = (id, title) => {
        const { directories, modules } = this.props.store.editor.currentSandbox;
        return !!validateTitle(id, title, [ ...directories, ...modules ]);
    };
=======
type Props = {
  directories: Directory[]
  modules: Module[]
  depth: number
  renameModule: (id: string, shortid: string) => void
  openMenu: () => void
  setCurrentModule: (moduleId: string) => void
  parentShortid: string
  sandboxId: string
  mainModuleId: string
  sandboxTemplate: string
  deleteEntry: (shortid: string, title: string) => void
  currentModuleId: string
  isInProjectView: boolean
  markTabsNotDirty: () => void
  errors: SandboxError[]
  corrections: Correction[]
  changedModuleShortids: string[]
}

class DirectoryChildren extends React.Component<Props> {
  validateTitle = (id, title) => {
    return !!validateTitle(id, title);
  };
>>>>>>> refactored sandbox:packages/app/src/app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/DirectoryChildren/index.tsx

<<<<<<< HEAD
    render() {
        const {
            depth = 0,
            renameModule,
            setCurrentModule,
            parentShortid,
            deleteEntry,
            isInProjectView,
            markTabsNotDirty,
            store
        } = this.props;

        const { id: sandboxId, modules, directories, template: sandboxTemplate } = store.editor.currentSandbox;
        const { mainModule, currentModuleShortid, errors, corrections } = store.editor;
        const mainModuleId = mainModule.id;
=======
  render() {
    const {
      depth = 0,
      renameModule,
      openMenu,
      setCurrentModule,
      directories,
      parentShortid,
      sandboxId,
      mainModuleId,
      sandboxTemplate,
      modules,
      deleteEntry,
      currentModuleId,
      isInProjectView,
      markTabsNotDirty,
      errors,
      corrections,
      changedModuleShortids,
    } = this.props;

    return (
      <div>
        {directories
          .filter(x => x.directoryShortid === parentShortid)
          .map(dir => (
            <DirectoryEntry
              key={dir.id}
              depth={depth + 1}
              id={dir.id}
              shortid={dir.shortid}
              title={dir.title}
              sandboxId={sandboxId}
              sandboxTemplate={sandboxTemplate}
              mainModuleId={mainModuleId}
              modules={modules}
              directories={directories}
              currentModuleId={currentModuleId}
              isInProjectView={isInProjectView}
              markTabsNotDirty={markTabsNotDirty}
              errors={errors}
              corrections={corrections}
              changedModuleShortids={changedModuleShortids}
            />
          ))}
        {modules.filter(x => x.directoryShortid === parentShortid).map(m => {
          const isActive = m.id === currentModuleId;
          const mainModule = m.id === mainModuleId;
          const type = getType(m.title, m.code);
>>>>>>> Fixed bug related to changedModuleIds

<<<<<<< HEAD
        return (
            <div>
                {sortBy(directories, 'title')
                    .filter((x) => x.directoryShortid === parentShortid)
                    .map((dir) => (
                        <DirectoryEntry
                            key={dir.id}
                            siblings={[ ...directories, ...modules ]}
                            depth={depth + 1}
                            id={dir.id}
                            shortid={dir.shortid}
                            title={dir.title}
                            sandboxId={sandboxId}
                            sandboxTemplate={sandboxTemplate}
                            mainModuleId={mainModuleId}
                            modules={modules}
                            directories={directories}
                            currentModuleShortid={currentModuleShortid}
                            isInProjectView={isInProjectView}
                            markTabsNotDirty={markTabsNotDirty}
                            errors={errors}
                            corrections={corrections}
                        />
                    ))}
                {sortBy(modules.filter((x) => x.directoryShortid === parentShortid), 'title').map((m) => (
                    <ModuleEntry
                        key={m.id}
                        module={m}
                        depth={depth}
                        setCurrentModule={setCurrentModule}
                        markTabsNotDirty={markTabsNotDirty}
                        renameModule={renameModule}
                        deleteEntry={deleteEntry}
                    />
                ))}
            </div>
        );
    }
=======
          const hasError =
            m && errors.filter(error => error.moduleId === m.id).length;

          return (
            <Entry
              key={m.id}
              id={m.id}
              shortid={m.shortid}
              title={m.title}
              depth={depth + 1}
              active={isActive}
              type={type || 'function'}
              rename={mainModule ? undefined : renameModule}
              openMenu={openMenu}
              deleteEntry={mainModule ? undefined : deleteEntry}
              isNotSynced={changedModuleShortids.indexOf(m.shortid) >= 0}
              renameValidator={this.validateTitle}
              setCurrentModule={setCurrentModule}
              isInProjectView={isInProjectView}
              isMainModule={mainModule}
              moduleHasError={hasError}
              markTabsNotDirty={markTabsNotDirty}
            />
          );
        })}
      </div>
    );
  }
>>>>>>> Initial refactor
}

export default DirectoryChildren
