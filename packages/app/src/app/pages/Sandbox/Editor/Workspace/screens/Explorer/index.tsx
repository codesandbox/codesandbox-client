import React from 'react';
import { Collapsible } from '@codesandbox/components';
import { Files } from './Files';
import { Dependencies } from './Dependencies';
import { ExternalResources } from './ExternalResources';

import { Files as Old } from '../../Files';

export const Explorer = () => (
  <>
    <Files />
    <Collapsible title="Files" defaultOpen>
      <Old setEditActions={() => {}} />
    </Collapsible>
    <Dependencies />
    <ExternalResources />
  </>
);
