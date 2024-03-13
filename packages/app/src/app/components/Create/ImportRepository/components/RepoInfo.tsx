import React from 'react';
import { Element, Icon, Stack, Text } from '@codesandbox/components';

import { GithubRepoToImport } from '../../utils/types';

export const RepoInfo: React.FC<{
  repository: GithubRepoToImport;
  forkMode: boolean;
}> = ({ repository, forkMode }) => {
  return (
    <Stack direction="vertical" gap={6}>
      <Element
        as="img"
        css={{
          borderRadius: 2,
          border: '0.5px solid #4D4D4D',
          display: 'flex',
          height: 32,
          width: 32,
        }}
        alt={repository.owner.login}
        src={repository.owner.avatarUrl}
      />
      <Stack direction="vertical" gap={1}>
        <Text size={3} css={{ color: '#ADADAD' }}>
          {repository.owner.login}
        </Text>
        <Text size={3} css={{ color: '#E5E5E5' }} weight="medium">
          {repository.name}
        </Text>
      </Stack>

      <Stack gap={1}>
        <Icon
          size={16}
          css={{ color: '#ADADAD' }}
          name={repository.private ? 'lock' : 'discover'}
        />
        <Text size={3} css={{ color: '#ADADAD' }}>
          {repository.private ? 'Private repository' : 'Public repository'}
        </Text>
      </Stack>

      {forkMode ? (
        <Stack direction="vertical" gap={4}>
          <Text size={3} css={{ color: '#999999' }}>
            You don&lsquo;t have write access to this repository.
          </Text>
          <Text size={3} css={{ color: '#999999' }}>
            If you wish to contribute, you first have to create a fork in one of
            your GitHub organizations.
          </Text>
        </Stack>
      ) : (
        <Stack direction="vertical" gap={4}>
          <Text size={3} css={{ color: '#999999' }}>
            You have write access to this repository.
          </Text>
          <Text size={3} css={{ color: '#999999' }}>
            Once imported, workspace members that also have write access will be
            able to create branches and commit changes.
          </Text>
        </Stack>
      )}
    </Stack>
  );
};
