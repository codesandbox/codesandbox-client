import React, { FunctionComponent, useEffect } from 'react';

import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import { Element } from '@codesandbox/components';

import { Container } from './elements';
import { Prompt } from './Prompt';

export const CLI: FunctionComponent = () => {
  const {
    actions: { cliMounted },
  } = useOvermind();

  useEffect(() => {
    cliMounted();
  }, [cliMounted]);

  return (
    <Element style={{ width: '100vw', height: '100vh' }}>
      <Navigation title="CLI Authorization" />
      <Container>
        <Prompt />
      </Container>
    </Element>
  );
};
