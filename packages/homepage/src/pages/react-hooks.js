import React from 'react';
import { graphql } from 'gatsby';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PageContainer from '../components/PageContainer';
import { Heading2 } from '../components/headings';
import Layout from '../components/layout';
import SandboxModal from '../screens/explore/SandboxModal';

import WideSandbox from '../screens/explore/WideSandbox';
import { Container, Sandboxes } from './_explore.elements';

export default class extends React.PureComponent {
  state = {
    sandboxes: this.props.data.allAirtable.edges.map(s => ({
      ...s.node.data,
      title: s.node.data.title,
    })),
  };

  openSandbox = index => {
    const sandbox = this.state.sandboxes[index];
    const { id, title, description } = sandbox;

    this.setState({
      selectedSandbox: {
        id,
        title,
        description,
        screenshotUrl: sandbox.screenshot_url,
      },
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

  getCurrentIndex = () =>
    this.state.selectedSandbox
      ? this.state.sandboxes.findIndex(
          s => this.state.selectedSandbox.id === s.id
        )
      : -1;

  render() {
    const { sandboxes, selectedSandbox } = this.state;

    const currentIndex = this.getCurrentIndex();

    return (
      <Layout>
        <Container>
          <TitleAndMetaTags
            description="A showcase of amazing uses for React Hooks!"
            title="React Hooks - CodeSandbox"
          />

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

          <PageContainer as="main" width={1440}>
            <Heading2 style={{ margin: '3rem 0' }}>
              React Hooks Sandboxes
            </Heading2>
            <Sandboxes>
              {sandboxes.map(sandbox => (
                <WideSandbox
                  key={sandbox.id}
                  pickSandbox={this.selectSandbox}
                  sandbox={sandbox}
                />
              ))}
            </Sandboxes>
          </PageContainer>
        </Container>
      </Layout>
    );
  }
}
export const query = graphql`
  {
    allAirtable {
      edges {
        node {
          data {
            id
            title
            description
            template
          }
        }
      }
    }
  }
`;
