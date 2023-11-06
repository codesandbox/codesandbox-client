import React from 'react';
import {
  Badge,
  MessageStripe,
  Stack,
  Text,
  Switch,
} from '@codesandbox/components';
import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
import { useActions } from 'app/overmind';
import track from '@codesandbox/common/lib/utils/analytics';
import { UnstyledButtonLink } from './elements';

export const ExperimentalBetaEditor = () => {
  const actions = useActions();
  const [betaSandboxEditor, setBetaSandboxEditor] = useGlobalPersistedState(
    'BETA_SANDBOX_EDITOR',
    false
  );

  if (betaSandboxEditor) {
    return (
      <Stack justify="center" padding={2}>
        <Text size={3}>
          Open{' '}
          <UnstyledButtonLink
            onClick={() => {
              actions.modals.newSandboxModal.close();
              actions.preferences.openPreferencesModal('experiments');
            }}
          >
            experiments
          </UnstyledButtonLink>{' '}
          to disable the new sandbox editor
        </Text>
      </Stack>
    );
  }

  return (
    <MessageStripe variant="primary">
      <Stack direction="horizontal" justify="space-between" align="center">
        <Stack direction="horizontal" align="center" gap={1}>
          <Badge icon="sandbox" variant="highlight">
            Beta
          </Badge>
          <Text weight="500">Try the new sandbox editor.</Text>
          <Text>For a faster and more stable prototyping experience.</Text>
        </Stack>
        <Switch
          onChange={() => {
            setBetaSandboxEditor(true);
            track('Enable new sandbox editor - Create modal');
          }}
        />
      </Stack>
    </MessageStripe>
  );
};
