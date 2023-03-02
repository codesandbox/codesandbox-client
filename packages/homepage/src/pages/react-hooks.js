import React from "react";
import WideSandbox from "@codesandbox/common/lib/components/WideSandbox";
import Margin from "@codesandbox/common/lib/components/spacing/Margin";

import sandboxes from "../assets/data/react-hooks-sandboxes.json";
import TitleAndMetaTags from "../components/TitleAndMetaTags";
import PageContainer from "../components/PageContainer";
import { Heading2 } from "../components/headings";

import Layout from "../components/layout";
import SandboxModal from "../screens/explore/SandboxModal";
import ShuffleWords from "./_shuffleWords";

import { Container, Sandboxes } from "./explore/_elements";

export default class extends React.PureComponent {
  state = {
    renderModal: false,
  };

  componentDidMount() {
    // We need to do this for SSR, the modal can't be rendered when using SSR,
    // we cannot just put a check in `render` because that would mean that client
    // render and server render are not the same. So we force a rerender.
    // eslint-disable-next-line
    this.setState({ renderModal: true });
  }

  openSandbox = (index) => {
    this.setState(() => {
      const sandbox = sandboxes[index];
      const { id, title, description } = sandbox;
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

  openPreviousSandbox = (currentIndex) => () => {
    this.openSandbox(currentIndex - 1);
  };

  openNextSandbox = (currentIndex) => () => {
    this.openSandbox(currentIndex + 1);
  };

  selectSandbox = ({ id, title, description, screenshotUrl }) => {
    this.setState({
      selectedSandbox: { id, title, description, screenshotUrl },
    });
  };

  getCurrentIndex = () =>
    this.state.selectedSandbox
      ? sandboxes.findIndex(
          sandbox => this.state.selectedSandbox.id === sandbox.id
        )
      : -1;

  closeModal = () => {
    this.setState({ selectedSandbox: undefined });
  };

  render() {
    const { selectedSandbox } = this.state;

    const currentIndex = this.getCurrentIndex();

    return (
      <Layout>
        <Container>
          <TitleAndMetaTags
            description="A showcase of the amazing uses for React Hooks!"
            title="React Hooks Community Examples - CodeSandbox"
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
                currentIndex < sandboxes.length - 1 &&
                currentIndex !== -1 &&
                this.openNextSandbox(currentIndex)
              }
            />
          )}

          <PageContainer as="main" width={1440}>
            <Heading2
              css={`
                text-align: center;
              `}
            >
              React Hooks Community Examples
            </Heading2>
            <ShuffleWords />
            <Sandboxes>
              {sandboxes.map((sandbox) => (
                <Margin key={sandbox.id} bottom={2}>
                  <WideSandbox
                    selectSandbox={this.selectSandbox}
                    sandbox={sandbox}
                  />
                </Margin>
              ))}
            </Sandboxes>
          </PageContainer>
        </Container>
      </Layout>
    );
  }
}
