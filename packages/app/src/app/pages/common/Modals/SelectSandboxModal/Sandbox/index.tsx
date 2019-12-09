import { UserSandbox } from '@codesandbox/common/lib/types';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import React, { FunctionComponent } from 'react';
import { format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import { useOvermind } from 'app/overmind';

import { Button, Date } from './elements';

type Props = {
  sandbox: UserSandbox;
};
export const Sandbox: FunctionComponent<Props> = ({ sandbox }) => {
  const {
    actions: {
      profile: { newSandboxShowcaseSelected },
    },
    state: {
      profile: { showcasedSandbox },
    },
  } = useOvermind();
  const active = sandbox.id === showcasedSandbox.id;

  return (
    <Button
      active={active}
      onClick={() => newSandboxShowcaseSelected(sandbox.id)}
    >
      <div>
        {getSandboxName(sandbox)}

        {active && ' (Selected)'}
      </div>

      <Date>
        {format(zonedTimeToUtc(sandbox.insertedAt, 'Etc/UTC'), 'MMM dd, yyyy')}
      </Date>
    </Button>
  );
};
