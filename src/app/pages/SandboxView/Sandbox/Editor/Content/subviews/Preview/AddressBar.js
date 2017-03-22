import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  color: ${props => props.theme.gray.darken(0.2)()};
  vertical-align: middle;
`;

const InputContainer = styled.div`
  input {
    border-radius: 4px;
    outline: none;
    border: 1px solid #ccc;
    padding: 0.2rem 1rem;
    color: black;
    width: 100%;
    box-sizing: border-box;
  }
`;

const Slash = styled.span`
  position: absolute;
  padding: 0.3rem 0.75rem;
  top: 0;
  bottom: 0;
  left: 0;
  vertical-align: middle;
  line-height: 1.15;
`;

type Props = {
  url: string,
  onChange: (url: string) => void,
  onConfirm: () => void,
};

export default class extends React.PureComponent {
  props: Props;

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
        <Slash>/</Slash>
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
