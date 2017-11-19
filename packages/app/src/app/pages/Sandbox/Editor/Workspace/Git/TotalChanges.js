import React from 'react';

import type { Sandbox } from 'common/types';

import { Added, Modified, Deleted } from './Changes';

export default ({
  gitChanges,
  hideColor,
}: {
  gitChanges: Sandbox.originalGitChanges,
  hideColor: boolean,
}) => (
  <div>
    <Added changes={gitChanges.added} hideColor={hideColor} />
    <Modified changes={gitChanges.modified} hideColor={hideColor} />
    <Deleted changes={gitChanges.deleted} hideColor={hideColor} />
  </div>
);
