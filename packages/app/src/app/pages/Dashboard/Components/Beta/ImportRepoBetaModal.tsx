import { ThemeProvider, Text, Input, Button } from '@codesandbox/components';
import Modal from 'app/components/Modal';
import { useAppState, useActions } from 'app/overmind';
import * as React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';

import {
  gitHubRepoPattern,
  gitHubToSandboxBetaUrl,
} from '@codesandbox/common/lib/utils/url-generator';

const getFullGitHubUrl = (url: string) =>
  `https://beta.codesandbox.stream${gitHubToSandboxBetaUrl(url)}`;

export const ImportRepoBetaModal = () => {
  const { modals } = useAppState();
  const { modals: modalsActions } = useActions();

  const [transformedUrl, setTransformedUrl] = React.useState('');
  const [error, setError] = React.useState(null);
  const [url, setUrl] = React.useState('');

  const updateUrl = React.useCallback(({ target: { value: newUrl } }) => {
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
    <ThemeProvider>
      <Modal
        isOpen={modals.importRepoBeta.isCurrent}
        onClose={() => modalsActions.importRepoBeta.close()}
        width={950}
        fullWidth={window.screen.availWidth < 800}
      >
        <Container>
          <Text
            css={css({
              display: 'block',
              textAlign: 'center',
              fontSize: 6,
              marginTop: 0,
              marginBottom: 3,
            })}
            as="h2"
          >
            Import from GitHub
          </Text>
          <Text
            css={css({
              display: 'block',
              textAlign: 'center',
              color: '#999999',
              marginBottom: 8,
            })}
          >
            Enter the URL to your GitHub repository to generate a URL to your
            sandbox.{' '}
          </Text>
          <Input
            placeholder="GitHub Repository URL..."
            css={css({
              backgroundColor: 'white',
              color: 'grays.900',
            })}
            value={url}
            onChange={updateUrl}
            type="text"
          />

          <PlaceHolderLink>{error}</PlaceHolderLink>

          <Button
            css={css({ marginTop: 3 })}
            disabled={error || !transformedUrl}
            onClick={() => {
              window.location.href = transformedUrl;
            }}
          >
            Import from GitHub
          </Button>
        </Container>
      </Modal>
    </ThemeProvider>
  );
};

const Container = styled.div`
  max-width: 340px;
  margin: auto;
  padding: 90px 0;
`;

const PlaceHolderLink = styled.span`
  transition: 0.3s ease color;

  &:empty {
    display: none;
  }

  display: block;
  margin: 1rem 0;

  text-decoration: none;
  font-weight: 500;
  font-size: 13px;
  color: ${({ theme }) => theme.red};
`;
