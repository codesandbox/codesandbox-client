import React from 'react';

import LeftIcon from 'react-icons/lib/fa/angle-left';
import RightIcon from 'react-icons/lib/fa/angle-right';
import RefreshIcon from 'react-icons/lib/md/refresh';
import ExternalIcon from 'react-icons/lib/md/open-in-new';

import Switch from 'common/components/Switch';
import Tooltip from 'common/components/Tooltip';

import HorizontalAlign from './HorizontalAlign';
import VerticalAlign from './VerticalAlign';
import AddressBar from '../AddressBar';
import {
  Container,
  Icons,
  Icon,
  AddressBarContainer,
  SwitchContainer,
} from './elements';

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
  alignRight,
  alignBottom,
}) {
  return (
    <Container className="flying-container-handler" style={{ cursor: 'move' }}>
      <Icons>
        <Icon disabled={!onBack} onClick={onBack}>
          <LeftIcon />
        </Icon>
        <Icon disabled={!onForward} onClick={onForward}>
          <RightIcon />
        </Icon>
        <Icon onClick={onRefresh}>
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
      {!zenMode &&
        alignBottom && (
          <Icon onClick={alignBottom}>
            <Tooltip title="Align To Bottom">
              <HorizontalAlign />
            </Tooltip>
          </Icon>
        )}
      {!zenMode &&
        alignRight && (
          <Icon onClick={alignRight}>
            <Tooltip title="Align To Right">
              <VerticalAlign />
            </Tooltip>
          </Icon>
        )}

      {!zenMode &&
        openNewWindow && (
          <Icon style={{ marginRight: '0.75rem' }} onClick={openNewWindow}>
            <Tooltip title="Open In A New Window">
              <ExternalIcon />
            </Tooltip>
          </Icon>
        )}
      {!zenMode &&
        toggleProjectView && (
          <SwitchContainer>
            <Tooltip
              title={isProjectView ? 'Project View' : 'Current Module View'}
              position="left"
            >
              <Switch right={isProjectView} onClick={toggleProjectView} />
            </Tooltip>
          </SwitchContainer>
        )}
    </Container>
  );
}

export default Navigator;
