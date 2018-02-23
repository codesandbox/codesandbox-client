import * as React from 'react';

import { InputContainer } from './elements';

function select(el) {
  if (el) el.select();
}

export default class EntryTitleInput extends React.PureComponent {
  constructor(props) {
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
