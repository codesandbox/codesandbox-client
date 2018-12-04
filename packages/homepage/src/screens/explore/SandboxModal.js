import React, { Fragment } from 'react';
import { camelizeKeys } from 'humps';
import Stats from 'common/components/Stats';
import { Spring } from 'react-spring';
import getIcon from 'common/templates/icons';
import { profileUrl } from 'common/utils/url-generator';
import getTemplate from 'common/templates';
import Modal from './Modal';
import EmbedSkeleton from './EmbedSkeleton';
import {
  Container,
  StatsContainer,
  StatsHeader,
  Author,
  SandboxInfo,
  Footer,
  SandboxTitle,
  SandboxDescription,
  TemplateLogo,
} from './_SandboxModal.elements';

export default class SandboxModal extends React.PureComponent {
  state = {
    sandbox: undefined,
  };
  loadedSandboxes = {};

  getSandbox = (sandboxId: string) => {
    if (this.loadedSandboxes[sandboxId]) {
      return Promise.resolve(this.loadedSandboxes[sandboxId]);
    }

    return fetch(`http://localhost:3000/api/v1/sandboxes/${sandboxId}`)
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
    if (this.frame) {
      requestAnimationFrame(() => {
        this.frame.contentWindow.postMessage({ sandbox }, '*');
      });
    }

    this.setState({ sandbox });
  };

  componentDidMount() {
    this.fetchSandbox();
    this.registerListeners();
  }

  componentWillMount() {
    this.unregisterListeners();
  }

  registerListeners = () => {
    document.addEventListener('keydown', this.handleKeyPress);
  };

  unregisterListeners = () => {
    document.removeEventListener('keydown', this.handleKeyPress);
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

  setupFrame = el => {
    this.frame = el;
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
                <iframe
                  ref={this.setupFrame}
                  title="sandbox"
                  src={`http://localhost:3000/embed/custom?view=preview`}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    border: 0,
                    outline: 0,
                    zIndex: 20,
                    ...styles,
                  }}
                />

                {styles.opacity !== 1 && (
                  <EmbedSkeleton id={this.props.sandboxId} />
                )}
              </div>
            )}
          </Spring>

          <div style={{ display: 'flex' }}>
            <SandboxInfo>
              <SandboxTitle>{this.props.title}</SandboxTitle>
              <SandboxDescription>{this.props.description}</SandboxDescription>
            </SandboxInfo>

            <StatsContainer>
              <StatsHeader>Stats</StatsHeader>
              {sandbox && (
                <Stats
                  style={{ marginTop: 11 }}
                  vertical
                  text
                  viewCount={sandbox.viewCount}
                  likeCount={sandbox.likeCount}
                  forkCount={sandbox.forkCount}
                />
              )}
            </StatsContainer>
          </div>
          <Footer>
            {sandbox ? (
              <Fragment>
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
                <TemplateLogo>
                  <Icon width={31} height={31} />
                  <SandboxDescription
                    style={{ margin: 0, color: template.color() }}
                  >
                    {template.niceName}
                  </SandboxDescription>
                </TemplateLogo>
              </Fragment>
            ) : null}
          </Footer>
        </Container>
      </Modal>
    );
  }
}
