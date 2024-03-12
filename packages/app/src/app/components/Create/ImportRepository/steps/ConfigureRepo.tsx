import { useActions, useAppState, useEffects } from 'app/overmind';
import React, { Fragment, useEffect, useState } from 'react';
import {
  Button,
  Element,
  Icon,
  Input,
  Stack,
  SkeletonText,
  Text,
  Select,
  Tooltip,
} from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import {
  v2BranchUrl,
  v2DefaultBranchUrl,
  githubAppInstallLink,
} from '@codesandbox/common/lib/utils/url-generator';

import { GithubAccounts } from 'app/hooks/useGithubOrganizations';
import { fuzzyMatchGithubToCsb } from 'app/utils/fuzzyMatchGithubToCsb';
import { VMTier } from 'app/overmind/effects/api/types';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import styled from 'styled-components';
import { useNewControlledWindow } from 'app/hooks/useNewControlledWindow';
import { GithubRepoToImport, RepoDefinition } from '../../utils/types';
import { useValidateRepoDestination } from '../../hooks/useValidateRepoDestination';
import { AccountSelect } from '../components/AccountSelect';
import { useRepositoryWorkspaces } from '../../hooks/useRepositoryWorkspaces';
import { InputExplanation } from '../components/InputExplanation';

const COLORS = {
  INVALID: '#F5A8A8',
  VALID: '#A3EC98',
};

type ConfigureRepoProps = {
  repository: GithubRepoToImport;
  forkMode: boolean;
  githubAccounts: GithubAccounts;
  onRefetchGithubRepo: (repo: RepoDefinition) => void;
};

export const ConfigureRepo: React.FC<ConfigureRepoProps> = ({
  repository,
  forkMode,
  githubAccounts,
  onRefetchGithubRepo,
}) => {
  const { activeTeamInfo, user } = useAppState();
  const effects = useEffects();
  const { dashboard } = useActions();
  const { isFree } = useWorkspaceSubscription();
  const { highestAllowedVMTier } = useWorkspaceLimits();

  const defaultTier = isFree ? 1 : 2;
  const [selectedTier, setSelectedTier] = useState<number>(defaultTier);
  const [availableTiers, setAvailableTiers] = useState<VMTier[]>([]);

  // Import related fields
  const repositoryWorkspaces = useRepositoryWorkspaces(
    repository.owner.login,
    repository.name
  );

  // Fork related fields
  const [isImporting, setIsImporting] = React.useState<boolean>(false);
  const [repoName, setRepoName] = React.useState<string>(repository.name);
  const [selectedOrg, setSelectedOrg] = React.useState<string>('');

  const destinationValidation = useValidateRepoDestination(
    selectedOrg,
    repoName
  );

  useEffect(() => {
    effects.api.getVMSpecs().then(res => {
      setAvailableTiers(
        res.vmTiers.filter(t => t.tier <= highestAllowedVMTier)
      );
    });
  }, []);

  const { openNewWindow: openGHAppInstallWindow } = useNewControlledWindow({
    url: githubAppInstallLink(),
    trackEvents: {
      open: 'Import repository - Configure - Click Install GH App',
      close: 'Import repository - Configure - Close GH App Window',
    },
    onCloseWindow: () => {
      onRefetchGithubRepo({
        owner: repository.owner.login,
        name: repository.name,
      });
    },
  });

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isImporting) {
      return;
    }

    setIsImporting(true);
    track('Import repository - Configure - Click import', {
      vmTier: selectedTier,
    });

    const result = await dashboard.importGitHubRepository({
      name: repository.name,
      owner: repository.owner.login,
      vmTier: selectedTier,
    });

    if (result.success) {
      track('Import repository - Configure - Import successful');

      window.location.href = v2BranchUrl({
        owner: repository.owner.login,
        repoName: repository.name,
        branchName: result.defaultBranch,
        workspaceId: activeTeamInfo?.id,
        importFlag: true,
      });
    }

    setIsImporting(false);
  };

  const handleFork = async (e: React.FormEvent) => {
    e.preventDefault();

    if (destinationValidation.state !== 'valid' || isImporting) {
      return;
    }

    setIsImporting(true);
    track('Import repository - Configure - Click fork', {
      vmTier: selectedTier,
    });

    const result = await dashboard.forkGitHubRepository({
      source: { owner: repository.owner.login, name: repository.name },
      destination: {
        teamId: activeTeamInfo.id,
        organization:
          destinationValidation.owner !== user.githubProfile?.data?.login
            ? destinationValidation.owner
            : undefined,
        name: destinationValidation.name,
      },
      vmTier: selectedTier,
    });

    if (result.success) {
      track('Import repository - Configure - Fork successful');

      window.location.href = v2BranchUrl({
        workspaceId: activeTeamInfo?.id,
        importFlag: true,
        owner: destinationValidation.owner,
        repoName: destinationValidation.name,
        branchName: result.defaultBranch,
      });
    }

    setIsImporting(false);
  };

  useEffect(() => {
    if (
      !activeTeamInfo ||
      selectedOrg ||
      !forkMode ||
      githubAccounts.state !== 'ready'
    ) {
      return;
    }

    setSelectedOrg(
      fuzzyMatchGithubToCsb(activeTeamInfo.name, githubAccounts.all).login
    );
  }, [activeTeamInfo, githubAccounts, forkMode]);

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
      onSubmit={forkMode ? handleFork : handleImport}
    >
      <Stack direction="vertical" gap={8}>
        <Text
          as="h2"
          css={{
            fontSize: '16px',
            fontWeight: 500,
            margin: 0,
          }}
        >
          {forkMode ? 'Fork repository' : 'Import repository'}
        </Text>
        {forkMode ? (
          <Stack direction="vertical" gap={2}>
            <Text size={3} as="label">
              Destination
            </Text>
            <Stack gap={1} align="center">
              {githubAccounts.state === 'ready' ? (
                <AccountSelect
                  options={githubAccounts.all}
                  value={selectedOrg}
                  onChange={(account: string) => {
                    track('Import repository - Configure - Change GH Org');
                    setSelectedOrg(account);
                  }}
                  variant="secondary"
                />
              ) : (
                <SkeletonText css={{ height: '32px', width: '100px' }} />
              )}

              <Text color="#e5e5e5">/</Text>
              <Element
                css={{
                  position: 'relative',
                  flex: 1,
                }}
              >
                <Input
                  aria-invalid={destinationValidation.state === 'invalid'}
                  autoFocus
                  css={{ height: '32px' }}
                  id="repo-name"
                  type="text"
                  aria-label="Repository name"
                  placeholder="Repository name"
                  disabled={!forkMode}
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
                      <Icon size={16} name="cross" />
                    ) : null}
                    {destinationValidation.state === 'validating' ? (
                      <Icon size={16} name="spinner" />
                    ) : null}
                  </Element>
                ) : null}
              </Element>
            </Stack>
            {destinationValidation.state === 'invalid' ? (
              <Text size={3} color={COLORS.INVALID}>
                {destinationValidation.error}
              </Text>
            ) : null}
          </Stack>
        ) : (
          <Stack direction="vertical" gap={2}>
            <Text size={3} as="label">
              Name
            </Text>

            <Input
              css={{ height: '32px' }}
              id="repo-name"
              type="text"
              aria-label="Repository name"
              placeholder="Repository name"
              disabled
              value={repository.fullName}
            />

            {repositoryWorkspaces.length > 0 && (
              <InputExplanation variant="info">
                This repository has already been imported into{' '}
                {repositoryWorkspaces.length === 1 ? 'one' : 'some'} of your
                workspaces, open it on:{' '}
                {repositoryWorkspaces.map((team, teamIndex) => (
                  <Fragment key={team.id}>
                    <Button
                      as="a"
                      css={{
                        display: 'inline-flex',
                        color: 'inherit',
                        fontWeight: 500,
                        textDecoration: 'underline',
                      }}
                      href={v2DefaultBranchUrl({
                        owner: repository.owner.login,
                        repoName: repository.name,
                        workspaceId: team.id,
                      })}
                    >
                      {team.name}
                    </Button>
                    {repositoryWorkspaces.length > 1 &&
                      teamIndex !== repositoryWorkspaces.length - 1 &&
                      ', '}
                  </Fragment>
                ))}
              </InputExplanation>
            )}
          </Stack>
        )}

        <Stack direction="vertical" align="flex-start" gap={2}>
          <Text size={3} as="label">
            Runtime
          </Text>

          <Select
            css={{ height: '32px' }}
            value={selectedTier}
            disabled={availableTiers.length === 0}
            onChange={e => setSelectedTier(parseInt(e.target.value, 10))}
          >
            {availableTiers.map(t => (
              <option key={t.shortid} value={t.tier}>
                {t.name} ({t.cpu} vCPUs, {t.memory} GiB RAM, {t.storage} GB Disk
                for {t.creditBasis} credits/hour)
              </option>
            ))}
          </Select>
          {isFree && (
            <Stack gap={1} align="center" css={{ color: '#A8BFFA' }}>
              <Icon name="circleBang" />
              <Text size={3}>
                Better specs are available for Pro workspaces.
              </Text>
            </Stack>
          )}
        </Stack>

        {repository.appInstalled ? (
          <StyledGHAppCard gap={4}>
            <Icon size={24} name="simpleCheck" color="#A3EC98" />
            <Stack gap={1} direction="vertical">
              <Text size={3}>GitHub App is installed</Text>
              <Text size={3} color="#a6a6a6">
                Each pull request on this repository gets an instant CodeSandbox
                link.
              </Text>
            </Stack>
          </StyledGHAppCard>
        ) : (
          <StyledGHAppInteractiveCard
            gap={4}
            as="button"
            type="button"
            onClick={openGHAppInstallWindow}
          >
            <Icon size={24} name="github" />
            <Stack gap={1} direction="vertical">
              <Text size={3}>Setup PR previews</Text>
              <Text size={3} color="#a6a6a6">
                Install our GitHub App to get CodeSandbox links on each pull
                request.
              </Text>
            </Stack>
          </StyledGHAppInteractiveCard>
        )}
      </Stack>

      <Stack css={{ justifyContent: 'flex-end' }}>
        <Stack gap={2}>
          {!repository.private && (
            <Tooltip label="Opens the readonly version of this repository without forking or importing it into your workspace">
              <Button
                as="a"
                href={v2DefaultBranchUrl({
                  owner: repository.owner.login,
                  repoName: repository.name,
                })}
                variant="secondary"
                onClick={() => {
                  track('Import repository - Configure - Open readonly');
                }}
                autoWidth
              >
                Open readonly
              </Button>
            </Tooltip>
          )}
          <Button
            disabled={
              (forkMode && destinationValidation.state !== 'valid') ||
              isImporting
            }
            loading={isImporting}
            type="submit"
            variant="primary"
            autoWidth
          >
            {forkMode ? 'Fork repository' : 'Import repository'}
          </Button>
        </Stack>
      </Stack>
    </Element>
  );
};

const StyledGHAppCard = styled(Stack)`
  background: #242424;
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 4px;
  border: 1px solid #242424;
  max-width: 330px;
  align-items: center;
`;

const StyledGHAppInteractiveCard = styled(StyledGHAppCard)`
  cursor: pointer;
  transition: background 0.125s ease-out;
  border: 1px solid #343434;
  &:hover {
    background: #343434;
  }
`;
