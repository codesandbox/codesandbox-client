import * as React from 'react';
import styled, { css } from 'styled-components';
import ChevronLeft from 'react-icons/lib/md/chevron-left';
import ExitZen from 'react-icons/lib/md/fullscreen-exit';

import { getModulePath } from 'app/store/entities/sandboxes/modules/selectors';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import getType from 'app/store/entities/sandboxes/modules/utils/get-type';
import { withTooltip } from 'common/components/Tooltip';

import type { Module, Directory } from 'common/types';

const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  height: 2.5rem;
  flex: 0 0 2.5rem;

  display: flex;
  align-items: center;
  font-size: 0.875rem;

  color: rgba(255, 255, 255, 0.8);
  padding: 0 0.5rem;
`;

const Chevron = styled(ChevronLeft)`
  transition: 0.3s ease all;
  position: absolute;
  font-size: 1rem;

  opacity: 0;
  cursor: pointer;

  ${props => props.hovering && 'opacity: 1;'};

  transform: rotateZ(${props => (props.workspaceHidden ? '180deg' : '0')});
  &:hover {
    transform: rotateZ(
      ${props => (props.workspaceHidden ? '135deg' : '45deg')}
    );
    color: white;
  }
`;

const FileName = styled.div`
  transition: 0.3s ease transform;
  transform: ${props => (props.hovering ? 'translateX(20px)' : 'none')};
  flex: 1;
`;

const StyledExitZen = withTooltip(
  styled(ExitZen)`
    transition: 0.3s ease opacity;

    opacity: 0;
    cursor: pointer;
    font-size: 1.25rem;

    z-index: 10;

    ${props =>
      props.hovering &&
      css`
        opacity: 0.7;

        &:hover {
          opacity: 1;
        }
      `};
  `,
  { title: 'Close Zen Mode', style: { zIndex: 10 } }
);

type Props = {
  modules: Array<Module>,
  directories: Array<Directory>,
  currentModule: Module,
  workspaceHidden: boolean,
  toggleWorkspace: Function,
  exitZenMode: Function,
};

export default class FilePath extends React.Component<Props> {
  state = {
    hovering: false,
  };

  onMouseEnter = () => {
    this.setState({ hovering: true });
  };

  onMouseLeave = () => {
    this.setState({ hovering: false });
  };

  render() {
    const {
      currentModule,
      modules,
      directories,
      workspaceHidden,
      toggleWorkspace,
      exitZenMode,
    } = this.props;
    const path = getModulePath(modules, directories, currentModule.id);

    const pathParts = path.split('/');
    const fileName = pathParts.pop();
    const directoryPath = pathParts
      .join('/')
      .replace(/\/$/, '')
      .replace(/^\//, '');

    return (
      <Container
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Chevron
          onClick={toggleWorkspace}
          workspaceHidden={workspaceHidden}
          hovering={!workspaceHidden || this.state.hovering}
        />
        <FileName hovering={!workspaceHidden || this.state.hovering}>
          <EntryIcons
            isNotSynced={currentModule.isNotSynced}
            type={getType(currentModule.title, currentModule.code)}
            error={currentModule.errors && currentModule.errors.length > 0}
          />
          <span style={{ marginLeft: '0.25rem' }}>{fileName}</span>
          <span
            style={{ marginLeft: '.75rem', color: 'rgba(255, 255, 255, 0.6)' }}
          >
            {directoryPath}
          </span>
        </FileName>

        <StyledExitZen hovering={this.state.hovering} onClick={exitZenMode} />
      </Container>
    );
  }
}
