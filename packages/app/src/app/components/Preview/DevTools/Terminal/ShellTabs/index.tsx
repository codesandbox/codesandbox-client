import React from 'react';
import { MdAdd } from 'react-icons/md';

import { ShellT } from '../types';
import { Container, CrossIcon, PlusContainer, Tab } from './elements';

type Props = {
  shells: ShellT[];
  selectedShell?: string;
  createShell: () => void;
  selectShell: (id?: string) => void;
  closeShell: (id: string) => void;
};

export class ShellTabs extends React.PureComponent<Props> {
  render() {
    const { selectedShell, createShell, shells } = this.props;
    return (
      <Container>
        <Tab
          selected={selectedShell === undefined}
          onClick={() => this.props.selectShell(undefined)}
        >
          yarn start
        </Tab>
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
        <PlusContainer onClick={() => createShell()}>
          <MdAdd />
        </PlusContainer>
      </Container>
    );
  }
}
