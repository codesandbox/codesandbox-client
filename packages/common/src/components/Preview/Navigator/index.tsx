import React from 'react';
import { ModuleViewIcon } from '../../icons/ModuleView';
import { ProjectViewIcon } from '../../icons/ProjectView';
import { NewWindowIcon } from '../../icons/NewWindow';
import { BackIcon } from '../../icons/Back';
import { ForwardIcon } from '../../icons/Forward';
import { ReloadIcon } from '../../icons/Reload';

import Tooltip from '../../Tooltip';

import AddressBar from '../AddressBar';
import {
  Container,
  Icons,
  Icon,
  AddressBarContainer,
  IconWithBackground,
} from './elements';

export interface NavigatorProps {
  url: string;
  onChange: (val: string) => void;
  onConfirm: () => void;
  onRefresh: () => void;
  toggleProjectView?: () => void;
  onBack?: () => void;
  onForward?: () => void;
  openNewWindow?: () => void;
  zenMode?: boolean;
  isProjectView: boolean;
}

function Navigator({
  url,
  onChange,
  onConfirm,
  onBack,
  onForward,
  onRefresh,
  isProjectView,
  toggleProjectView,
  openNewWindow,
  zenMode,
}: NavigatorProps) {
  return (
    <Container className="flying-container-handler" style={{ cursor: 'move' }}>
      <Icons>
        <Icon aria-label="Go Back" disabled={!onBack} onClick={onBack}>
          <BackIcon />
        </Icon>
        <Icon aria-label="Go Forward" disabled={!onForward} onClick={onForward}>
          <ForwardIcon />
        </Icon>
        <Icon aria-label="Refresh" onClick={onRefresh}>
          <ReloadIcon />
        </Icon>
      </Icons>
      <AddressBarContainer
        onMouseDown={e => {
          e.stopPropagation();
        }}
      >
        <AddressBar url={url} onChange={onChange} onConfirm={onConfirm} />
      </AddressBarContainer>
      {!zenMode && toggleProjectView && (
        <IconWithBackground
          onClick={toggleProjectView}
          moduleView={!isProjectView}
        >
          <Tooltip
            delay={0}
            content={isProjectView ? 'Project View' : 'Current Module View'}
            placement="left"
          >
            {isProjectView ? <ProjectViewIcon /> : <ModuleViewIcon />}
          </Tooltip>
        </IconWithBackground>
      )}
      {openNewWindow && (
        <IconWithBackground onClick={openNewWindow}>
          <Tooltip delay={0} content="Open In New Window">
            <NewWindowIcon />
          </Tooltip>
        </IconWithBackground>
      )}
    </Container>
  );
}

export default Navigator;
