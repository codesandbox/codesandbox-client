import React from 'react';
import styled from 'styled-components';

import ChevronRight from 'react-icons/lib/md/chevron-right';
import theme from 'common/theme';

import { IconContainer } from './styles';

const Container = styled.div`
  position: relative;
  height: 2rem;
  min-height: 2rem;
  width: 100%;
  background-color: ${props => props.theme.background.darken(0.3)};

  display: flex;
  align-items: center;
`;

const Input = styled.input`
  position: relative;
  height: 1.5rem;
  width: 100%;
  background-color: ${props => props.theme.background.darken(0.3)};
  border: none;
  outline: none;
  color: rgba(255, 255, 255, 0.8);
  font-family: Menlo, monospace;
  font-size: 13px;
`;

type Props = {
  evaluateConsole: (command: string) => void,
};

export default class ConsoleInput extends React.PureComponent<Props> {
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
