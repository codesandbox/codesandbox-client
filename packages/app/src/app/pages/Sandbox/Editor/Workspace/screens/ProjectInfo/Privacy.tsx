import React from 'react';
import {
  Collapsible,
  Text,
  Link,
  Stack,
  Select,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';
import { GlobeIcon } from './icons';

export const Privacy = () => {
  const {
    actions: {
      workspace: { sandboxPrivacyChanged },
    },
    state: {
      editor: { currentSandbox },
      user,
    },
  } = useOvermind();

  const isPaidUser = user?.subscription;

  return (
    <Collapsible title="Privacy" defaultOpen>
      <Stack direction="vertical" gap={4} css={css({ paddingX: 3 })}>
        <Select
          disabled={!isPaidUser}
          icon={GlobeIcon}
          onChange={({ target: { value } }) =>
            sandboxPrivacyChanged({
              privacy: Number(value) as 0 | 1 | 2,
              source: 'sidebar',
            })
          }
          value={currentSandbox.privacy}
        >
          <option value={0}>Public</option>
          <option value={1}>Unlisted (only available by url)</option>
          <option value={2}>Private</option>
        </Select>
        {!isPaidUser ? (
          <Text variant="muted" size={2}>
            You can change privacy of a sandbox as a Pro.{' '}
            <Link href="/pro" css={{ textDecoration: 'underline !important' }}>
              Become a Pro
            </Link>
          </Text>
        ) : null}
      </Stack>
    </Collapsible>
  );
};
