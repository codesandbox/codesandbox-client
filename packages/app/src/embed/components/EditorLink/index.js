import React from 'react';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

import { Button } from './elements';

function EditorLink({ sandbox, previewVisible }) {
  return (
    <Button
      id="openinsandbox"
      target="_blank"
      rel="noopener noreferrer"
      href={`${sandboxUrl(sandbox)}?from-embed`}
      previewVisible={previewVisible}
    >
      Open Sandbox
    </Button>
  );
}

export default EditorLink;
