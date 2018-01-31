// @flow
import React from 'react';
import type { Test } from '../../';

import { BlockHeader } from './elements';
import TestName from '../../TestName';

type Props = {
  test: Test,
};

export default ({ test }: Props) => (
  <BlockHeader>
    <TestName test={test} />
  </BlockHeader>
);
