import * as React from 'react';

import Fullscreen from '../flex/Fullscreen';
import Centered from '../flex/Centered';
import theme from '../../theme';

import playSVG from './play.svg';

const RunOnClick = ({ onClick }) => (
  <Fullscreen
    style={{ backgroundColor: theme.primary(), cursor: 'pointer' }}
    onClick={onClick}
  >
    <Centered horizontal vertical>
      <img width={170} height={170} src={playSVG} alt="Run Sandbox" />
      <div
        style={{
          color: theme.red(),
          fontSize: '2rem',
          fontWeight: 700,
          marginTop: 24,
          textTransform: 'uppercase',
        }}
      >
        Click to run
      </div>
    </Centered>
  </Fullscreen>
);

export default RunOnClick;
