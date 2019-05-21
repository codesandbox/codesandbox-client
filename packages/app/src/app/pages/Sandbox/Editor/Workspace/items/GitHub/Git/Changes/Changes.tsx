import React from 'react';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { ChangeContainer, Entry } from './elements';

export const Changes = ({ changes, color, Icon, title, hideColor }) => (
  <>
    {changes.sort().map(change => (
      <ChangeContainer key={change} color={color}>
        <Entry hideColor={hideColor} color={color}>
          <Tooltip content={title}>
            <Icon />
          </Tooltip>
          {change}
        </Entry>
      </ChangeContainer>
    ))}
  </>
);
