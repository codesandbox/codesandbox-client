import React from 'react';

import getTemplate from '@codesandbox/common/lib/templates';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import {
  ARROW_LEFT,
  ARROW_RIGHT,
} from '@codesandbox/common/lib/utils/keycodes';
import FeaturedSandbox from '@codesandbox/common/lib/components/FeaturedSandbox';
import WideSandbox from '@codesandbox/common/lib/components/WideSandbox';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';

import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import PageContainer from '../../components/PageContainer';
import { Heading2 } from '../../components/headings';
import Layout from '../../components/layout';

import SandboxModal from '../../screens/explore/SandboxModal';
import featuredSandboxes from '../../utils/featuredSandboxes';
import {
  Container,
  Dots,
  Dot,
  DotContainer,
  Sandboxes,
  ShowMore,
  StyledRightArrow,
  StyledLeftArrow,
  Navigation,
  PickedQuestion,
} from './_elements';

export default class Explore extends React.PureComponent {
  state = {
    sandboxes: [],
    selectedSandbox: undefined,
    featuredSandboxIndex: 0,
    currentPage: 0,
    fetching: false,
    loadedAll: false,
    renderModal: false,
  };

  componentDidMount() {
    this.loadSandboxes();

    // We need to do this for SSR, the modal can't be rendered when using SSR,
    // we cannot just put a check in `render` because that would mean that client
    // render and server render are not the same. So we force a rerender.
    // eslint-disable-next-line
    this.setState({ renderModal: true });

    document.addEventListener('keyup', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyPress, false);
  }

  loadSandboxes = () => {
    this.setState({ fetching: true });
    fetch(
      `${protocolAndHost()}/api/v1/sandboxes/picked?page=${
        this.state.currentPage
      }`
    )
      .then(x => x.json())
      .then(data => {
        if (data.sandboxes.length === 0) {
          this.setState({ loadedAll: true });
        } else {
          this.setState(s => ({
            fetching: false,
            sandboxes: [...s.sandboxes, ...data.sandboxes],
            currentPage: s.currentPage + 1,
          }));
        }
      });
  };

  closeModal = () => {
    this.setState({ selectedSandbox: undefined });
  };

  openSandbox = index => {
    this.setState(state => {
      const sandbox = state.sandboxes[index];
      const { id, picks } = sandbox;
      const { title, description } = picks[0];
      return {
        selectedSandbox: {
          id,
          title,
          description,
          screenshotUrl: sandbox.screenshot_url,
        },
      };
    });
  };

  openPreviousSandbox = currentIndex => () => {
    this.openSandbox(currentIndex - 1);
  };

  openNextSandbox = currentIndex => () => {
    this.openSandbox(currentIndex + 1);
  };

  selectSandbox = ({ id, title, description, screenshotUrl }) => {
    this.setState({
      selectedSandbox: { id, title, description, screenshotUrl },
    });
  };

  navigateToNextSandbox = () => {
    const next = this.state.featuredSandboxIndex + 1;
    // if last go to first
    this.setState({
      featuredSandboxIndex: next === featuredSandboxes.length ? 0 : next,
    });
  };

  navigateToPreviousSandbox = () => {
    const index = this.state.featuredSandboxIndex;

    // if first go to last
    this.setState({
      featuredSandboxIndex:
        index === 0 ? featuredSandboxes.length - 1 : index - 1,
    });
  };

  handleKeyPress = ({ keyCode }) => {
    switch (keyCode) {
      case ARROW_LEFT:
        this.navigateToPreviousSandbox();
        break;
      case ARROW_RIGHT:
        this.navigateToNextSandbox();
        break;
      default:
    }
  };

  getCurrentIndex = () =>
    this.state.selectedSandbox
      ? this.state.sandboxes.findIndex(
          s => this.state.selectedSandbox.id === s.id
        )
      : -1;

  render() {
    const { selectedSandbox, featuredSandboxIndex } = this.state;

    const featuredSandboxInfo =
      featuredSandboxes[this.state.featuredSandboxIndex];

    const currentIndex = this.getCurrentIndex();

    return (
      <Layout>
        <Container>
          <TitleAndMetaTags
            image="https://codesandbox.io/static/img/explore.png"
            description="You can find the most interesting sandboxes created on CodeSandbox here. Explore examples of JavaScript and frameworks like React, Vue and Angular!"
            title="Explore Sandboxes - CodeSandbox"
          />

          {this.state.renderModal && (
            <SandboxModal
              onClose={this.closeModal}
              sandboxId={selectedSandbox && selectedSandbox.id}
              screenshotUrl={selectedSandbox && selectedSandbox.screenshotUrl}
              title={selectedSandbox && selectedSandbox.title}
              description={selectedSandbox && selectedSandbox.description}
              openPreviousSandbox={
                currentIndex > 0 &&
                currentIndex !== -1 &&
                this.openPreviousSandbox(currentIndex)
              }
              openNextSandbox={
                currentIndex < this.state.sandboxes.length - 1 &&
                currentIndex !== -1 &&
                this.openNextSandbox(currentIndex)
              }
            />
          )}

          <PageContainer width={1440}>
            <FeaturedSandbox
              title={featuredSandboxInfo.title}
              description={featuredSandboxInfo.description}
              sandboxId={featuredSandboxInfo.sandboxId}
              featuredSandboxes={featuredSandboxes}
              pickSandbox={this.selectSandbox}
            />

            <Navigation>
              <Dots>
                <StyledLeftArrow
                  disable={featuredSandboxIndex === 0}
                  onClick={this.navigateToPreviousSandbox}
                />

                {featuredSandboxes.map((sandbox, i) => {
                  const template = getTemplate(sandbox.template);

                  return (
                    <DotContainer key={sandbox.sandboxId}>
                      <Dot
                        aria-label={getSandboxName(sandbox)}
                        active={i === this.state.featuredSandboxIndex}
                        color={template.color()}
                        onClick={() =>
                          this.setState({
                            featuredSandboxIndex: i,
                          })
                        }
                      />
                    </DotContainer>
                  );
                })}

                <StyledRightArrow
                  disable={
                    featuredSandboxIndex === featuredSandboxes.length - 1
                  }
                  onClick={this.navigateToNextSandbox}
                />
              </Dots>
            </Navigation>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Heading2 style={{ margin: '3rem 0', flex: 1, width: '100%' }}>
                Picked Sandboxes
              </Heading2>
              <PickedQuestion to="/docs/explore">
                How do I get picked?
              </PickedQuestion>
            </div>
            <Sandboxes>
              {this.state.sandboxes.length !== 0
                ? this.state.sandboxes.map((sandbox, i) => (
                    // We force i here so we reuse the existing components
                    // eslint-disable-next-line react/no-array-index-key,no-console
                    <Margin key={i} bottom={2}>
                      <WideSandbox
                        selectSandbox={this.selectSandbox}
                        sandbox={sandbox}
                      />
                    </Margin>
                  ))
                : new Array(16).fill(undefined).map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key,no-console
                    <Margin key={i} bottom={2}>
                      <WideSandbox />
                    </Margin>
                  ))}
            </Sandboxes>

            {!this.state.loadedAll && (
              <ShowMore
                disable={this.state.fetching}
                onClick={this.loadSandboxes}
              >
                {this.state.fetching ? 'Loading Sandboxes...' : 'Show More'}
              </ShowMore>
            )}
          </PageContainer>
        </Container>
      </Layout>
    );
  }
}
