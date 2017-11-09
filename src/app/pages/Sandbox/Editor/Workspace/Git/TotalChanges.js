import React from 'react';

import type { Sandbox } from 'common/types';
import theme from 'common/theme';

import AddedIcon from 'react-icons/lib/go/diff-added';
import ModifiedIcon from 'react-icons/lib/go/diff-modified';
import RemovedIcon from 'react-icons/lib/go/diff-removed';

import Changes from './Changes';

export default ({
  gitChanges,
  hideColor,
}: {
  gitChanges: Sandbox.originalGitChanges,
  hideColor: boolean,
}) => (
  <div>
    <Changes
      changes={gitChanges.added}
      color={theme.green}
      Icon={AddedIcon}
      title="Added"
      hideColor={hideColor}
    />
    <Changes
      changes={gitChanges.modified}
      color={theme.secondary}
      Icon={ModifiedIcon}
      title="Modified"
      hideColor={hideColor}
    />
    <Changes
      changes={gitChanges.deleted}
      color={theme.red}
      Icon={RemovedIcon}
      title="Deleted"
      hideColor={hideColor}
    />
  </div>
);
