import React from 'react';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

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
          Open Sandbox
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
