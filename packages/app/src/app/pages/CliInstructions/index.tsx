import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import React, { FunctionComponent, useEffect } from 'react';

import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import { useActions } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import { Element } from '@codesandbox/components';

import { Code, Container, Content } from './elements';

export const CLIInstructions: FunctionComponent = () => {
  const { cliInstructionsMounted } = useActions();

  useEffect(() => {
    cliInstructionsMounted();
  }, [cliInstructionsMounted]);

  return (
    <Element style={{ width: '100vw', height: '100vh' }}>
      <Navigation title="CLI Import" />
      <MaxWidth>
        <Margin horizontal={1.5} vertical={1.5}>
          <Container>
            <Content vertical>
              <Title>Import from CLI</Title>

              <SubTitle>
                1. Install the CLI <Code>npm i -g codesandbox</Code>
              </SubTitle>

              <SubTitle>
                2. Go to your project <Code>cd path-of-your-project</Code>
              </SubTitle>

              <SubTitle>
                3. Deploy your project to CodeSandbox{' '}
                <Code>codesandbox ./</Code>
              </SubTitle>
            </Content>
          </Container>
        </Margin>
      </MaxWidth>
    </Element>
  );
};
