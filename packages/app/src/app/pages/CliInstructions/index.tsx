import React, { useEffect } from 'react';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { inject, hooksObserver } from 'app/componentConnectors';
import { Title } from 'app/components/Title';
import { SubTitle } from 'app/components/SubTitle';
import Navigation from 'app/pages/common/Navigation';
import { Container, Content, Code } from './elements';

const CLIInstructions = inject('signals')(
  hooksObserver(({ signals: { cliInstructionsMounted } }) => {
    useEffect(() => {
      cliInstructionsMounted();
    }, [cliInstructionsMounted]);

    return (
      <MaxWidth>
        <Margin vertical={1.5} horizontal={1.5}>
          <Container>
            <Navigation title="CLI Import" />

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
    );
  })
);

export default CLIInstructions;
