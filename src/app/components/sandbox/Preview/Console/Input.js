import React from 'react';
import styled from 'styled-components';

import ChevronRight from 'react-icons/lib/md/chevron-right';
import theme from 'common/theme';

import { IconContainer } from './styles';

const Container = styled.div`
  position: relative;
  height: 2rem;
  width: 100%;
  background-color: ${props => props.theme.background.darken(0.3)};

  display: flex;
  justify-content: center;
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
      this.setState({ command: '' });
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
