import * as React from 'react';
import { Container, InputContainer } from './elements';

type Props = {
  onChange: (value: string) => void
  onConfirm: () => void
  url: string
}

export default class extends React.PureComponent<Props> {
  input: HTMLInputElement
  onChange = evt => {
    const { onChange } = this.props;

    onChange(evt.target.value);
  };

  handleKeyDown = e => {
    const { onConfirm } = this.props;

    if (e.keyCode === 13) {
      // Enter
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
          />
        </InputContainer>
      </Container>
    );
  }
}
