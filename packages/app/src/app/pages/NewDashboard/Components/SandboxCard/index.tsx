import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Element, Link } from '@codesandbox/components';
import React from 'react';

export const SandboxCard = ({ sandbox }) => (
  <Element>
    <Link href={sandboxUrl({ id: sandbox.id, alias: sandbox.alias })}>
      {getSandboxName(sandbox)}
    </Link>
  </Element>
);
