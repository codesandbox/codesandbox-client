import React, { FunctionComponent } from 'react';

import { Text } from '@codesandbox/components';

import { Question } from './elements';
import { Prettier } from './Prettier';

export const CodeFormatting: FunctionComponent = () => (
  <>
    <Text size={4} marginBottom={4} block variant="muted" weight="bold">
      Prettier Settings{' '}
      <a
        href="https://prettier.io/docs/en/options.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Question />
      </a>
    </Text>
    <Prettier />
  </>
);
