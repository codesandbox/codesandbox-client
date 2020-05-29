import React from 'react';
import { MdFiberManualRecord } from 'react-icons/md';
import styled from 'styled-components';

const DotContainer = styled.div`
  font-size: 4rem;
  display: block;
  color: rgb(253, 36, 57);

  svg {
    transition: 0.3s ease opacity;
  }
`;

export class BlinkingDot extends React.PureComponent<{}, { showing: boolean }> {
  timer: number;
  state = {
    showing: true,
  };

  componentDidMount() {
    this.timer = window.setInterval(() => {
      this.setState(state => ({ showing: !state.showing }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <DotContainer>
        <MdFiberManualRecord style={{ opacity: this.state.showing ? 1 : 0 }} />
      </DotContainer>
    );
  }
}
