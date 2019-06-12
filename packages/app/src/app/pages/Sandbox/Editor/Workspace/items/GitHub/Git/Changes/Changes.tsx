import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import React from 'react';

import { ChangeContainer, Entry } from './elements';

export const Changes = ({ changes, color, hideColor, Icon, title }) => (
  <>
    {changes.sort().map(change => (
      <ChangeContainer color={color} key={change}>
        <Entry color={color} hideColor={hideColor}>
          <Tooltip content={title}>
            <Icon />
          </Tooltip>

          {change}
        </Entry>
      </ChangeContainer>
    ))}
  </>
);

Changes.defaultProps = {
  changes: [],
};
