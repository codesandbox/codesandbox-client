// @flow
import React from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: inline-block;
  overflow: visible;
  input {
    transition: 0.3s ease all;
    font-family: inherit;
    position: absolute;
    top: 0.1rem;
    bottom: 0.1rem;
    border: 1px solid ${props => props.theme.primary};
    outline: none;
    background-color: ${props => (props.errorMessage ? props.theme.redBackground.clearer(0.5) : 'rgba(0, 0, 0, 0.2)')};
    margin: 0.2rem;
    padding-left: 0.25rem;
    margin-left: 0.25rem;
    color: ${props => (props.errorMessage ? props.theme.red : props.theme.white)};

    &:focus {
      border: none;
      outline: none;
    }
  }
`;

type Props = {
  title: string;
  onCommit: () => void;
  cancelEdit: () => void;
  onChange: (name: string) => void;
}

function select(el) {
  if (el) el.select();
}

export default class ModuleTitleInput extends React.Component {
  props: Props;
  handleChange = (el: Event) => {
    this.props.onChange(el.target.value);
  };

  handleKeyUp = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      // Enter
      this.props.onCommit();
    } else if (e.keyCode === 27) {
      // Escape
      this.cancelEdit();
    }
  };

  cancelEdit = () => {
    this.props.cancelEdit();
  };

  render() {
    const { title, onCommit } = this.props;

    return (
      <InputContainer>
        <input
          onChange={this.handleChange}
          onBlur={() => onCommit(true)}
          onKeyUp={this.handleKeyUp}
          ref={select}
          value={title}
        />
      </InputContainer>
    );
  }
}
