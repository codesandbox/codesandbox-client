import css from '@styled-system/css';
import { withTheme } from 'styled-components';
import { Link } from 'react-router-dom';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import { Element, ThemeProvider, Button } from '@codesandbox/components';
import {
  gitHubToSandboxUrl,
  gitHubRepoPattern,
  protocolAndHost,
} from '@codesandbox/common/lib/utils/url-generator';
import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';

import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import { useActions } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';

import {
  Container,
  Content,
  Description,
  ErrorMessage,
  Input,
  Label,
} from './elements';

const getFullGitHubUrl = (url: string) =>
  `${protocolAndHost()}${gitHubToSandboxUrl(url)}`;

export const GitHub: FunctionComponent = withTheme(({ theme }) => {
  const { githubPageMounted } = useActions();
  const [error, setError] = useState(null);
  const [transformedUrl, setTransformedUrl] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    githubPageMounted();
  }, [githubPageMounted]);

  const updateUrl = ({
    target: { value: newUrl },
  }: ChangeEvent<HTMLInputElement>) => {
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
  };

  return (
    <ThemeProvider theme={theme.vsCode}>
      <Element
        css={css({
          width: '100vw',
          overflow: 'hidden',
          backgroundColor: 'sideBar.background',
        })}
      >
        <Navigation title="GitHub Import" />
        <MaxWidth>
          <div style={{ minHeight: '100vh' }}>
            <Element margin={6}>
              <Container>
                <Content horizontal vertical>
                  <Description>
                    <Title>Import from GitHub</Title>

                    <SubTitle>
                      Enter the URL to your GitHub repository to generate a URL
                      to your sandbox. The sandbox will stay in sync with your
                      repository.
                      <br />
                      <a
                        href="/docs/learn/repositories/getting-started/repo-import"
                        rel="noopener norefereer"
                        target="_blank"
                      >
                        See the docs
                      </a>
                    </SubTitle>
                  </Description>

                  <Label htmlFor="githuburl">
                    URL to GitHub Repository (supports branches and paths too)
                  </Label>

                  <Input
                    name="githuburl"
                    onChange={updateUrl}
                    placeholder="Insert GitHub URL..."
                    value={url}
                  />

                  {error !== null && <ErrorMessage>{error}</ErrorMessage>}

                  <Label htmlFor="sandboxurl">Converted Sandbox URL</Label>

                  <Input
                    name="sandboxurl"
                    placeholder="The Sandbox URL"
                    value={transformedUrl}
                  />

                  <Button
                    as={Link}
                    disabled={!transformedUrl}
                    to={gitHubToSandboxUrl(url)}
                  >
                    Open Sandbox
                  </Button>
                </Content>
              </Container>
            </Element>
          </div>
        </MaxWidth>
      </Element>
    </ThemeProvider>
  );
});
