import React from 'react';
import styled from 'styled-components';
import theme from '../../../../../../../../common/theme';

const TEXT_COLOR = theme.gray.darken(0.2)();

const Container = styled.div`
  position: relative;
  color: ${TEXT_COLOR};
  vertical-align: middle;
`;

const Input = styled.input`
  padding: 0.2rem 1rem;
  color: ${TEXT_COLOR};
  width: 100%;
  box-sizing: border-box;
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
  url: string;
  onChange: (url: string) => void;
  onConfirm: () => void;
};

export default class extends React.PureComponent {
  props: Props;

  onChange = (evt) => {
    const { onChange } = this.props;

    onChange(evt.target.value);
  };

  handleKeyDown = (e) => {
    const { onConfirm } = this.props;

    if (e.keyCode === 13) {
      // Enter
      onConfirm();
    }
  }

  render() {
    const { url = '' } = this.props;
    return (
      <Container>
        <Slash>/</Slash>
        <Input onChange={this.onChange} onKeyDown={this.handleKeyDown} value={url} />
      </Container>
    );
  }
}
