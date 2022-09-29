import track from '@codesandbox/common/lib/utils/analytics';
import {
  gitHubRepoPattern,
  gitHubToProjectsUrl,
  protocolAndHost,
} from '@codesandbox/common/lib/utils/url-generator';
import {
  Button,
  Element,
  Input,
  Stack,
  Text,
  Link,
} from '@codesandbox/components';
import css from '@styled-system/css';
import React, { useCallback, useEffect, useState } from 'react';

import { DownloadIcon } from '../Icons/DownloadIcon';
import { TerminalIcon } from '../Icons/TerminalIcon';

const documentationLinkStyles = css({
  display: 'flex',
  gap: 2,
  alignItems: 'center',
  fontSize: 12,
  color: '#808080',
  textDecoration: 'none',
  transition: '0.3s ease color',

  '&:hover, &:focus': {
    color: 'white',
  },
});

const getFullGitHubUrl = (url: string) =>
  `${protocolAndHost()}${gitHubToProjectsUrl(url) + '?create=true'}`;

export const ImportFromGithub = () => {
  const [error, setError] = useState('Lorem ipsum');
  const [transformedUrl, setTransformedUrl] = useState('');
  const [url, setUrl] = useState('');

  const updateUrl = useCallback(({ target: { value: newUrl } }) => {
    if (!newUrl) {
      setError(null);
      setTransformedUrl('');
      setUrl(newUrl);
    } else if (!gitHubRepoPattern.test(newUrl)) {
      setError('The URL provided is not valid.');
      setTransformedUrl('');
      setUrl(newUrl);
    } else {
      setError(null);
      setTransformedUrl(getFullGitHubUrl(newUrl.trim()));
      setUrl(newUrl);
    }
  }, []);

  return (
    <form>
      <Stack>
        <Input
          css={css({
            fontSize: 13,
            paddingY: 1,
            paddingX: 4,
          })}
          value={url}
          onChange={updateUrl}
          type="text"
          placeholder="GitHub Repository URL"
        />

        <Button
          autoWidth
          css={{ fontSize: 13, marginLeft: '.5em' }}
          disabled={!transformedUrl}
          onClick={() => {
            window.open(gitHubToProjectsUrl(url) + '?create=true', '_blank');
          }}
        >
          Import
        </Button>
      </Stack>

      {error ? (
        <Text
          as="small"
          css={css({
            display: 'block',
            marginTop: 2,
            color: 'errorForeground',
            fontSize: 12,
          })}
        >
          {error}
        </Text>
      ) : null}
    </form>
  );
};

export const Import = () => {
  useEffect(() => {
    track('Create Sandbox Tab Open', { tab: 'import' });
  }, []);

  return (
    <Stack
      direction="vertical"
      gap={7}
      css={{ width: '100%', height: '100%', paddingBottom: '24px' }}
    >
      <Element
        as="header"
        css={css({
          marginBottom: 8,
        })}
      >
        <Text
          as="h2"
          css={{
            fontSize: '16px',
            fontWeight: 500,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Enter the GitHub repository URL to import
        </Text>
      </Element>

      <ImportFromGithub />

      <Stack
        css={css({
          flexDirection: 'row',
          gap: 6,
        })}
      >
        <Link
          css={documentationLinkStyles}
          href="/docs/importing#export-with-cli"
        >
          <TerminalIcon />
          CLI Documentation
        </Link>
        <Link css={documentationLinkStyles} href="/docs/importing#define-api">
          <DownloadIcon />
          API Documentation
        </Link>
      </Stack>
    </Stack>
  );
};
