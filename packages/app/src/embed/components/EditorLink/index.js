// @flow

import React from 'react';
import type { Sandbox } from 'common/lib/types';

import Logo from 'common/lib/components/Logo';

import { sandboxUrl } from 'common/lib/utils/url-generator';

import { Text, EditText } from './elements';

function EditorLink({ sandbox, small }: { sandbox: Sandbox, small?: boolean }) {
  return (
    <EditText
      small={small}
      target="_blank"
      rel="noopener noreferrer"
      href={`${sandboxUrl(sandbox)}?from-embed`}
    >
      <Text small={small}>Open In CodeSandbox</Text>
      <Logo />
    </EditText>
  );
}

export default EditorLink;
