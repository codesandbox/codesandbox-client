import React from 'react';

import { SubTitle } from '../elements';

import { Section } from './elements';
import { Function } from './Function';

export const Functions = ({ functions }) => (
  <>
    <SubTitle>Functions</SubTitle>

    <Section>
      {functions.map(func => (
        <Function function={func} />
      ))}
    </Section>
  </>
);
