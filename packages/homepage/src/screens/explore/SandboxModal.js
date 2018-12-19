import React, { Fragment } from 'react';
import { camelizeKeys } from 'humps';
import { Spring } from 'react-spring';
import getIcon from 'common/templates/icons';
import {
  profileUrl,
  githubRepoUrl,
  protocolAndHost,
} from 'common/utils/url-generator';
import getTemplate from 'common/templates';
import GithubBadge from 'common/components/GithubBadge';

import Tags from 'common/components/Tags';
import track from 'common/utils/analytics';

import Modal from './Modal';
import EmbedSkeleton from './EmbedSkeleton';
import {
  Container,
  StatsContainer,
  StatsHeader,
  StyledStats,
  Author,
  SandboxInfo,
  Footer,
  FooterInfo,
  SandboxTitle,
  SandboxDescription,
  TemplateLogo,
  StyledRightArrow,
  StyledLeftArrow,
  SandboxInfoContianer,
} from './_SandboxModal.elements';

export default class SandboxModal extends React.PureComponent {
  state = {
    sandbox: undefined,
    showFrame: false,
  };
  loadedSandboxes = {};

  getSandbox = (sandboxId: string) => {
    track('Explore Sandbox Open', { sandboxId });

    if (this.loadedSandboxes[sandboxId]) {
      return Promise.resolve(this.loadedSandboxes[sandboxId]);
    }

    return fetch(`${protocolAndHost()}/api/v1/sandboxes/${sandboxId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
      },
    })
      .then(x => x.json())
      .then(x => {
        const data = camelizeKeys(x.data);
        this.loadedSandboxes[data.id] = data;
        return data;
      });
  };

  fetchSandbox = async (props = this.props) => {
    if (!props.sandboxId) {
      return;
    }

    const sandbox = await this.getSandbox(props.sandboxId);

    this.setState({ sandbox });

    if (this.frame) {
      await this.frameInitializedPromise;
      this.frame.contentWindow.postMessage({ sandbox }, '*');
    }
  };

  componentDidMount() {
    this.fetchSandbox();
    this.registerListeners();

    this.frameInitializedPromise = new Promise(resolve => {
      this.resolveFrameInitializedPromise = resolve;
    });

    setTimeout(() => {
      this.setState({ showFrame: true });
    }, 1000);
  }

  componentWillUnmount() {
    this.unregisterListeners();
  }

  registerListeners = () => {
    document.addEventListener('keyup', this.handleKeyPress);
  };

  unregisterListeners = () => {
    document.removeEventListener('keyup', this.handleKeyPress);
    window.removeEventListener('message', this.listenForInitialized);
  };

  handleKeyPress = e => {
    if (!this.props.sandboxId) return;
    const code = e.which || e.keyCode;

    // left arrow pressed
    if (code === 37 && this.props.openPreviousSandbox) {
      this.props.openPreviousSandbox();
      // right arrow pressed
    } else if (code === 39 && this.props.openNextSandbox) {
      this.props.openNextSandbox();
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.sandboxId !== this.props.sandboxId) {
      this.setState({ sandbox: undefined });
      this.fetchSandbox(nextProps);
    }
  }

  listenForInitialized = e => {
    if (e && e.data === 'ready') {
      this.resolveFrameInitializedPromise();
    }
  };

  setupFrame = el => {
    this.frame = el;

    window.addEventListener('message', this.listenForInitialized);
  };

  render() {
    const { sandbox } = this.state;
    const Icon = sandbox ? getIcon(sandbox.template) : Fragment;
    const template = sandbox ? getTemplate(sandbox.template) : {};

    return (
      <Modal
        onClose={this.props.onClose}
        isOpen={this.props.sandboxId}
        width={1000}
      >
        <Container>
          {this.props.openPreviousSandbox && (
            <StyledLeftArrow onClick={this.props.openPreviousSandbox} />
          )}
          {this.props.openNextSandbox && (
            <StyledRightArrow onClick={this.props.openNextSandbox} />
          )}
          <Spring
            from={{ opacity: this.state.sandbox ? 1 : 0 }}
            to={{ opacity: this.state.sandbox ? 1 : 0 }}
          >
            {styles => (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 550,
                }}
              >
                {this.state.showFrame && (
                  <iframe
                    ref={this.setupFrame}
                    title="sandbox"
                    src={`${protocolAndHost()}/embed/custom?view=preview`}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      border: 0,
                      outline: 0,
                      zIndex: 20,
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4,
                      ...styles,
                    }}
                  />
                )}

                {styles.opacity !== 1 && (
                  <EmbedSkeleton
                    screenshotUrl={this.props.screenshotUrl}
                    id={this.props.sandboxId}
                  />
                )}
              </div>
            )}
          </Spring>

          <SandboxInfoContianer>
            <SandboxInfo>
              <SandboxTitle>{this.props.title}</SandboxTitle>
              <SandboxDescription>{this.props.description}</SandboxDescription>
              {sandbox &&
                sandbox.tags && (
                  <Tags style={{ fontSize: '.7rem' }} tags={sandbox.tags} />
                )}
            </SandboxInfo>

            <StatsContainer>
              <StatsHeader>Stats</StatsHeader>
              {sandbox && (
                <Spring from={{ opacity: sandbox ? 1 : 0 }} to={{ opacity: 1 }}>
                  {style => (
                    <StyledStats
                      style={style}
                      vertical
                      text
                      viewCount={sandbox.viewCount}
                      likeCount={sandbox.likeCount}
                      forkCount={sandbox.forkCount}
                    />
                  )}
                </Spring>
              )}
            </StatsContainer>
          </SandboxInfoContianer>
          <Footer>
            {sandbox ? (
              <FooterInfo>
                {sandbox.author || sandbox.git ? (
                  <React.Fragment>
                    {sandbox.author && (
                      <a
                        href={profileUrl(sandbox.author.username)}
                        style={{
                          top: 28,
                          position: 'relative',
                        }}
                      >
                        <Author
                          username={sandbox.author.username}
                          avatarUrl={sandbox.author.avatarUrl}
                        />
                      </a>
                    )}

                    {sandbox.git && (
                      <GithubBadge
                        style={{ lineHeight: 1.7 }}
                        username={sandbox.git.username}
                        repo={sandbox.git.repo}
                        branch={sandbox.git.branch}
                        url={githubRepoUrl(sandbox.git)}
                      />
                    )}
                  </React.Fragment>
                ) : (
                  <div />
                )}
                <TemplateLogo>
                  <Icon width={31} height={31} />
                  <SandboxDescription
                    style={{ margin: 0, color: template.color() }}
                  >
                    {template.niceName}
                  </SandboxDescription>
                </TemplateLogo>
              </FooterInfo>
            ) : (
              <div style={{ height: 31 }} />
            )}
          </Footer>
        </Container>
      </Modal>
    );
  }
}
