// @flow
import React from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: inline-block;
  z-index: 10;
  input {
    font-family: inherit;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    border: none;
    outline: none;
    background-color: inherit;
    padding: 0.2rem;
    padding-left: 0;
    margin-left: 0;
    color: ${props => props.theme.white};

    &:focus {
      border: none;
      border: none;
    }
  }
`;

type Props = {
  title: string;
  editable: boolean;
  onEditCommit: (name: string) => void;
  cancelEdit: () => void;
}
type State = {
  currentValue: string;
}

function select(el) {
  if (el) el.select();
}

export default class ModuleTitle extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      currentValue: props.title,
    };
  }

  handleChange = (el: Event) => {
    this.setState({ currentValue: el.target.value });
  };

  handleKeyUp = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      // Enter
      this.commit();
    } else if (e.keyCode === 27) {
      // Escape
      this.cancelEdit();
    }
  };

  cancelEdit = () => {
    this.setState({ currentValue: this.props.title });
    this.props.cancelEdit();
  };

  commit = () => {
    this.props.onEditCommit(this.state.currentValue);
  };

  render() {
    const { editable, title } = this.props;
    if (!editable) return <span>{title}</span>;

    return (
      <InputContainer>
        <input
          onChange={this.handleChange}
          onBlur={this.commit}
          onKeyUp={this.handleKeyUp}
          ref={select}
          value={this.state.currentValue}
        />
      </InputContainer>
    );
  }
}
