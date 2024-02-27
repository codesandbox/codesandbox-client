import { useActions, useAppState } from 'app/overmind';
import React, { useEffect } from 'react';
import {
  Button,
  Element,
  Icon,
  Input,
  Label,
  Stack,
  Select,
  SkeletonText,
  Text,
} from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { useGithubAccounts } from 'app/hooks/useGithubOrganizations';
import { fuzzyMatchGithubToCsb } from 'app/utils/fuzzyMatchGithubToCsb';
import { GithubRepoToImport } from '../../utils/types';
import { useValidateRepoDestination } from '../../hooks/useValidateRepoDestination';

const COLORS = {
  INVALID: '#ED6C6C',
  VALID: '#2ECC71',
};

type ConfigureRepoFormProps = {
  repository: GithubRepoToImport;
  onCancel: () => void;
};

export const ConfigureRepoForm: React.FC<ConfigureRepoFormProps> = ({
  repository,
  onCancel,
}) => {
  const { activeTeamInfo, user } = useAppState();
  const { dashboard } = useActions();
  const githubAccounts = useGithubAccounts();

  const [isForking, setIsForking] = React.useState<boolean>(false);
  const [repoName, setRepoName] = React.useState<string>(repository.name);
  const [selectedOrg, setSelectedOrg] = React.useState<string>('');

  const destinationValidation = useValidateRepoDestination(
    selectedOrg,
    repoName
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (destinationValidation.state !== 'valid' || isForking) {
      return;
    }

    track('Import repository - Create fork', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    setIsForking(true);

    await dashboard.forkGitHubRepository({
      source: { owner: repository.owner.login, name: repository.name },
      destination: {
        teamId: activeTeamInfo.id,
        organization:
          destinationValidation.owner !== user.githubProfile?.data?.login
            ? destinationValidation.owner
            : undefined,
        name: destinationValidation.name,
      },
    });
    setIsForking(false);
  };

  useEffect(() => {
    track('Import repository - View create fork', {
      codesandbox: 'V1',
      event_source: 'UI',
    });
  }, []);

  const accountOptions = githubAccounts?.data
    ? [githubAccounts.data.personal, ...githubAccounts.data.organizations]
    : [];

  useEffect(() => {
    if (!activeTeamInfo) {
      return;
    }

    setSelectedOrg(
      'data' in githubAccounts
        ? fuzzyMatchGithubToCsb(activeTeamInfo.name, accountOptions).login
        : ''
    );
  }, [activeTeamInfo, githubAccounts.state]);

  return (
    <Element
      as="form"
      css={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        paddingBottom: '16px',
        justifyContent: 'space-between',
      }}
      onSubmit={handleSubmit}
    >
      <Stack direction="vertical" gap={6}>
        <Text
          as="h2"
          css={{
            fontSize: '16px',
            fontWeight: 500,
            margin: 0,
          }}
        >
          Create new fork
        </Text>
        <Stack direction="vertical" gap={1}>
          <Text size={3} as="label">
            Name
          </Text>
          <Element
            css={{
              position: 'relative',
            }}
          >
            <Input
              aria-invalid={destinationValidation.state === 'invalid'}
              autoFocus
              id="repo-name"
              type="text"
              aria-label="Repository name"
              placeholder="Repository name"
              value={repoName}
              onChange={e => setRepoName(e.target.value)}
              required
            />

            {destinationValidation.state !== 'idle' ? (
              <Element
                css={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  color: {
                    valid: COLORS.VALID,
                    invalid: COLORS.INVALID,
                    validating: '#E5E5E5',
                  }[destinationValidation.state],
                }}
              >
                {destinationValidation.state === 'valid' ? (
                  <Icon size={16} name="simpleCheck" />
                ) : null}
                {destinationValidation.state === 'invalid' ? (
                  <Icon size={16} name="warning" />
                ) : null}
                {destinationValidation.state === 'validating' ? (
                  <Icon size={16} name="spinner" />
                ) : null}
              </Element>
            ) : null}
          </Element>
          {destinationValidation.state === 'invalid' ? (
            <Text size={3} variant="muted">
              {destinationValidation.error}
            </Text>
          ) : null}
        </Stack>

        <Label css={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Text as="span" size={3}>
            Personal or organization GitHub account
          </Text>
          {githubAccounts.state === 'loading' ? (
            <SkeletonText
              css={{
                height: '28px',
                width: '100%',
              }}
            />
          ) : null}
          {githubAccounts.state === 'ready' ? (
            <Select
              icon={() => <Icon size={12} name="github" />}
              onChange={e => {
                setSelectedOrg(e.target.value);
              }}
              value={selectedOrg}
            >
              {accountOptions?.map(account => (
                <option key={account.id} value={account.login}>
                  {account.login}
                </option>
              ))}
            </Select>
          ) : null}
        </Label>
      </Stack>

      <Stack css={{ justifyContent: 'flex-end' }}>
        <Stack gap={2}>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            css={{ width: 'auto' }}
          >
            Cancel
          </Button>
          <Button
            disabled={destinationValidation.state !== 'valid' || isForking}
            type="submit"
            variant="primary"
            css={{ width: 'auto' }}
          >
            {isForking ? 'Forking' : 'Fork repository'}
          </Button>
        </Stack>
      </Stack>
    </Element>
  );
};
