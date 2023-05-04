import React from 'react';
import styled from 'styled-components';

const SwitchBackground = styled.div({
  width: 42,
  height: 22,
  backgroundColor: 'rgb(36, 36, 36)',
  border: '1px solid rgb(21, 21, 21)',
  borderRadius: 24,
  position: 'relative',
  transition: '200ms background-color ease',
  marginLeft: 16,
  marginRight: 16,
});

const SwitchToggle = styled.span({
  width: 20,
  height: 20,
  backgroundColor: 'white',
  borderRadius: '50%',
  position: 'absolute',
  left: 0,
  transition: '200ms left ease',
  boxSizing: 'border-box',
});

const SwitchInput = styled.input({
  width: 0,
  opacity: 0,
  position: 'absolute',
  left: -100,
});

const SwitchContainer = styled.div(() => ({
  'input:checked + [data-component=SwitchBackground]': {
    backgroundColor: `#7B61FF`,
  },
  'input:checked + [data-component=SwitchBackground] [data-component=SwitchToggle]': {
    left: 20,
  },
  '*': {
    boxSizing: 'border-box',
  },
}));

const Switch = ({ on, defaultOn, ...props }) => (
  <SwitchContainer as="label">
    <SwitchInput
      type="checkbox"
      checked={on}
      defaultChecked={defaultOn}
      {...props}
    />
    <SwitchBackground data-component="SwitchBackground">
      <SwitchToggle data-component="SwitchToggle" />
    </SwitchBackground>
  </SwitchContainer>
);

export default Switch;
