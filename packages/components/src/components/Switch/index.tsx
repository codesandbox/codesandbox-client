import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import VisuallyHidden from '@reach/visually-hidden';
import { Element } from '../Element';

const SwitchBackground = styled.div(
  css({
    width: 7,
    height: 4,
    backgroundColor: 'switch.background',
    borderRadius: 'large',
    position: 'relative',
  })
);

const SwitchToggle = styled.span(
  css({
    width: 4,
    height: 4,
    backgroundColor: 'switch.foregroundOff',
    borderRadius: '50%',
    position: 'absolute',
    left: 0,
    transition: 'left ease',
    transitionDuration: theme => theme.speeds[3],
  })
);

// const SwitchInput = styled.input(
//   css({
//     width: 0,
//     opacity: 0,
//     position: 'absolute',
//   })
// );

const SwitchContainer = styled(Element)(
  css({
    'input:checked + [data-component=SwitchBackground]': {
      backgroundColor: 'switch.foregroundOn',
    },
    'input:checked + [data-component=SwitchBackground] [data-component=SwitchToggle]': {
      left: theme => theme.space[4] - 3,
    },
  })
);

interface ISwitchProps {
  id?: string;
  on?: boolean;
  defaultOn?: boolean;
  onChange?: (event: any) => void;
}

export const Switch: React.FC<ISwitchProps> = ({ on, defaultOn, ...props }) => (
  <SwitchContainer as="label">
    <VisuallyHidden>
      <input
        type="checkbox"
        checked={on}
        defaultChecked={defaultOn}
        {...props}
      />
    </VisuallyHidden>
    <SwitchBackground data-component="SwitchBackground">
      <SwitchToggle data-component="SwitchToggle" />
    </SwitchBackground>
  </SwitchContainer>
);
