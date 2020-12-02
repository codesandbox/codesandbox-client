import React from 'react';
import { Icon as ComponentsIcon } from '@codesandbox/components';
import { ModuleViewIcon } from '../../icons/ModuleView';
import { ProjectViewIcon } from '../../icons/ProjectView';
import { NewWindowIcon } from '../../icons/NewWindow';
import { BackIcon } from '../../icons/Back';
import { ForwardIcon } from '../../icons/Forward';
import { ReloadIcon } from '../../icons/Reload';
import { ResponsivePreview } from '../../icons/ResponsivePreview';

import Tooltip from '../../Tooltip';

import AddressBar from '../AddressBar';
import {
  Container,
  Icons,
  Icon,
  AddressBarContainer,
  IconWithBackground,
  SpinnerWrapper,
} from './elements';
import { Sandbox } from '../../../types';

export interface NavigatorProps {
  url: string;
  onChange: (val: string) => void;
  onConfirm: () => void;
  onRefresh: () => void;
  toggleProjectView?: () => void;
  onBack?: () => void;
  onForward?: () => void;
  openNewWindow?: () => void;
  toggleResponsiveView?: () => void;
  createPreviewComment?: () => void;
  isInResponsivePreview?: boolean;
  isPreviewCommentModeActive?: boolean;
  zenMode?: boolean;
  isProjectView: boolean;
  isScreenshotLoading?: boolean;
  sandbox?: Sandbox;
}

function Navigator({
  sandbox,
  url,
  onChange,
  onConfirm,
  onBack,
  onForward,
  onRefresh,
  isProjectView,
  toggleProjectView,
  openNewWindow,
  toggleResponsiveView,
  isInResponsivePreview,
  isScreenshotLoading,
  createPreviewComment,
  isPreviewCommentModeActive,
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

      {createPreviewComment && (
        <IconWithBackground
          onClick={createPreviewComment}
          style={{
            color:
              isPreviewCommentModeActive && !isScreenshotLoading
                ? '#FF3B30'
                : '#757575',
          }}
        >
          <Tooltip delay={0} content="Add Preview Comment">
            {isScreenshotLoading ? (
              <SpinnerWrapper>
                <ComponentsIcon name="spinner" />
              </SpinnerWrapper>
            ) : (
              <ComponentsIcon
                name="comment"
                size={12}
                style={{ top: -1, position: 'relative' }}
              />
            )}
          </Tooltip>
        </IconWithBackground>
      )}
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
      {toggleResponsiveView && (
        <IconWithBackground onClick={toggleResponsiveView}>
          <Tooltip delay={0} content="Toggle Responsive Preview">
            <ResponsivePreview active={isInResponsivePreview} />
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
