import React from 'react';
import { Collapsible } from '@codesandbox/components';
import { Dependencies as Old } from '../../Dependencies';
import { Dependencies } from './Dependencies/index';

export const Explorer = () => (
  <>
    <Collapsible title="Files">1</Collapsible>
    <Collapsible title="Dependencies" defaultOpen>
      <Dependencies />
      <hr />
      <Old />
    </Collapsible>
    <Collapsible title="External Resources">3</Collapsible>
  </>
);
