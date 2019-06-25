import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import noop from 'lodash/noop';
import React from 'react';

import { useSignals, useStore } from 'app/store';

import { SubTitle } from '../elements';

import { Mode, ModeDetails, ModeSelect, ModeSelector } from './elements';

export const LiveMode = () => {
  const {
    live: { onModeChanged },
  } = useSignals();
  const {
    live: {
      isOwner,
      roomInfo: { mode },
    },
  } = useStore();

  return (
    <Margin top={1}>
      <SubTitle>Live Mode</SubTitle>

      <ModeSelect>
        <ModeSelector i={mode === 'open' ? 0 : 1} />

        <Mode
          onClick={isOwner ? () => onModeChanged({ mode: 'open' }) : noop}
          selected={mode === 'open'}
        >
          <div>Open</div>

          <ModeDetails>Everyone can edit</ModeDetails>
        </Mode>

        <Mode
          onClick={isOwner ? () => onModeChanged({ mode: 'classroom' }) : noop}
          selected={mode === 'classroom'}
        >
          <div>Classroom</div>

          <ModeDetails>Take control over who can edit</ModeDetails>
        </Mode>
      </ModeSelect>
    </Margin>
  );
};
