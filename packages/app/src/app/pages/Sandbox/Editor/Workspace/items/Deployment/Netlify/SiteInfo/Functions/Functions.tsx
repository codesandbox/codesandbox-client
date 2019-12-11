import { Module } from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';

import { SubTitle } from '../elements';

import { Section } from './elements';
import { Function } from './Function';

type Props = {
  functions: Module[];
};
export const Functions: FunctionComponent<Props> = ({ functions }) => (
  <>
    <SubTitle>Functions</SubTitle>

    <Section>
      {functions.map(func => (
        <Function function={func} />
      ))}
    </Section>
  </>
);
