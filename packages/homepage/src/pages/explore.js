import React from 'react';
import styled from 'styled-components';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PageContainer from '../components/PageContainer';
import { Heading2 } from '../components/headings';
import Layout from '../components/layout';

import WideSandbox from '../screens/explore/WideSandbox';
import FeaturedSandbox from '../screens/explore/FeaturedSandbox';
import SandboxModal from '../screens/explore/SandboxModal';

const Container = styled.div`
  color: ${props => props.theme.new.title}

  margin-bottom: 4rem;
`;

const Sandboxes = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export default class Explore extends React.PureComponent {
  state = {
    sandboxes: [],
    selectedSandbox: undefined,
  };

  componentDidMount() {
    fetch('http://localhost:3000/api/v1/sandboxes/picked')
      .then(x => x.json())
      .then(data => {
        this.setState({ sandboxes: data.sandboxes });
      });
  }

  closeModal = () => {
    this.setState({ selectedSandbox: undefined });
  };

  openSandbox = index => {
    const sandbox = this.state.sandboxes[index];
    const { id, picks } = sandbox;
    const title = picks[0].title;
    const description = picks[0].description;
    this.setState({
      selectedSandbox: {
        id,
        title,
        description,
      },
    });
  };

  selectSandbox = ({ id, title, description }) => {
    this.setState({ selectedSandbox: { id, title, description } });
  };

  openPreviousSandbox = currentIndex => () => {
    this.openSandbox(currentIndex - 1);
  };

  openNextSandbox = currentIndex => () => {
    this.openSandbox(currentIndex + 1);
  };

  getCurrentIndex = () =>
    this.state.selectedSandbox
      ? this.state.sandboxes.findIndex(
          s => this.state.selectedSandbox.id === s.id
        )
      : -1;

  render() {
    const { selectedSandbox } = this.state;

    const currentIndex = this.getCurrentIndex();

    return (
      <Layout>
        <Container>
          <TitleAndMetaTags title="Explore - CodeSandbox" />

          <SandboxModal
            onClose={this.closeModal}
            sandboxId={selectedSandbox && selectedSandbox.id}
            title={selectedSandbox && selectedSandbox.title}
            description={selectedSandbox && selectedSandbox.description}
            openPreviousSandbox={
              currentIndex > 0 && this.openPreviousSandbox(currentIndex)
            }
            openNextSandbox={
              currentIndex < this.state.sandboxes.length - 1 &&
              this.openNextSandbox(currentIndex)
            }
          />

          <PageContainer width={1440}>
            <FeaturedSandbox
              title="Material UI - Grid"
              description="Good implementation that highlights the use of using a Grid in Material UI."
              sandboxId={'q75m7wn514'}
            />

            <Heading2 style={{ margin: '3rem 0' }}>Picked Sandboxes</Heading2>
            <Sandboxes>
              {this.state.sandboxes.length !== 0
                ? this.state.sandboxes.map(sandbox => (
                    <WideSandbox
                      pickSandbox={this.selectSandbox}
                      sandbox={sandbox}
                    />
                  ))
                : new Array(16)
                    .fill(undefined)
                    .map(
                      (_, i) => console.log('hello') || <WideSandbox key={i} />
                    )}
            </Sandboxes>
          </PageContainer>
        </Container>
      </Layout>
    );
  }
}
