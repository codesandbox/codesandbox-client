import React from 'react';
import { withTheme } from 'styled-components';
import { Collapsible, Text, Stack, Select } from '@codesandbox/components/lib';
import { useOvermind } from 'app/overmind';
import { GlobeIcon } from './icons';

export const PrivacyComponent = ({ theme }) => {
  const {
    actions: {
      workspace: { sandboxPrivacyChanged },
    },
    state: {
      editor: { currentSandbox },
      isPatron,
    },
  } = useOvermind();

  return (
    <Collapsible title="Privacy" defaultOpen>
      <Stack
        direction="vertical"
        gap={4}
        style={{ padding: `0 ${theme.space[3]}px` }}
      >
        <Select
          disabled={!isPatron}
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

          {isPatron && (
            <option value={1}>Unlisted (only available by url)</option>
          )}

          {isPatron && <option value={2}>Private</option>}
        </Select>
        {!isPatron ? (
          <Text variant="muted" size={2}>
            You an change privacy of a sandbox as a Pro.
            <br />
            Become a Pro.
          </Text>
        ) : null}
      </Stack>
    </Collapsible>
  );
};

export const Privacy = withTheme(PrivacyComponent);
