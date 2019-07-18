import React from 'react';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
// eslint-disable-next-line import/extensions
import getType from 'app/utils/get-type.ts';
import {
  ITabProps,
  IRenderTabsProps,
  TabTitle,
  TabDir,
  StyledCloseIcon,
} from '../Tab';
import { TabContainer } from '../TabContainer';
import { StyledNotSyncedIcon } from './elements';

interface IModuleTabProps extends ITabProps {
  dirName?: string;
  hasError?: boolean;
  isNotSynced?: boolean;
  tabCount: number;
  module: any;
  markNotDirty?: Function;
  setCurrentModule?: Function;
  discardModuleChanges?: Function;
}

export const ModuleTab: React.FC<IModuleTabProps> = ({
  dirName,
  hasError = false,
  isNotSynced,
  tabCount,
  module,
  markNotDirty,
  setCurrentModule,
  discardModuleChanges,
  ...props
}) => {
  const renderTabStatus: React.FC<IRenderTabsProps> = ({
    isHovering,
    closeTab,
  }) => {
    if (isHovering && isNotSynced && tabCount === 1) {
      return <StyledNotSyncedIcon show />;
    }
    if (isHovering && isNotSynced && tabCount > 1) {
      return <StyledCloseIcon onClick={closeTab} show />;
    }
    if (isHovering && tabCount === 1) {
      return <StyledCloseIcon onClick={closeTab} />;
    }
    if (isHovering && tabCount > 1) {
      return <StyledCloseIcon onClick={closeTab} show />;
    }
    if (!isHovering && isNotSynced) {
      return <StyledNotSyncedIcon show />;
    }
    if (!isHovering && !isNotSynced) {
      return <StyledNotSyncedIcon />;
    }
    return <StyledNotSyncedIcon />;
  };

  return (
    <TabContainer
      onClick={() => setCurrentModule(module.id)}
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
      {({ isHovering, closeTab }) => (
        <>
          <EntryIcons type={getType(module.title)} error={hasError} />
          <TabTitle>{module.title}</TabTitle>
          {dirName && <TabDir>../{dirName}</TabDir>}
          {renderTabStatus({ isHovering, closeTab })}
        </>
      )}
    </TabContainer>
  );
};
