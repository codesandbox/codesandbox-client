// @flow
import React from 'react';
import type { ShellT } from '../';

import { Container, Tab, CrossIcon } from './elements';

type Props = {
  shells: Array<ShellT>,
  selectedShell: ?string,
  selectShell: (id: ?string) => void,
  closeShell: (id: string) => void,
};

export default class ShellTabs extends React.PureComponent<Props> {
  render() {
    const { selectedShell, shells } = this.props;
    return (
      <Container>
        <Tab
          selected={selectedShell === null}
          onClick={() => this.props.selectShell(null)}
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
      </Container>
    );
  }
}
