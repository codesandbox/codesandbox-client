import * as React from 'react';

import { ESC, ENTER } from 'common/lib/utils/keycodes';

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
    if (e.keyCode === ENTER) {
      this.props.onCommit(this.state.currentValue);
    } else if (e.keyCode === ESC) {
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
          onBlur={() => onCommit(currentValue, true)}
          onKeyUp={this.handleKeyUp}
          ref={select}
          value={currentValue}
        />
      </InputContainer>
    );
  }
}
