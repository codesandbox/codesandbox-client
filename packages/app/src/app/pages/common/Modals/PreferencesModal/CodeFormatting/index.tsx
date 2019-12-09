import React, { FunctionComponent } from 'react';

import { Title } from '../elements';

import { Question } from './elements';
import { Prettier } from './Prettier';

export const CodeFormatting: FunctionComponent = () => (
  <div>
    <Title>
      Prettier Settings{' '}
      <a
        href="https://prettier.io/docs/en/options.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Question />
      </a>
    </Title>

    <Prettier />
  </div>
);
