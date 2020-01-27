import React from 'react';
import { Collapsible } from '@codesandbox/components';
import { Dependencies } from './Dependencies';
import { ExternalResources } from './ExternalResources';

export const Explorer = () => (
  <>
    <Collapsible title="Files">1</Collapsible>

    <Dependencies />
    <ExternalResources />
  </>
);
