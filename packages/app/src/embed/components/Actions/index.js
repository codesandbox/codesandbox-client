import React from 'react';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

import { Container, Button, HeartIcon } from './elements';

function Actions({ sandbox, toggleLike, previewVisible }) {
  return (
    <Container>
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

export default Actions;
