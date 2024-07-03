import React from 'react';
import EntryIcons from 'app/components/EntryIcons';
// eslint-disable-next-line import/extensions
import { getType } from 'app/utils/get-type.ts';

import { StyledNotSyncedIcon } from './elements';
import { TabTitle, TabDir, StyledCloseIcon } from '../Tab/elements';
import TabContainer from '../TabContainer';

export default class ModuleTab extends React.PureComponent {
  setCurrentModule = () => {
    this.props.setCurrentModule(this.props.module.id);
  };

  renderTabStatus = (hovering, closeTab) => {
    const { isNotSynced, tabCount } = this.props;

    if (hovering && isNotSynced && tabCount === 1) {
      return <StyledNotSyncedIcon show="true" />;
    }
    if (hovering && isNotSynced && tabCount > 1) {
      return <StyledCloseIcon onClick={closeTab} show="true" />;
    }
    if (hovering && tabCount === 1) {
      return <StyledCloseIcon onClick={closeTab} show={undefined} />;
    }
    if (hovering && tabCount > 1) {
      return <StyledCloseIcon onClick={closeTab} show="true" />;
    }
    if (!hovering && isNotSynced) {
      return <StyledNotSyncedIcon show="true" />;
    }
    if (!hovering && !isNotSynced) {
      return <StyledNotSyncedIcon show={undefined} />;
    }
    return <StyledNotSyncedIcon show={undefined} />;
  };

  render() {
    const { module, dirName, hasError, isNotSynced, ...props } = this.props;

    return (
      <TabContainer
        onClick={this.setCurrentModule}
        onDoubleClick={this.props.markNotDirty}
        items={
          isNotSynced
            ? [
                {
                  title: 'Discard Changes',
                  action: () => {
                    this.props.discardModuleChanges(this.props.module.shortid);
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

            {this.renderTabStatus(hovering, closeTab)}
          </>
        )}
      </TabContainer>
    );
  }
}
