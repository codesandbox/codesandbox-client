import track from '@codesandbox/common/lib/utils/analytics';
import { basename } from 'path';
import React, { FunctionComponent, useState } from 'react';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import {
  Button,
  Stack,
  Element,
  Text,
  ThemeProvider,
  Select,
  Icon,
} from '@codesandbox/components';
import Modal from 'app/components/Modal';
import { WorkspaceSelect } from 'app/components/WorkspaceSelect';
import { PrivacyLevel } from 'app/components/Create/utils/types';

import { DirectoryPicker } from './DirectoryPicker';

export const MoveSandboxFolderModal: FunctionComponent = () => {
  const { dashboard, refetchSandboxInfo, modals: modalsActions } = useActions();
  const {
    activeTeam,
    modals,
    activeTeamInfo,
    dashboard: { teams },
  } = useAppState();
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const defaultPath = modals.moveSandboxModal.defaultOpenedPath ?? '/';
  const [path, setPath] = useState<string | null>(defaultPath);
  const [teamId, setTeamId] = useState(activeTeam);
  const preventSandboxLeaving = modals.moveSandboxModal.preventSandboxLeaving;

  const minimumPrivacy = Math.max(
    activeTeamInfo?.settings.minimumPrivacy ?? 0
  ) as PrivacyLevel;

  const [privacy, setPrivacy] = useState<PrivacyLevel | 'DRAFT'>(
    minimumPrivacy
  );
  const isDraft = privacy === 'DRAFT';

  const onWorkspaceSelect = (newTeamId: string) => {
    track('Dashboard Move Modal - Workspace Select', {
      teamId: newTeamId,
      oldTeamId: teamId,
    });
    setTeamId(newTeamId);
  };

  const handleMove = () => {
    setLoading(true);
    setError(undefined);

    dashboard
      .addSandboxesToFolder({
        teamId,
        sandboxIds: modals.moveSandboxModal.sandboxIds,
        collectionPath: isDraft ? undefined : path,
        privacy: isDraft ? 2 : privacy,
      })
      .then(() => {
        refetchSandboxInfo();
        dashboard.getTeams(); // refetch teams' limits and usage

        setLoading(false);
        modalsActions.moveSandboxModal.close();

        track('Move Sandbox From Editor');
      })
      .catch(({ message }) => {
        setError(message);

        setLoading(false);
      });
  };

  const currentTeam = teams.find(item => item.id === teamId);
  const hasReachedPrivateSandboxLimit =
    !currentTeam.featureFlags.friendOfCsb &&
    currentTeam.usage.privateSandboxesQuantity >=
      currentTeam.limits.includedPrivateSandboxes;
  const limitError = privacy === 2 && hasReachedPrivateSandboxLimit;

  const onSelect = ({ teamId: newTeamId, path: newPath }) => {
    setTeamId(newTeamId);
    setPath(newPath);
  };

  const renderSubmitLabel = () => {
    if (loading) return 'Moving Sandbox...';
    if (isDraft) return 'Move to Draft folder';
    if (path) return `Move to ${basename(path) || 'root folder'}`;

    return 'Move to Folder';
  };

  return (
    <ThemeProvider>
      <Modal
        isOpen={modals.moveSandboxModal.isCurrent}
        onClose={() => modalsActions.moveSandboxModal.close()}
        width={480}
      >
        <Stack
          css={css({ width: '100%', paddingX: 6, paddingY: 7 })}
          gap={6}
          direction="vertical"
        >
          <Text size={6} weight="regular">
            Move {modals.moveSandboxModal.sandboxIds.length}{' '}
            {modals.moveSandboxModal.sandboxIds.length > 1 ? 'items' : 'item'}
          </Text>
          <Stack gap={6} direction="vertical">
            <Stack direction="vertical" gap={2}>
              <Text size={3} as="label">
                Workspace
              </Text>

              <Element
                css={{
                  backgroundColor: '#252525',
                  borderRadius: 4,
                  color: '#999999',
                  border: '1px solid transparent',
                  '&:hover': {
                    borderColor: '#9581FF',
                  },
                }}
              >
                <WorkspaceSelect
                  selectedTeamId={teamId}
                  disabled={preventSandboxLeaving}
                  onSelect={onWorkspaceSelect}
                />
              </Element>
            </Stack>

            <Stack direction="vertical" gap={2}>
              <Text size={3} as="label">
                Visibility
              </Text>

              <Select
                icon={
                  isDraft
                    ? PRIVACY_OPTIONS[2].icon
                    : PRIVACY_OPTIONS[privacy].icon
                }
                defaultValue={privacy}
                onChange={({ target: { value } }) => {
                  if (value === 'DRAFT') {
                    return setPrivacy('DRAFT');
                  }
                  setPrivacy(parseInt(value, 10) as 0 | 1 | 2);
                }}
                value={privacy}
              >
                <option value={0}>{PRIVACY_OPTIONS[0].description}</option>
                <option value={1}>{PRIVACY_OPTIONS[1].description}</option>
                <option value={2}>{PRIVACY_OPTIONS[2].description}</option>
                <option value="DRAFT">Draft (only you have access)</option>
              </Select>

              {limitError && (
                <Stack gap={1} css={{ color: '#F5A8A8' }}>
                  <Icon name="circleBang" />
                  <Text size={3}>
                    You have reached the free limit of 5 private Sandboxes.
                  </Text>
                </Stack>
              )}
            </Stack>

            {!isDraft && (
              <Stack direction="vertical" gap={2}>
                <Text size={3} as="label">
                  Folder
                </Text>
                <Element
                  css={css({
                    maxHeight: 400,
                    overflow: 'auto',
                    border: '1px solid',
                    borderColor: 'sideBar.border',
                    borderRadius: 4,
                    padding: '0 0.25rem',
                  })}
                >
                  <DirectoryPicker
                    currentPath={path}
                    currentTeamId={teamId}
                    onSelect={onSelect}
                  />
                </Element>
              </Stack>
            )}

            {error}

            <Stack align="flex-end" gap={2} justify="flex-end">
              <Button
                css={css({ width: 'auto' })}
                variant="secondary"
                onClick={modalsActions.moveSandboxModal.close}
              >
                Cancel
              </Button>

              <Button
                css={css({ width: 'auto' })}
                disabled={limitError || loading}
                onClick={handleMove}
              >
                {renderSubmitLabel()}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Modal>
    </ThemeProvider>
  );
};

const PRIVACY_OPTIONS = {
  0: {
    description: 'Public (everyone has access)',
    icon: () => <Icon size={12} name="globe" />,
  },
  1: {
    description: 'Unlisted (everyone with the link can access)',
    icon: () => <Icon size={12} name="link" />,
  },
  2: {
    description: 'Private (only workspace members have access)',
    icon: () => <Icon size={12} name="lock" />,
  },
};
