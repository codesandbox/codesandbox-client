import track from '@codesandbox/common/lib/utils/analytics';
import { Button, Input, Stack, Text, Element } from '@codesandbox/components';
import { docsUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { useEffect } from 'react';

const InfoBlock = ({ label, content }: { label: string; content: string }) => (
  <Stack direction="vertical" gap={2}>
    <Text variant="muted" size={11}>
      {label}
    </Text>
    <Stack
      css={{
        backgroundColor: '#191919',
        padding: '16px',
      }}
    >
      <Text weight="medium" size={13}>
        {content}
      </Text>
    </Stack>
  </Stack>
);

/**
 * Parses a GitHub URL and returns the owner, repo, and optionally branch + folder
 * @param url A GitHub URL (folders are allowed)
 * @returns
 */
function getRepoInfoFromURL(
  url: string
):
  | { owner: string; repo: string; branch?: string; folder?: string }
  | undefined {
  const regex = /https?:\/\/github\.com\/([^/]+)\/([^/]+)(\/tree\/([^/]+))?(.+)?/;
  const match = url.match(regex);

  if (!match) {
    return undefined;
  }

  const [, owner, repo, , branch, folder] = match;

  return { owner, repo, branch, folder };
}

export const ImportTemplate = () => {
  const [repoUrl, setRepoUrl] = React.useState('');

  const info = getRepoInfoFromURL(repoUrl);

  let url = info
    ? `https://codesandbox.io/s/github/${info.owner}/${info.repo}`
    : '';
  if (info?.branch) {
    url += `/tree/${info.branch}`;
  }
  if (info?.folder) {
    url += info.folder;
  }

  useEffect(() => {
    if (url) {
      track('Import Template - GitHub URL entered', { repoUrl });
    }
  }, [url, repoUrl]);

  return (
    <Stack
      css={{ position: 'relative', height: '100%' }}
      gap={6}
      direction="vertical"
    >
      <Stack gap={4} direction="vertical">
        <Stack gap={2} direction="vertical">
          <Text
            as="h2"
            id="form-title"
            css={{
              display: 'block',
              fontSize: '16px',
              fontWeight: 500,
              margin: 0,
              marginBottom: 2,
              lineHeight: 1.5,
            }}
          >
            Import template
          </Text>
          <Text
            as="h3"
            id="form-title"
            variant="muted"
            css={{
              fontSize: '14px',
              fontWeight: 400,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Create a read-only devbox template that stays in sync with a GitHub
            repository or folder.
            <br />
            Learn more about synced templates{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={docsUrl('/learn/vm-sandboxes/synced-templates#what-are-synced-templates')}
            >
              here
            </a>
            .
          </Text>
        </Stack>
        <Input
          css={{ height: '32px' }}
          type="text"
          placeholder="GitHub URL (folders are allowed, e.g. https://github.com/:owner/:repo/tree/:branch/:folder)"
          value={repoUrl}
          onChange={e => setRepoUrl(e.target.value)}
        />

        <Stack gap={2}>
          <Input
            css={{ height: '32px' }}
            disabled={!info}
            value={url}
            readOnly
            onClick={e => {
              e.target.select();
            }}
            placeholder="Resulting CodeSandbox URL will appear here"
          />

          <Button
            style={{
              width: 100,
              height: 32,
              ...(info
                ? {}
                : {
                    pointerEvents: 'none',
                    opacity: 0.6,
                  }),
            }}
            disabled={!info}
            href={url}
            variant="primary"
            as="a"
            onClick={() => {
              track('Import Template - Open URL clicked');
            }}
          >
            Open URL
          </Button>
        </Stack>
      </Stack>
      {info && (
        <Stack gap={3} direction="vertical">
          <InfoBlock
            label="Repository"
            content={`${info.owner}/${info.repo}`}
          />

          <Stack gap={2}>
            {info.branch && (
              <Element css={{ flex: 1 }}>
                <InfoBlock label="Branch" content={info.branch} />
              </Element>
            )}

            <Element css={{ flex: 1 }}>
              {info.branch && info.folder && (
                <InfoBlock label="Folder" content={info.folder} />
              )}
            </Element>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
