import React from 'react';

import Question from 'react-icons/lib/go/question';

import Prettier from './Prettier';
import Title from '../MenuTitle';

export default () => (
  <div>
    <Title>
      Prettier Settings{' '}
      <a
        href="https://github.com/prettier/prettier#options"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Question style={{ marginBottom: '3px' }} />
      </a>
    </Title>

    <Prettier />
  </div>
);
