import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
// import * as Icons from '../dist/index.js';
import { Close } from '../dist/index.js';

const stories = storiesOf('Icons', module);
stories.add('whatevs', () => {
  return (
    <div>
      <Wrapper name="close">
        <Close />
      </Wrapper>
    </div>
  );
});

// stories.add('Gallery', () => {
//   return Object.keys(Icons).map(name => {
//     const Component = Icons[name];
//
//     return (
//       <Wrapper name={name}>
//         <Component />
//         <label>{name}</label>
//       </Wrapper>
//     );
//   });
// });

const Wrapper = styled.div`
  width: 32px;
  height: 32px;
  margin: 16px;
  display: inline-block;
  border: 2px solid transparent;
  > label {
    font-size: 14px;
  }
`;
