import React from 'react';
import { Collapsible } from '@codesandbox/components';
import { Dependencies } from './Dependencies';

export const Explorer = () => (
  <>
    <Collapsible title="Files">1</Collapsible>

    <Dependencies />

    <Collapsible title="External Resources">3</Collapsible>
  </>
);
