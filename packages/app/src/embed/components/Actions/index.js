import React from 'react';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

import { Container, Button, HeartIcon } from './elements';

export function GlobalActions({ sandbox, toggleLike, previewVisible }) {
  return (
    <Container align="right">
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
        previewVisible={previewVisible}
      >
        Open Sandbox
      </Button>
    </Container>
  );
}

export function NavigationActions({ refresh, openInNewWindow }) {
  return (
    <Container align="left">
      <Button onClick={refresh}>
        <HeartIcon />
      </Button>
      <Button onClick={openInNewWindow}>
        <HeartIcon />
      </Button>
    </Container>
  );
}
