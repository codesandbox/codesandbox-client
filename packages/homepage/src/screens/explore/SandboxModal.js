import React from 'react';
import { camelizeKeys } from 'humps';
import styled from 'styled-components';
import Stats from 'common/components/Stats';
import { Spring } from 'react-spring';

import Modal from './Modal';
import EmbedSkeleton from './EmbedSkeleton';

const Container = styled.div`
  background-color: ${props => props.theme.background2};
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;
`;

const StatsContainer = styled.div`
  font-family: 'Poppins';

  flex: 1;
  padding: 1.5rem;
  margin-top: 3px;
  font-weight: 600;
  color: ${props => props.theme.new.description};
`;

const StatsHeader = styled.h2`
  font-family: 'Poppins';
  color: ${props => props.theme.new.title};
  font-size: 1.25rem;
  margin-top: 0 !important;
  margin-bottom: 0;
  font-weight: 700;
`;

const SandboxInfo = styled.div`
  padding: 1.5rem;
  font-family: 'Poppins';
  color: ${props => props.theme.new.title};
  flex: 2;
  min-height: 200px;
`;

const SandboxTitle = styled.h1`
  font-size: 1.5rem;
  font-family: 'Poppins';
  color: ${props => props.theme.new.title};
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const SandboxDescription = styled.p`
  font-family: 'Poppins';
  color: ${props => props.theme.new.title};
  color: ${props => props.theme.new.description};
`;

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
        </Container>
      </Modal>
    );
  }
}
