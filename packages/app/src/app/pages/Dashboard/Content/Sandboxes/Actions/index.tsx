import React from 'react';

import { Container, VanillaButton } from './elements';

export interface IAction {
  name: string;
  run: () => void;
  Icon: React.FunctionComponentElement<any>;
}

interface Props {
  actions: IAction[];
}

export function DashboardActions({ actions }: Props) {
  return (
    <Container>
      {actions.map(action => (
        <VanillaButton key={action.name} onClick={() => action.run()}>
          {action.name} {action.Icon}
        </VanillaButton>
      ))}
    </Container>
  );
}
