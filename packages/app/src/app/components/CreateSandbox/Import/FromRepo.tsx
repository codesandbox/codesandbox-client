import { useActions, useAppState } from 'app/overmind';
import React, { useEffect } from 'react';
import {
  Badge,
  Button,
  Element,
  Icon,
  Input,
  Label,
  Stack,
  SkeletonText,
  Text,
} from '@codesandbox/components';
import styled, { keyframes } from 'styled-components';
import track from '@codesandbox/common/lib/utils/analytics';
import { GithubRepoToImport } from './types';
import { StyledSelect } from '../elements';
import { useGithubOrganizations } from './useGithubOrganizations';
import { useValidateRepoDestination } from './useValidateRepoDestination';
import { getGihubOrgMatchingCsbTeam } from './utils';

const COLORS = {
  INVALID: '#ED6C6C',
  VALID: '#2ECC71',
};

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledSpinner = styled.span`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
`;

type FromRepoProps = {
  repository: GithubRepoToImport;
  onCancel: () => void;
};
export const FromRepo: React.FC<FromRepoProps> = ({ repository, onCancel }) => {
  const { activeTeamInfo, user } = useAppState();
  const { dashboard } = useActions();
  const githubOrganizations = useGithubOrganizations();

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

    track('Create New - Create fork', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    setIsForking(true);
    await dashboard.forkGitHubRepository({
      source: { owner: repository.owner.login, name: repository.name },
      destination: {
        teamId: activeTeamInfo.id,
        organization:
          destinationValidation.owner !== user.username
            ? destinationValidation.owner
            : undefined,
        name: destinationValidation.name,
      },
    });
    setIsForking(false);
  };

  useEffect(() => {
    track('Create New - View create fork', {
      codesandbox: 'V1',
      event_source: 'UI',
    });
  }, []);

  useEffect(() => {
    setSelectedOrg(
      'data' in githubOrganizations
        ? getGihubOrgMatchingCsbTeam(
            activeTeamInfo.name,
            githubOrganizations.data
          ).login
        : ''
    );
  }, [activeTeamInfo, githubOrganizations.state]);

  return (
    <Stack
      direction="vertical"
      gap={7}
      css={{ width: '100%', height: '100%', paddingBottom: '24px' }}
    >
      <Stack css={{ justifyContent: 'space-between' }}>
        <Text
          as="h2"
          css={{
            fontSize: '16px',
            fontWeight: 500,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Create new fork
        </Text>
        <Badge icon="cloud">Beta</Badge>
      </Stack>
      <Element
        as="form"
        css={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          justifyContent: 'space-between',
        }}
        onSubmit={handleSubmit}
      >
        <Stack direction="vertical" gap={6}>
          <Stack direction="vertical" gap={3}>
            <Stack
              css={{
                position: 'relative',
              }}
              direction="vertical"
              gap={2}
            >
              <Input
                aria-invalid={destinationValidation.state === 'invalid'}
                css={{
                  fontFamily: 'inherit',
                  height: '48px',
                  padding: '8px 16px',
                  backgroundColor: '#2A2A2A',
                  color: '#E5E5E5',
                  border: '1px solid',
                  borderColor:
                    destinationValidation.state === 'invalid'
                      ? COLORS.INVALID
                      : 'transparent',
                  borderRadius: '2px',
                  fontSize: '13px',
                  lineHeight: '16px',
                  fontWeight: 500,

                  '&:focus, &:hover': {
                    borderColor:
                      destinationValidation.state === 'invalid'
                        ? COLORS.INVALID
                        : 'transparent',
                  },

                  '&:focus-within': {
                    borderColor:
                      destinationValidation.state === 'invalid'
                        ? COLORS.INVALID
                        : '9581FF',
                  },
                }}
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
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: {
                      valid: COLORS.VALID,
                      invalid: COLORS.INVALID,
                      validating: '#E5E5E5',
                    }[destinationValidation.state],
                  }}
                >
                  {destinationValidation.state === 'valid' ? (
                    <Icon name="simpleCheck" />
                  ) : null}
                  {destinationValidation.state === 'invalid' ? (
                    <Icon name="warning" />
                  ) : null}
                  {destinationValidation.state === 'validating' ? (
                    <StyledSpinner>
                      <Icon name="spinner" />
                    </StyledSpinner>
                  ) : null}
                </Element>
              ) : null}
            </Stack>
            {destinationValidation.state === 'invalid' ? (
              <Text
                as="small"
                size={2}
                css={{
                  display: 'block',
                  color: COLORS.INVALID,
                }}
              >
                {destinationValidation.error}
              </Text>
            ) : null}
          </Stack>

          <Label css={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Text as="span" size={2} css={{ color: '#808080' }}>
              Git organization
            </Text>
            {githubOrganizations.state === 'loading' ? (
              <SkeletonText
                css={{
                  height: '48px',
                  width: '100%',
                }}
              />
            ) : null}
            {githubOrganizations.state === 'ready' ? (
              <StyledSelect
                css={{
                  color: '#e5e5e5',
                }}
                icon={() => <Icon css={{ marginLeft: 8 }} name="github" />}
                onChange={e => {
                  setSelectedOrg(e.target.value);
                }}
                value={selectedOrg}
              >
                {githubOrganizations.data.map(org => (
                  <option key={org.id} value={org.login}>
                    {org.login}
                  </option>
                ))}
              </StyledSelect>
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
    </Stack>
  );
};
