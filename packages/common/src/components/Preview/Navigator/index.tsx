import React from 'react';

import LeftIcon from 'react-icons/lib/fa/angle-left';
import RightIcon from 'react-icons/lib/fa/angle-right';
import RefreshIcon from 'react-icons/lib/md/refresh';

import Switch from '../../Switch';
import Tooltip from '../../Tooltip';

import AddressBar from '../AddressBar';
import ExternalIcon from './ExternalOpen';
import {
  Container,
  Icons,
  Icon,
  AddressBarContainer,
  SwitchContainer,
} from './elements';

export interface NavigatorProps {
  url: string;
  onChange: (val: string) => void;
  onConfirm: () => void;
  isProjectView: boolean;
  onRefresh: () => void;
  toggleProjectView?: () => void;
  onBack?: () => void;
  onForward?: () => void;
  openNewWindow?: () => void;
  zenMode?: boolean;
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
          <LeftIcon />
        </Icon>
        <Icon aria-label="Go Forward" disabled={!onForward} onClick={onForward}>
          <RightIcon />
        </Icon>
        <Icon aria-label="Refresh" onClick={onRefresh}>
          <RefreshIcon />
        </Icon>
      </Icons>
      <AddressBarContainer
        onMouseDown={e => {
          e.stopPropagation();
        }}
      >
        <AddressBar url={url} onChange={onChange} onConfirm={onConfirm} />
      </AddressBarContainer>
      {openNewWindow && (
        <Icon
          style={{ fontSize: 18, padding: 4, marginRight: zenMode ? 8 : 16 }}
          onClick={openNewWindow}
        >
          <Tooltip delay={0} content="Open In New Window">
            <ExternalIcon />
          </Tooltip>
        </Icon>
      )}
      {!zenMode && toggleProjectView && (
        <SwitchContainer>
          <Tooltip
            delay={0}
            content={isProjectView ? 'Project View' : 'Current Module View'}
            placement="left"
          >
            <Switch
              offMode
              secondary
              small
              right={!isProjectView}
              onClick={toggleProjectView}
            />
          </Tooltip>
        </SwitchContainer>
      )}
    </Container>
  );
}

export default Navigator;
