import * as React from 'react';
import { observer } from 'mobx-react';

import { Container, TabTitle, StyledCloseIcon } from './elements';

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
    const { tabCount } = this.props;
    const { hovering } = this.state;

    if (hovering && tabCount > 1) {
      return <StyledCloseIcon onClick={this.closeTab} show={'true'} />;
    }

    return <StyledCloseIcon onClick={this.closeTab} show={undefined} />;
  };

  render() {
    const {
      active,
      dirty,
      isOver,
      onClick,
      onDoubleClick,
      children,
      title,
    } = this.props;
    const { hovering } = this.state;

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
        {title ? (
          <React.Fragment>
            <TabTitle>{title}</TabTitle>
            {this.renderTabStatus()}
          </React.Fragment>
        ) : (
          children({ hovering, closeTab: this.closeTab })
        )}
      </Container>
    );
  }
}

export default observer(Tab);
