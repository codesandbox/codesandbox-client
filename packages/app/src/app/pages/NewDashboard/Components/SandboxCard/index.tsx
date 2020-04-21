import React from 'react';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Element, Link } from '@codesandbox/components';
import css from '@styled-system/css';

export const SandboxCard = ({ sandbox }) => (
  <Element
    css={css({
      width: '100%',
      height: 240,
      border: '1px solid',
      borderColor: 'grays.600',
      borderRadius: 'medium',
    })}
  >
    <Link href={sandboxUrl({ id: sandbox.id, alias: sandbox.alias })}>
      {sandbox.title || sandbox.alias || sandbox.id}
    </Link>
  </Element>
);
