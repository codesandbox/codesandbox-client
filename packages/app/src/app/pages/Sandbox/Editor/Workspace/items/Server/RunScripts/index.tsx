import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { SubTitle } from '../elements';

import { TasksContainer } from './elements';
import { Scripts } from './Scripts';

export const RunScripts: FunctionComponent = () => {
  const {
    state: {
      server: { status },
    },
  } = useOvermind();

  return (
    <Margin top={1.5}>
      <SubTitle>Run Scripts</SubTitle>

      <Margin top={0.5}>
        <TasksContainer disconnected={status !== 'connected'}>
          <Scripts />
        </TasksContainer>
      </Margin>
    </Margin>
  );
};
