// @ts-check
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import history from 'app/utils/history';
import { sandboxUrl, profileUrl } from 'common/utils/url-generator';

import { observer } from 'mobx-react';
import EyeIcon from 'react-icons/lib/fa/eye';
import GithubIcon from 'react-icons/lib/fa/github';

import getTemplate from 'common/templates';

import {
  Container,
  SandboxImageContainer,
  SandboxImage,
  SandboxInfo,
  ImageMessage,
  SandboxTitle,
  Avatar,
  Details,
  FlexCenter,
  Pick,
} from './elements';

type Props = {
  id: string,
  title: string,
  viewCount: number,
  author: Object,
  git: Object,
  description: string,
};

class SandboxItem extends React.Component<Props> {
  el: HTMLDivElement;

  state = {
    screenshotUrl: this.props.screenshotUrl,
  };

  requestScreenshot = () => {
    this.setState({
      screenshotUrl: `/api/v1/sandboxes/${this.props.id}/screenshot.png`,
    });
  };

  checkScreenshot() {
    if (!this.state.screenshotUrl && this.hasScreenshot()) {
      // We only request the screenshot if the sandbox card is in view for > 1 second
      this.screenshotTimeout = setTimeout(() => {
        this.requestScreenshot();
      }, 1000);
    }
  }

  componentDidMount() {
    this.checkScreenshot();
  }

  componentWillUnmount() {
    if (this.screenshotTimeout) {
      clearTimeout(this.screenshotTimeout);
    }
  }

  openSandbox = (openNewWindow = false) => {
    // Git sandboxes aren't shown here anyway
    const url = sandboxUrl({ id: this.props.id });
    if (openNewWindow === true) {
      window.open(url, '_blank');
    } else {
      history.push(url);
    }

    return true;
  };

  openUser = username => {
    const url = profileUrl(username);
    window.open(url, '_blank');
  };

  getImageMessage = () => {
    const templateDefinition = getTemplate(this.props.template);

    if (templateDefinition.isServer) {
      return `Container Sandbox`;
    }

    if (process.env.STAGING) {
      return `Staging Sandbox`;
    }

    return `Generating Screenshot...`;
  };

  hasScreenshot = () => {
    const templateDefinition = getTemplate(this.props.template);

    if (templateDefinition.isServer) {
      return false;
    }

    return true;
  };

  render() {
    const {
      id,
      title,
      viewCount,
      template,
      author,
      git,
      description,
      pickSandbox,
      picks,
    } = this.props;

    const { screenshotUrl } = this.state;

    const templateInfo = getTemplate(template);

    return (
      <div
        style={{
          padding: 2,
          borderRadius: 2,
          backgroundColor: 'transparent',
        }}
      >
        <Container style={{ outline: 'none' }}>
          <SandboxImageContainer
            role="button"
            tabIndex={0}
            onClick={this.openSandbox}
          >
            <ImageMessage>{this.getImageMessage()}</ImageMessage>

            {this.hasScreenshot() && (
              <SandboxImage
                style={{
                  backgroundImage: `url(${screenshotUrl})`,
                }}
              />
            )}
          </SandboxImageContainer>
          <SandboxInfo>
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: 2,
                height: 'calc(100% + 34px)',
                backgroundColor: templateInfo.color(),
              }}
            />
            <div style={{ flex: 1 }}>
              <div role="button" tabIndex={0} onClick={this.openSandbox}>
                <SandboxTitle>{title || id}</SandboxTitle>
                {description}
              </div>
              <Details>
                {author ? (
                  <FlexCenter
                    role="button"
                    tabIndex={0}
                    onClick={() => this.openUser(author.username)}
                  >
                    <Avatar src={author.avatarUrl} alt={author.username} />
                    {author.name || author.username}
                  </FlexCenter>
                ) : null}
                <FlexCenter
                  role="button"
                  tabIndex={0}
                  onClick={this.openSandbox}
                >
                  <EyeIcon style={{ marginRight: '0.5rem' }} />
                  {viewCount}
                </FlexCenter>
                {git ? (
                  <FlexCenter>
                    <a
                      href={`https://github.com/${git.username}/${git.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GithubIcon style={{ marginRight: '0.5rem' }} />
                    </a>
                  </FlexCenter>
                ) : null}
              </Details>
            </div>
          </SandboxInfo>
          <Pick small onClick={() => pickSandbox(id, title, description)}>
            {!picks.length ? '✨ Pick Sandbox' : '✨ Pick Sandbox again'}
          </Pick>
        </Container>
      </div>
    );
  }
}

export default observer(SandboxItem);
