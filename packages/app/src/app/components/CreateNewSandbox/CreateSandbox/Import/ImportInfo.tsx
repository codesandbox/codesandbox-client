import React from 'react';
import { Element, Icon, Link, Stack, Text } from '@codesandbox/components';
import { GithubRepoAuthorization } from 'app/graphql/types';
import { GithubRepoToImport } from './types';

export const ImportInfo: React.FC<{ githubRepo: GithubRepoToImport }> = ({
  githubRepo,
}) => {
  return (
    <Stack direction="vertical" gap={6}>
      <img src={githubRepo.owner.avatarUrl} alt="" />
      <Text>{githubRepo.name}</Text>
      <Text>{githubRepo.owner.login}</Text>

      {githubRepo.authorization !== GithubRepoAuthorization.Write && (
        <Element>
          <Text>You don&lsquo;t have write access to this repository.</Text>
          <Text>
            If you wish to contribute, you can create a contribution branch or
            fork the repository to experiment freely.
          </Text>
          <Link>
            <Icon name="branch" />
            Create contribution branch
          </Link>
        </Element>
      )}
      <Link>
        <Icon name="eye" />
        View project
      </Link>
      <Link>
        <Icon name="file" />
        Learn more
      </Link>
    </Stack>
  );
};
