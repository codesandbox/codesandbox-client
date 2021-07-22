import React, { useEffect, useState } from 'react';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { ExperimentValues, useExperimentResult } from '@codesandbox/ab';

import Logo from '../../logo.svg';

import {
  Container,
  Button,
  HeartIcon,
  ReloadIcon,
  NewWindowIcon,
  CodeSandboxIcon,
  PreviewIcon,
  IconButton,
} from './elements';

export function GlobalActions({
  sandbox,
  toggleLike,
  offsetBottom,
  isDragging,
  openEditor,
  openPreview,
  smallTouchScreen,
  previewVisible,
  initialPath,
}) {
  const experimentPromise = useExperimentResult('embed-open-wording');
  const [openWordingB, setOpenWordingB] = useState(false);

  useEffect(() => {
    /* Wait for the API */
    experimentPromise.then(experiment => {
      if (experiment === ExperimentValues.A) {
        /**
         * A
         */
        setOpenWordingB(false);
      } else if (experiment === ExperimentValues.B) {
        /**
         * B
         */
        setOpenWordingB(true);
      }
    });
  }, [experimentPromise]);

  const smallTouchScreenButton = previewVisible ? (
    <Button onClick={openEditor}>View Source</Button>
  ) : (
    <IconButton onClick={openPreview}>
      <PreviewIcon />
    </IconButton>
  );

  const isEmbedded = window.parent !== window;

  return (
    <Container
      align="right"
      offsetBottom={offsetBottom}
      isDragging={isDragging}
    >
      {toggleLike ? (
        <Tooltip
          content={sandbox.userLiked ? 'Dislike sandbox' : 'Like sandbox'}
        >
          <Button
            onClick={toggleLike}
            aria-label={sandbox.userLiked ? 'Dislike sandbox' : 'Like sandbox'}
          >
            <HeartIcon liked={sandbox.userLiked} />
          </Button>
        </Tooltip>
      ) : (
        smallTouchScreen &&
        isEmbedded && (
          <IconButton
            as="a"
            target="_blank"
            rel="noopener noreferrer"
            href={sandboxUrl(sandbox)}
          >
            <CodeSandboxIcon />
          </IconButton>
        )
      )}
      {smallTouchScreen ? (
        smallTouchScreenButton
      ) : (
        <Button
          as="a"
          target="_blank"
          rel="noopener noreferrer"
          href={
            initialPath
              ? `${sandboxUrl(
                  sandbox
                )}?from-embed&initialpath=${encodeURIComponent(initialPath)}`
              : `${sandboxUrl(sandbox)}?from-embed`
          }
        >
          {openWordingB ? (
            <>
              <img
                src={Logo}
                width="32"
                alt="CodeSandbox Logo"
                style={{
                  paddingRight: '8px',
                  width: '18px',
                  top: '-1px',
                  position: 'relative',
                }}
              />
              Edit Sandbox
            </>
          ) : (
            'Open Sandbox'
          )}
        </Button>
      )}
    </Container>
  );
}

export function NavigationActions({
  refresh,
  openInNewWindow,
  offsetBottom,
  isDragging,
}) {
  return (
    <Container align="left" offsetBottom={offsetBottom} isDragging={isDragging}>
      <Tooltip content="Refresh preview">
        <Button onClick={refresh} aria-label="Refresh preview">
          <ReloadIcon />
        </Button>
      </Tooltip>
      <Tooltip content="Open preview in new window">
        <Button
          onClick={openInNewWindow}
          aria-label="Open preview in new window"
        >
          <NewWindowIcon />
        </Button>
      </Tooltip>
    </Container>
  );
}
