import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Item, TeamIcon } from './elements';

export const Team: FunctionComponent = () => {
  const {
    state: {
      editor: {
        currentSandbox: {
          team: { name },
        },
      },
    },
  } = useOvermind();

  return (
    <Tooltip appendTo="parent" content="This sandbox is owned by this team">
      <Item>
        <TeamIcon />

        <div>{name}</div>
      </Item>
    </Tooltip>
  );
};
