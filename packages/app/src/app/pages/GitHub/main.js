import React from 'react';

import Title from 'app/components/Title';
import SubTitle from 'app/components/SubTitle';
import { Button } from '@codesandbox/common/lib/components/Button';
import {
  gitHubToSandboxUrl,
  protocolAndHost,
  gitHubRepoPattern,
} from '@codesandbox/common/lib/utils/url-generator';

import {
  Content,
  Label,
  Description,
  StyledInput,
  ErrorMessage,
} from './elements';

const getFullGitHubUrl = url =>
  `${protocolAndHost()}${gitHubToSandboxUrl(url)}`;

class GitHub extends React.PureComponent {
  state = {
    url: '',
    transformedUrl: '',
    error: null,
  };

  updateUrl = e => {
    const url = e.target.value;

    if (!url) {
      this.setState({
        url,
        error: null,
        transformedUrl: '',
      });
    } else if (!gitHubRepoPattern.test(url)) {
      this.setState({
        url,
        error: 'The URL provided is not valid.',
        transformedUrl: '',
      });
    } else {
      this.setState({
        url: e.target.value,
        transformedUrl: getFullGitHubUrl(url.trim()),
        error: null,
      });
    }
  };

  render() {
    const { url, transformedUrl, error } = this.state;
    const { noConverted } = this.props;
    return (
      <Content vertical horizontal>
        <Description>
          <Title>Import from GitHub</Title>
          <SubTitle
            css={`
              font-size: 24px;
            `}
          >
            Enter the URL to your GitHub repository to generate a URL to your
            sandbox. The sandbox will stay in sync with your repository.
            <br />
            <a
              href="/docs/importing#import-from-github"
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
        <StyledInput
          name="githuburl"
          value={url}
          onChange={this.updateUrl}
          placeholder="Insert GitHub URL..."
        />

        {error !== null && <ErrorMessage>{error}</ErrorMessage>}

        {!noConverted && (
          <>
            <Label htmlFor="sandboxurl">Converted Sandbox URL</Label>
            <StyledInput
              name="sandboxurl"
              value={transformedUrl}
              placeholder="The Sandbox URL"
            />
          </>
        )}

        <Button disabled={!transformedUrl} to={gitHubToSandboxUrl(url)}>
          Open Sandbox
        </Button>
      </Content>
    );
  }
}

export default GitHub;
