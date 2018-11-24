// @ts-check
/* eslint-disable react/prefer-stateless-function */
import React from 'react';

import { observer } from 'mobx-react';
import EyeIcon from 'react-icons/lib/fa/eye';

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
  Wrapper,
  Description,
  Header,
} from './elements';

type Props = {
  id: string,
  title: string,
  viewCount: number,
  author: Object,
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
      author,
      description,
      onClick,
      picks,
    } = this.props;

    const { screenshotUrl } = this.state;
    const lastPick = picks[picks.length - 1];
    return (
      <Wrapper role="button" tabIndex={0} onClick={onClick}>
        <Container style={{ outline: 'none' }}>
          <SandboxImageContainer>
            <ImageMessage>{this.getImageMessage()}</ImageMessage>

            {this.hasScreenshot() && (
              <SandboxImage
                className="sandbox-image"
                style={{
                  backgroundImage: `url(${screenshotUrl})`,
                }}
              />
            )}
          </SandboxImageContainer>
          <SandboxInfo>
            <div style={{ flex: 1 }}>
              <div>
                <Header>
                  <SandboxTitle>{lastPick.title || title || id}</SandboxTitle>
                  {lastPick.description || description ? (
                    <Description>
                      {lastPick.description || description}
                    </Description>
                  ) : null}
                </Header>
              </div>
              <Details>
                <FlexCenter>
                  <EyeIcon style={{ fill: 'white', marginRight: '0.5rem' }} />
                  {viewCount}
                </FlexCenter>
                {author ? (
                  <FlexCenter role="button" tabIndex={0}>
                    <Avatar src={author.avatarUrl} alt={author.username} />
                    {author.name || author.username}
                  </FlexCenter>
                ) : null}
              </Details>
            </div>
          </SandboxInfo>
        </Container>
      </Wrapper>
    );
  }
}

export default observer(SandboxItem);
