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
    selectedSandbox: 'oq25kr0y8y',
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

  selectSandbox = id => {
    this.setState({ selectedSandbox: id });
  };

  render() {
    const { selectedSandbox } = this.state;
    return (
      <Layout>
        <Container>
          <TitleAndMetaTags title="Explore - CodeSandbox" />
          {selectedSandbox && (
            <SandboxModal
              onClose={this.closeModal}
              sandboxId={selectedSandbox}
            />
          )}

          <PageContainer width={1440}>
            <FeaturedSandbox
              title="Material UI - Grid"
              description="Good implementation that highlights the use of using a Grid in Material UI."
              sandboxId={'oq25kr0y8y'}
            />

            <Heading2 style={{ margin: '3rem 0' }}>Picked Sandboxes</Heading2>
            <Sandboxes>
              {this.state.sandboxes.map(sandbox => (
                <WideSandbox
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
