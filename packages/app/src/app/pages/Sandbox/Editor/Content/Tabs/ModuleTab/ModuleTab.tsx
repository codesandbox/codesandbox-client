import React from 'react';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
// eslint-disable-next-line import/extensions
import getType from 'app/utils/get-type.ts';
import { StyledNotSyncedIcon } from './elements';
import { TabTitle, TabDir, StyledCloseIcon } from '../Tab/elements';
import TabContainer from '../TabContainer';

export const ModuleTab = ({
  dirName,
  hasError,
  isNotSynced,
  tabCount,
  module,
  markNotDirty,
  setCurrentModule,
  discardModuleChanges,
  ...props
}) => {
  const renderTabStatus = (hovering, closeTab) => {
    if (hovering && isNotSynced && tabCount === 1) {
      return <StyledNotSyncedIcon show={'true'} />;
    }
    if (hovering && isNotSynced && tabCount > 1) {
      return <StyledCloseIcon onClick={closeTab} show={'true'} />;
    }
    if (hovering && tabCount === 1) {
      return <StyledCloseIcon onClick={closeTab} show={undefined} />;
    }
    if (hovering && tabCount > 1) {
      return <StyledCloseIcon onClick={closeTab} show={'true'} />;
    }
    if (!hovering && isNotSynced) {
      return <StyledNotSyncedIcon show={'true'} />;
    }
    if (!hovering && !isNotSynced) {
      return <StyledNotSyncedIcon show={undefined} />;
    }
    return <StyledNotSyncedIcon show={undefined} />;
  };

  return (
    <TabContainer
      onClick={() => {
        setCurrentModule(module.id);
      }}
      onDoubleClick={markNotDirty}
      items={
        isNotSynced
          ? [
              {
                title: 'Discard Changes',
                action: () => {
                  discardModuleChanges(module.shortid);
                  return true;
                },
              },
            ]
          : []
      }
      {...props}
    >
      {({ hovering, closeTab }) => (
        <>
          <EntryIcons
            isNotSynced={isNotSynced}
            type={getType(module.title)}
            error={hasError}
          />
          <TabTitle>{module.title}</TabTitle>
          {dirName && <TabDir>../{dirName}</TabDir>}
          {renderTabStatus(hovering, closeTab)}
        </>
      )}
    </TabContainer>
  );
};
