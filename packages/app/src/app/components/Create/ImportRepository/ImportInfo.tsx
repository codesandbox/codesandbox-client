import React from 'react';
import { Element, Icon, Link, Stack, Text } from '@codesandbox/components';
import {
  v2DefaultBranchUrl,
  docsUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { GithubRepoToImport } from './types';

export const ImportInfo: React.FC<{ githubRepo: GithubRepoToImport }> = ({
  githubRepo,
}) => {
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
        alt={githubRepo.owner.login}
        src={githubRepo.owner.avatarUrl}
      />
      <Stack direction="vertical">
        <Text size={3} weight="medium">
          {githubRepo.name}
        </Text>
        <Text size={2} css={{ color: '#808080' }}>
          {githubRepo.owner.login}
        </Text>
      </Stack>

      <Stack direction="vertical" gap={4}>
        <Text size={2} css={{ color: '#808080' }}>
          You don&lsquo;t have write access to this repository.
        </Text>
        <Text size={2} css={{ color: '#808080' }}>
          If you wish to contribute, you can create a contribution branch or
          fork the repository to experiment freely.
        </Text>
      </Stack>

      <Stack direction="vertical" gap={4}>
        {/* 
        TODO: Replace the link to contribution branch creation in the editor
              with the proper mutation to create a contribution branch before
              redirecting to the editor
        <Link
          css={{ color: '#808080', display: 'flex', gap: '8px' }}
          href={v2DraftBranchUrl({
            owner: githubRepo.owner.login,
            repoName: githubRepo.name,
          })}
        >
          <Icon name="contribution" />
          <Text as="span" size={2}>
            Create contribution branch
          </Text>
        </Link> */}

        <Link
          css={{ color: '#808080', display: 'flex', gap: '8px' }}
          href={v2DefaultBranchUrl({
            owner: githubRepo.owner.login,
            repoName: githubRepo.name,
          })}
        >
          <Icon name="eye" />
          <Text as="span" size={2}>
            View project
          </Text>
        </Link>
        <Link
          css={{ color: '#808080', display: 'flex', gap: '8px' }}
          href={docsUrl('/learn/repositories/open-source')}
          target="_blank"
        >
          <Icon name="file" />
          <Text as="span" size={2}>
            Learn more
          </Text>
        </Link>
      </Stack>
    </Stack>
  );
};
