import * as React from 'react';

import { InputContainer } from './elements';

function select(el?: HTMLInputElement) {
  if (el) {
    el.select();
  }
}

type Props = {
  title: string
  onChange: (value: string) => void
  onCommit: (value: string, bool?: boolean) => void
  onCancel: () => void
}

type State = {
  currentValue: string
}

export default class EntryTitleInput extends React.PureComponent<Props, State> {
  state: State
  constructor(props: Props) {
    super(props);

    this.state = {
      currentValue: props.title,
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target) {
      this.props.onChange(e.target.value);
      this.setState({ currentValue: e.target.value });
    }
  };

  handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
