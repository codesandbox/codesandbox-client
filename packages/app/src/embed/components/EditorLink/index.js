import React from 'react';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

import { Button } from './elements';

function EditorLink({ sandbox }) {
  return (
    <Button
      id="openinsandbox"
      target="_blank"
      rel="noopener noreferrer"
      href={`${sandboxUrl(sandbox)}?from-embed`}
    >
      Open Sandbox
    </Button>
  );
}

export default EditorLink;
