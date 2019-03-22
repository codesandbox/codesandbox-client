import React from 'react';
import { ENTER } from '../../../utils/keycodes';
import { Container, InputContainer } from './elements';

export interface Props {
  onChange: (value: string) => void;
  onConfirm: () => void;
  url?: string;
}

export default class extends React.PureComponent<Props> {
  input: HTMLInputElement | undefined;
  onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;

    onChange(evt.target.value);
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { onConfirm } = this.props;

    if (e.keyCode === ENTER) {
      onConfirm();
    }
  };

  focus = () => {
    if (this.input) {
      this.input.focus();
    }
  };

  render() {
    const { url = '' } = this.props;

    return (
      <Container onClick={this.focus}>
        <InputContainer>
          <input
            ref={e => {
              this.input = e;
            }}
            onChange={this.onChange}
            onKeyDown={this.handleKeyDown}
            value={url}
            aria-label="Address Bar Input"
          />
        </InputContainer>
      </Container>
    );
  }
}
