import React, { useEffect } from 'react';
import {
  FormField,
  Grid,
  Input,
  Select,
  Stack,
  Text,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { setActiveTeamFromPersonalWorkspaceId } from 'app/overmind/internalActions';
import { useOvermind } from 'app/overmind';
import { CreateTeamParams, RegistryForm } from './RegistryForm';

export const RegistrySettings = () => {
  const { actions, state } = useOvermind();
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const loadCurrentNpmRegistry = React.useCallback(async () => {
    setLoading(true);

    try {
      await actions.dashboard.fetchCurrentNpmRegistry({});
    } finally {
      setLoading(false);
    }
  }, [setLoading, actions.dashboard]);

  useEffect(() => {
    loadCurrentNpmRegistry();
  }, [loadCurrentNpmRegistry]);

  const onSubmit = async (params: CreateTeamParams) => {
    setSubmitting(true);
    try {
      await actions.dashboard.createOrUpdateCurrentNpmRegistry(params);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Stack
      css={css({
        backgroundColor: 'grays.900',
        paddingY: 8,
        paddingX: 11,
        border: '1px solid',
        borderColor: 'grays.500',
        borderRadius: 4,
      })}
    >
      <RegistryForm
        onSubmit={onSubmit}
        isSubmitting={submitting}
        registry={state.dashboard.workspaceSettings.npmRegistry}
      />
    </Stack>
  );
};
