import React from 'react';

import { Container, Tab, CrossIcon } from './elements';
import { ShellT } from '../types';

type Props = {
  shells: ShellT[];
  selectedShell?: string;
  selectShell: (id?: string) => void;
  closeShell: (id: string) => void;
};

export default class ShellTabs extends React.PureComponent<Props> {
  render() {
    const { selectedShell, shells } = this.props;
    return (
      <Container>
        {shells.map(shell => (
          <Tab
            selected={selectedShell === shell.id}
            key={shell.id}
            onClick={() => this.props.selectShell(shell.id)}
          >
            {shell.title}
            {shell.ended && ' (closed)'}

            <CrossIcon
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                this.props.closeShell(shell.id);
              }}
            />
          </Tab>
        ))}
      </Container>
    );
  }
}
