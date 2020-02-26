import css from '@styled-system/css';
import React, { FunctionComponent, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

import { Element } from '../..';

const SwitchBackground = styled.div(
  css({
    width: 7,
    height: 4,
    backgroundColor: 'switch.backgroundOff',
    border: '1px solid',
    borderColor: 'sideBar.background',
    borderRadius: 'large',
    position: 'relative',
    transition: 'background-color ease',
    transitionDuration: theme => theme.speeds[3],
  })
);

const SwitchToggle = styled.span(
  css({
    width: 3,
    height: 3,
    backgroundColor: 'switch.toggle',
    borderRadius: '50%',
    position: 'absolute',
    margin: '1px',
    left: 0,
    transition: 'left ease',
    transitionDuration: theme => theme.speeds[3],
  })
);

const SwitchInput = styled.input(
  css({
    width: 0,
    opacity: 0,
    position: 'absolute',
    left: -100,
  })
);

const SwitchContainer = styled(Element).attrs({ as: 'label' })(
  css({
    'input:checked + [data-component=SwitchBackground]': {
      backgroundColor: 'switch.backgroundOn',
    },
    'input:checked + [data-component=SwitchBackground] [data-component=SwitchToggle]': {
      left: theme => `${theme.space[4] - 4}px`,
    },
  })
);

type SwitchInputProps = InputHTMLAttributes<HTMLInputElement>;
type Props = Pick<SwitchInputProps, 'id' | 'onChange'> & {
  defaultOn?: SwitchInputProps['defaultChecked'];
  on?: SwitchInputProps['checked'];
};
export const Switch: FunctionComponent<Props> = ({
  defaultOn,
  on,
  ...props
}) => (
  <SwitchContainer>
    <SwitchInput
      checked={on}
      defaultChecked={defaultOn}
      type="checkbox"
      {...props}
    />

    <SwitchBackground data-component="SwitchBackground">
      <SwitchToggle data-component="SwitchToggle" />
    </SwitchBackground>
  </SwitchContainer>
);
