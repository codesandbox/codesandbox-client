import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { sortBy } from 'lodash-es';
import validateTitle from '../validateTitle';
import ModuleEntry from './ModuleEntry';
import DirectoryEntry from '../';

class DirectoryChildren extends React.Component {
  validateTitle = (id, title) => {
    const { directories, modules } = this.props.store.editor.currentSandbox;
    return !!validateTitle(id, title, [...directories, ...modules]);
  };

  render() {
    const {
      depth = 0,
      renameModule,
      setCurrentModule,
      parentShortid,
      deleteEntry,
      isInProjectView,
      markTabsNotDirty,
      store,
      discardModuleChanges,
    } = this.props;

    const {
      id: sandboxId,
      modules,
      directories,
      template: sandboxTemplate,
    } = store.editor.currentSandbox;
    const {
      mainModule,
      currentModuleShortid,
      errors,
      corrections,
    } = store.editor;
    const mainModuleId = mainModule.id;

    return (
      <div>
        {sortBy(directories, 'title')
          .filter(x => x.directoryShortid === parentShortid)
          .map(dir => (
            <DirectoryEntry
              key={dir.id}
              siblings={[...directories, ...modules]}
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
        {sortBy(
          modules.filter(x => x.directoryShortid === parentShortid),
          'title'
        ).map(m => (
          <ModuleEntry
            key={m.id}
            module={m}
            depth={depth}
            setCurrentModule={setCurrentModule}
            markTabsNotDirty={markTabsNotDirty}
            renameModule={renameModule}
            deleteEntry={deleteEntry}
            discardModuleChanges={discardModuleChanges}
          />
        ))}
      </div>
    );
  }
}

export default inject('store')(observer(DirectoryChildren));
