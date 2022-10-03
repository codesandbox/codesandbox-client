import { useAppState } from 'app/overmind';
import React, { useState } from 'react';
import {
  Button,
  Element,
  Icon,
  Input,
  Label,
  Stack,
  Text,
} from '@codesandbox/components';
import { GithubRepoToImport } from './types';
import { CloudBetaBadge } from '../CloudBetaBadge';
import { StyledSelect } from '../elements';

export const FromRepo: React.FC<{ githubRepo: GithubRepoToImport }> = ({
  githubRepo,
}) => {
  const { hasLogIn, user, dashboard, activeTeam } = useAppState();

  const [repoName, setRepoName] = useState<string>(githubRepo.name);
  const [selectedTeam, setSelectedTeam] = useState<string>(activeTeam);

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
        <CloudBetaBadge />
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
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <Stack direction="vertical" gap={6}>
          <Stack direction="vertical" gap={2}>
            <Input
              autoFocus
              id="repo-name"
              type="text"
              aria-label="Repository name"
              placeholder="Repository name"
              value={repoName}
              onChange={e => setRepoName(e.target.value)}
              required
            />
          </Stack>

          <Label>
            <Text as="span">Git organization</Text>
            <StyledSelect
              id="repo-gh-org"
              icon={() => <Icon css={{ marginLeft: 8 }} name="github" />}
              onChange={e => {
                setSelectedTeam(e.target.value);
              }}
              value={selectedTeam}
              disabled={!hasLogIn || !user || !dashboard.teams}
            >
              {dashboard.teams.map(team => (
                <option key={team.id}>{team.name}</option>
              ))}
            </StyledSelect>
          </Label>

          <Label>
            <Text as="span">Privacy settings</Text>
            <StyledSelect
              id="repo-privacy"
              icon={() => <Icon css={{ marginLeft: 8 }} name="lock" />}
              onChange={e => {
                setSelectedTeam(e.target.value);
              }}
              value={selectedTeam}
            >
              <option key="public">Public</option>
              <option value="private">Private</option>
            </StyledSelect>
          </Label>
        </Stack>

        <Stack css={{ justifyContent: 'flex-end' }}>
          <Stack gap={2}>
            <Button
              type="button"
              variant="secondary"
              //   onClick={onCancel}
              css={{ width: 'auto' }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" css={{ width: 'auto' }}>
              Create repository
            </Button>
          </Stack>
        </Stack>
      </Element>
    </Stack>
  );
};
