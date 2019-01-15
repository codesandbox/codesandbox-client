import React from 'react';

import getTemplate from 'common/templates';
import { protocolAndHost } from 'common/utils/url-generator';
import { ARROW_LEFT, ARROW_RIGHT } from 'common/utils/keycodes';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PageContainer from '../components/PageContainer';
import { Heading2 } from '../components/headings';
import Layout from '../components/layout';

import WideSandbox from '../screens/explore/WideSandbox';
import FeaturedSandbox from '../screens/explore/FeaturedSandbox';
import SandboxModal from '../screens/explore/SandboxModal';
import featuredSandboxes from '../utils/featuredSandboxes';
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
} from './_explore.elements';

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
    const sandbox = this.state.sandboxes[index];
    const { id, picks } = sandbox;
    const { title, description } = picks[0];
    this.setState({
      selectedSandbox: {
        id,
        title,
        description,
        screenshotUrl: sandbox.screenshot_url,
      },
    });
  };

  selectSandbox = ({ id, title, description, screenshotUrl }) => {
    this.setState({
      selectedSandbox: { id, title, description, screenshotUrl },
    });
  };

  openPreviousSandbox = currentIndex => () => {
    this.openSandbox(currentIndex - 1);
  };

  openNextSandbox = currentIndex => () => {
    this.openSandbox(currentIndex + 1);
  };

  navigateToNextSandbox = () => {
    this.setState(state => ({
      featuredSandboxIndex: state.featuredSandboxIndex + 1,
    }));
  };

  navigateToPreviousSandbox = () => {
    this.setState(state => ({
      featuredSandboxIndex: state.featuredSandboxIndex - 1,
    }));
  };

  handleKeyPress = ({ keyCode }) => {
    const { featuredSandboxIndex } = this.state;
    switch (keyCode) {
      case ARROW_LEFT:
        if (featuredSandboxIndex === 0) return;
        this.navigateToPreviousSandbox();
        break;
      case ARROW_RIGHT:
        if (featuredSandboxIndex === featuredSandboxes.length - 1) return;
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
                        aria-label={sandbox.title || sandbox.id}
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
                    <WideSandbox
                      // We force i here so we reuse the existing components
                      // eslint-disable-next-line react/no-array-index-key,no-console
                      key={i}
                      pickSandbox={this.selectSandbox}
                      sandbox={sandbox}
                    />
                  ))
                : new Array(16).fill(undefined).map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key,no-console
                    <WideSandbox key={i} />
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
