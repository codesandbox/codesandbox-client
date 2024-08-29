import { useActions, useAppState, useEffects } from 'app/overmind';
import React, { useEffect, useState } from 'react';
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
} from '@codesandbox/common/lib/utils/url-generator';

import { GithubAccounts } from 'app/hooks/useGithubOrganizations';
import { fuzzyMatchGithubToCsb } from 'app/utils/fuzzyMatchGithubToCsb';
import { VMTier } from 'app/overmind/effects/api/types';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { GithubRepoToImport } from '../../utils/types';
import { useValidateRepoDestination } from '../../hooks/useValidateRepoDestination';
import { AccountSelect } from '../components/AccountSelect';

const COLORS = {
  INVALID: '#F5A8A8',
  VALID: '#A3EC98',
};

type ForkRepoProps = {
  repository: GithubRepoToImport;
  githubAccounts: GithubAccounts;
};

export const ForkRepo: React.FC<ForkRepoProps> = ({
  repository,
  githubAccounts,
}) => {
  const { activeTeamInfo, user } = useAppState();
  const effects = useEffects();
  const { dashboard } = useActions();
  const { isFree } = useWorkspaceSubscription();
  const { highestAllowedVMTier } = useWorkspaceLimits();

  const defaultTier = isFree ? 1 : 2;
  const [selectedTier, setSelectedTier] = useState<number>(defaultTier);
  const [availableTiers, setAvailableTiers] = useState<VMTier[]>([]);

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

  const handleFork = async (e: React.FormEvent) => {
    e.preventDefault();

    if (destinationValidation.state !== 'valid' || isImporting) {
      return;
    }

    setIsImporting(true);

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
      track('Import repository - Fork - Fork successful', {
        vmTier: selectedTier,
      });

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
    if (!activeTeamInfo || selectedOrg || githubAccounts.state !== 'ready') {
      return;
    }

    setSelectedOrg(
      fuzzyMatchGithubToCsb(activeTeamInfo.name, githubAccounts.all).login
    );
  }, [activeTeamInfo, githubAccounts]);

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
      onSubmit={handleFork}
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
          Fork repository
        </Text>

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

        <Stack direction="vertical" align="flex-start" gap={2}>
          <Text size={3} as="label">
            Runtime
          </Text>

          <Select
            style={{ height: '32px' }}
            value={selectedTier}
            disabled
            onChange={e => setSelectedTier(parseInt(e.target.value, 10))}
          >
            {availableTiers.map(t => (
              <option key={t.shortid} value={t.tier}>
                {t.name} ({t.cpu} vCPUs, {t.memory} GiB RAM, {t.storage} GB Disk
                for {t.creditBasis} credits/hour)
              </option>
            ))}
          </Select>
          <Stack gap={1} align="center" css={{ color: '#A8BFFA' }}>
            <Icon name="circleBang" />
            <Text size={3}>
              You can only change the specs after the fork is completed, from
              within the editor.
            </Text>
          </Stack>
        </Stack>
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
                autoWidth
              >
                Open readonly
              </Button>
            </Tooltip>
          )}
          <Button
            disabled={destinationValidation.state !== 'valid' || isImporting}
            loading={isImporting}
            type="submit"
            variant="primary"
            autoWidth
          >
            Fork repository
          </Button>
        </Stack>
      </Stack>
    </Element>
  );
};
