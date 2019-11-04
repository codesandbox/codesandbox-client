import React from 'react';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

import {
  Container,
  Button,
  HeartIcon,
  ReloadIcon,
  NewWindowIcon,
} from './elements';

export function GlobalActions({
  sandbox,
  toggleLike,
  previewVisible,
  isDragging,
}) {
  return (
    <Container
      align="right"
      previewVisible={previewVisible}
      isDragging={isDragging}
    >
      {toggleLike ? (
        <Button onClick={toggleLike}>
          <HeartIcon liked={sandbox.userLiked} />
        </Button>
      ) : null}
      <Button
        as="a"
        target="_blank"
        rel="noopener noreferrer"
        href={`${sandboxUrl(sandbox)}?from-embed`}
      >
        Open Sandbox
      </Button>
    </Container>
  );
}

export function NavigationActions({ refresh, openInNewWindow, isDragging }) {
  return (
    <Container align="left" previewVisible isDragging={isDragging}>
      <Button onClick={refresh}>
        <ReloadIcon />
      </Button>
      <Button onClick={openInNewWindow}>
        <NewWindowIcon />
      </Button>
    </Container>
  );
}
