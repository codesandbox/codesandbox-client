import React from 'react';

import Fullscreen from '../flex/Fullscreen';
import Centered from '../flex/Centered';
import { Container, Text } from './elements';

const RunOnClick = ({ onClick }) => (
  <Fullscreen
    style={{ background: '#131313', cursor: 'pointer' }}
    onClick={onClick}
  >
    <Centered horizontal vertical>
      <Container>
        <div className="cube">
          <div className="sides">
            <div className="top" />
            <div className="right" />
            <div className="bottom" />
            <div className="left" />
            <div className="front" />
            <div className="back" />
          </div>
          <div className="play" />
        </div>
        <Text>Click to Run</Text>
      </Container>
    </Centered>
  </Fullscreen>
);

export default RunOnClick;
