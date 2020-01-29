import React from 'react';
import { Collapsible } from '@codesandbox/components';
import { Files } from './Files';
import { Dependencies } from './Dependencies';
import { ExternalResources } from './ExternalResources';

export const Explorer = () => (
  <>
    <Files />
    <Dependencies />
    <ExternalResources />
  </>
);
