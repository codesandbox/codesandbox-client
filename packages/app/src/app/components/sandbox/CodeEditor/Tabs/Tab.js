// @flow

import * as React from 'react';
import styled, { css } from 'styled-components';

import NotSyncedIcon from 'react-icons/lib/go/primitive-dot';
import CloseIcon from 'react-icons/lib/go/x';

import type { Module } from 'common/types';

import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import getType from 'app/store/entities/sandboxes/modules/utils/get-type';

const StyledCloseIcon = styled(CloseIcon)`
  transition: 0.1s ease opacity;

  float: right;
  opacity: 1;
  color: rgba(255, 255, 255, 0.9);
  margin-right: 0;

  ${props =>
    !props.show &&
    css`
      pointer-events: none;
      opacity: 0;
    `};
`;
const StyledNotSyncedIcon = StyledCloseIcon.withComponent(NotSyncedIcon);

const Container = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  height: calc(100% - 1px);
  font-size: 0.875rem;
  cursor: pointer;

  border-bottom: 1px solid transparent;

  padding: 0 1rem;
  padding-left: 0.75rem;
  padding-right: 0.125rem;
  color: rgba(255, 255, 255, 0.5);

  svg {
    font-size: 1rem;
    margin-right: 0.5rem;
  }

  ${props =>
    props.isOver &&
    css`
      background-color: ${props.theme.background2.lighten(0.2)};
    `};
  ${props =>
    props.active &&
    css`
      background-color: ${props.theme.background2};
      border-color: ${props.theme.secondary};
      color: white;
    `};
  ${props =>
    props.dirty &&
    css`
      font-style: italic;
    `};
`;

const TabTitle = styled.div`
  padding-right: 0.5rem;
  padding-left: 6px;
  white-space: nowrap;
`;

const TabDir = styled.div`
  color: rgba(255, 255, 255, 0.3);
  padding-right: 0.5rem;
  white-space: nowrap;
`;

type Props = {
  active: ?boolean,
  dirty: ?boolean,
  isOver: ?boolean,
  onClick: Function,
  onDoubleClick: ?Function,
  module: Module,
  dirName: ?string,
  tabCount: number,
  position: number,
  closeTab: ?(pos: number) => void,
};

type State = {
  hovering: boolean,
};

export default class Tab extends React.PureComponent<Props, State> {
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

  onMouseDown = (e: MouseEvent) => {
    if (e.button === 1) {
      // Middle mouse button
      this.closeTab(e);
    }
  };

  closeTab = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.closeTab) {
      this.props.closeTab(this.props.position);
    }
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
      tabCount,
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
        <EntryIcons
          isNotSynced={module.isNotSynced}
          type={getType(module.title, module.code)}
          error={module.errors && module.errors.length > 0}
        />
        <TabTitle>{module.title}</TabTitle>
        {dirName && <TabDir>../{dirName}</TabDir>}
        {this.props.closeTab && module.isNotSynced ? (
          <StyledNotSyncedIcon
            onClick={tabCount > 1 ? this.closeTab : null}
            show
          />
        ) : (
          <StyledCloseIcon
            onClick={this.closeTab}
            show={tabCount > 1 && (active || hovering) ? 'true' : undefined}
          />
        )}
      </Container>
    );
  }
}
