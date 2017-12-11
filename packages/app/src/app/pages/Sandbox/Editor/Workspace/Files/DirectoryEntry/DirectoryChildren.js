// @flow
import * as React from 'react';

import getType from 'app/store/entities/sandboxes/modules/utils/get-type';
import validateTitle from './validateTitle';
import Entry from './Entry';
import DirectoryEntry from './';

export default class DirectoryChildren extends React.PureComponent {
  validateTitle = (id, title) => {
    const { directories, modules } = this.props;
    return !!validateTitle(id, title, [...directories, ...modules]);
  };

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
    } = this.props;

    return (
      <div>
        {directories
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
              currentModuleId={currentModuleId}
              isInProjectView={isInProjectView}
              markTabsNotDirty={markTabsNotDirty}
              errors={errors}
              corrections={corrections}
            />
          ))}
        {modules.filter(x => x.directoryShortid === parentShortid).map(m => {
          const isActive = m.id === currentModuleId;
          const mainModule = m.id === mainModuleId;
          const type = getType(m.title, m.code);

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
              isNotSynced={m.isNotSynced}
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
}
