import React from 'react';

import theme from 'common/lib/theme';

import AddedIcon from 'react-icons/lib/go/diff-added';
import ModifiedIcon from 'react-icons/lib/go/diff-modified';
import RemovedIcon from 'react-icons/lib/go/diff-removed';

import Tooltip from 'common/lib/components/Tooltip';

import { ChangeContainer, Entry } from './elements';

function Changes({ changes, color, Icon, title, hideColor }) {
  return (
    <div>
      {changes.sort().map(change => (
        <ChangeContainer key={change} color={color}>
          <Entry hideColor={hideColor} editing color={color}>
            <Tooltip content={title}>
              <Icon />
            </Tooltip>
            {change}
          </Entry>
        </ChangeContainer>
      ))}
    </div>
  );
}

export function Added({ changes, hideColor }) {
  return (
    <Changes
      changes={changes}
      color={theme.green}
      Icon={AddedIcon}
      title="Added"
      hideColor={hideColor}
    />
  );
}

export function Modified({ changes, hideColor }) {
  return (
    <Changes
      changes={changes}
      color={theme.secondary}
      Icon={ModifiedIcon}
      title="Modified"
      hideColor={hideColor}
    />
  );
}

export function Deleted({ changes, hideColor }) {
  return (
    <Changes
      changes={changes}
      color={theme.red}
      Icon={RemovedIcon}
      title="Deleted"
      hideColor={hideColor}
    />
  );
}

export default Changes;
