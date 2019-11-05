import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { SubTitle } from '../elements';

import { Mode, ModeDetails, ModeSelect, ModeSelector } from './elements';

const noop = () => undefined;
export const LiveMode: FunctionComponent = () => {
  const {
    actions: {
      live: { onModeChanged },
    },
    state: {
      live: {
        isOwner,
        roomInfo: { mode },
      },
    },
  } = useOvermind();

  return (
    <Margin top={1}>
      <SubTitle>Live Mode</SubTitle>

      <ModeSelect>
        <ModeSelector i={mode === 'open' ? 0 : 1} />

        <Mode
          onClick={isOwner ? () => onModeChanged('open') : noop}
          selected={mode === 'open'}
        >
          <div>Open</div>

          <ModeDetails>Everyone can edit</ModeDetails>
        </Mode>

        <Mode
          onClick={isOwner ? () => onModeChanged('classroom') : noop}
          selected={mode === 'classroom'}
        >
          <div>Classroom</div>

          <ModeDetails>Take control over who can edit</ModeDetails>
        </Mode>
      </ModeSelect>
    </Margin>
  );
};
