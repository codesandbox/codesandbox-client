import React from 'react';

import ChevronRight from 'react-icons/lib/md/chevron-right';
import theme from 'common/theme';

import { IconContainer } from '../elements';
import { Container, Input } from './elements';

export default class ConsoleInput extends React.PureComponent {
  state = {
    command: '',
    commandHistory: [],
    commandCursor: -1,
  };

  onChange = e => {
    if (e.target) {
      this.setState({ command: e.target.value });
    }
  };

  handleKeyDown = e => {
    const { evaluateConsole } = this.props;

    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      // Enter
      evaluateConsole(this.state.command);
      this.setState({
        command: '',
        commandHistory: [this.state.command, ...this.state.commandHistory],
      });
    } else if (e.keyCode === 38) {
      const newCursor = Math.min(
        this.state.commandCursor + 1,
        this.state.commandHistory.length - 1
      );
      // Up arrow
      this.setState({
        command: this.state.commandHistory[newCursor] || '',
        commandCursor: newCursor,
      });
    } else if (e.keyCode === 40) {
      const newCursor = Math.max(this.state.commandCursor - 1, -1);
      // Down arrow
      this.setState({
        command: this.state.commandHistory[newCursor] || '',
        commandCursor: newCursor,
      });
    }
  };

  render() {
    return (
      <Container>
        <IconContainer style={{ color: theme.secondary() }}>
          <ChevronRight />
        </IconContainer>
        <Input
          value={this.state.command}
          onChange={this.onChange}
          onKeyUp={this.handleKeyDown}
        />
      </Container>
    );
  }
}
