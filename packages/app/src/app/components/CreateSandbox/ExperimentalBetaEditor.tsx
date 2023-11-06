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
import { UnstyledButtonLink } from './elements';

export const ExperimentalBetaEditor = () => {
  const actions = useActions();
  const [betaSandboxEditor, setBetaSandboxEditor] = useGlobalPersistedState(
    'BETA_SANDBOX_EDITOR',
    false
  );

  if (betaSandboxEditor) {
    return (
      <Stack justify="center">
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
          to disable the beta editor
        </Text>
      </Stack>
    );
  }

  return (
    <MessageStripe variant="primary">
      <Stack direction="horizontal" justify="space-between" gap={4}>
        <Stack direction="horizontal" gap={1}>
          <Badge icon="sandbox" variant="highlight">
            Beta
          </Badge>
          <Text weight="500">Try the new sandbox editor.</Text>
          <Text>Faster, more stable, and collaborative by default.</Text>
        </Stack>
        <Switch onChange={() => setBetaSandboxEditor(true)} />
      </Stack>
    </MessageStripe>
  );
};
