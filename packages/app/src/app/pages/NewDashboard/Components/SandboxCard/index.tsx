import React from 'react';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Element, Link } from '@codesandbox/components';

export const SandboxCard = ({ sandbox }) => (
  <Element>
    <Link href={sandboxUrl({ id: sandbox.id, alias: sandbox.alias })}>
      {sandbox.title || sandbox.alias || sandbox.id}
    </Link>
  </Element>
);
