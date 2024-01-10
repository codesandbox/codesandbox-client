import { Text } from '@codesandbox/components';
import React, { FunctionComponent } from 'react';

import { Question } from './elements';
import { Prettier } from './Prettier';

export const CodeFormatting: FunctionComponent = () => (
  <>
    <Text block marginBottom={4} size={4} variant="muted" weight="regular">
      Prettier Settings{' '}
      <a
        href="https://prettier.io/docs/en/options.html"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Question />
      </a>
    </Text>

    <Prettier />
  </>
);
