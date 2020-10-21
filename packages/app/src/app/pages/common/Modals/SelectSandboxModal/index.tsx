import React, { FunctionComponent } from 'react';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { useOvermind } from 'app/overmind';
import {
  Stack,
  Text,
  List,
  ListAction,
  Element,
} from '@codesandbox/components';
import { format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Alert } from '../Common/Alert';

export const SelectSandboxModal: FunctionComponent = () => {
  const {
    actions: {
      profile: { newSandboxShowcaseSelected },
    },
    state: { profile },
  } = useOvermind();

  if (!profile) {
    return null;
  }
  const { isLoadingSandboxes, userSandboxes, showcasedSandbox } = profile;

  if (isLoadingSandboxes) {
    return (
      <Stack align="center" justify="center">
        <Text>Loading sandboxes...</Text>
      </Stack>
    );
  }

  return (
    <Alert title="Select a Sandbox">
      <List>
        {userSandboxes.filter(Boolean).map(sandbox => (
          <ListAction
            justify="space-between"
            disabled={sandbox.id === showcasedSandbox?.id}
            key={sandbox.id}
            onClick={() => newSandboxShowcaseSelected(sandbox.id)}
          >
            <Element>
              {getSandboxName(sandbox)}
              {sandbox.id === showcasedSandbox?.id && ' (Selected)'}
            </Element>

            <Element>
              {format(
                zonedTimeToUtc(sandbox.insertedAt, 'Etc/UTC'),
                'MMM dd, yyyy'
              )}
            </Element>
          </ListAction>
        ))}
      </List>
    </Alert>
  );
};
