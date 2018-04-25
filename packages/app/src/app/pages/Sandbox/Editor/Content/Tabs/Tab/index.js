import * as React from 'react';
import { observer } from 'mobx-react';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import getType from 'app/utils/get-type';

import {
  StyledCloseIcon,
  StyledNotSyncedIcon,
  Container,
  TabTitle,
  TabDir,
} from './elements';

class Tab extends React.Component {
  state = { hovering: false };

  handleMouseEnter = () => {
    this.setState({
      hovering: true,
    });
  };

  handleMouseLeave = () => {
    this.setState({
      hovering: false,
    });
  };

  onMouseDown = e => {
    if (e.button === 1) {
      // Middle mouse button
      this.closeTab(e);
    }
  };

  closeTab = e => {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.closeTab) {
      this.props.closeTab(this.props.position);
    }
  };

  renderTabStatus = () => {
    const { isNotSynced, tabCount } = this.props;
    const { hovering } = this.state;

    if (hovering && isNotSynced && tabCount === 1) {
      return <StyledNotSyncedIcon show={'true'} />;
    }
    if (hovering && isNotSynced && tabCount > 1) {
      return <StyledCloseIcon onClick={this.closeTab} show={'true'} />;
    }
    if (hovering && tabCount === 1) {
      return <StyledCloseIcon onClick={this.closeTab} show={undefined} />;
    }
    if (hovering && tabCount > 1) {
      return <StyledCloseIcon onClick={this.closeTab} show={'true'} />;
    }
    if (!hovering && isNotSynced) {
      return <StyledNotSyncedIcon show={'true'} />;
    }
    if (!hovering && !isNotSynced) {
      return <StyledNotSyncedIcon show={undefined} />;
    }
    return <StyledNotSyncedIcon show={undefined} />;
  };

  render() {
    const {
      active,
      dirty,
      isOver,
      onClick,
      onDoubleClick,
      module,
      dirName,
      hasError,
      isNotSynced,
    } = this.props;

    return (
      <Container
        active={active}
        dirty={dirty}
        isOver={isOver}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <EntryIcons
          isNotSynced={isNotSynced}
          type={getType(module.title)}
          error={hasError}
        />
        <TabTitle>{module.title}</TabTitle>
        {dirName && <TabDir>../{dirName}</TabDir>}

        {this.renderTabStatus()}
      </Container>
    );
  }
}

export default observer(Tab);
