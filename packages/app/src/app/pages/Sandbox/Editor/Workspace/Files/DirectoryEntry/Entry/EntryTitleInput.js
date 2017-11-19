// @flow
import * as React from 'react';
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
    background-color: ${props =>
      props.errorMessage
        ? props.theme.redBackground.clearer(0.5)
        : 'rgba(0, 0, 0, 0.2)'};
    margin: 0.2rem;
    padding-left: 0.25rem;
    margin-left: 0.25rem;
    color: ${props =>
      props.errorMessage ? props.theme.red : props.theme.white};

    &:focus {
      border: none;
      outline: none;
    }
  }
`;

type Props = {
  title: string,
  onCommit: (title: string, force: ?boolean) => void,
  onCancel: () => void,
  onChange: (name: string) => void,
};

type State = {
  currentValue: string,
};

function select(el) {
  if (el) el.select();
}

export default class EntryTitleInput extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentValue: props.title,
    };
  }

  handleChange = (e: KeyboardEvent) => {
    if (e.target) {
      this.props.onChange(e.target.value);
      this.setState({ currentValue: e.target.value });
    }
  };

  handleKeyUp = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      // Enter
      this.props.onCommit(this.state.currentValue);
    } else if (e.keyCode === 27) {
      // Escape
      this.props.onCancel();
    }
  };

  render() {
    const { onCommit } = this.props;
    const { currentValue } = this.state;

    return (
      <InputContainer>
        <input
          onChange={this.handleChange}
          onBlur={() => onCommit(this.state.currentValue, true)}
          onKeyUp={this.handleKeyUp}
          ref={select}
          value={currentValue}
        />
      </InputContainer>
    );
  }
}
