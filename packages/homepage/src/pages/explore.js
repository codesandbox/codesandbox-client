import React from 'react';
import styled from 'styled-components';
import Preview from 'app/src/app/components/Preview';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PageContainer from '../components/PageContainer';
import { Heading2 } from '../components/headings';

import WideSandbox from '../screens/explore/WideSandbox';

const Container = styled.div`
  color: rgba(255, 255, 255, 0.9);

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
    sandbox: undefined,
  };

  componentDidMount() {
    fetch('http://localhost:3000/api/v1/sandboxes/new')
      .then(x => x.json)
      .then(x => {
        this.setState({ sandbox: x });
      });

    fetch('http://localhost:3000/api/v1/sandboxes/picked')
      .then(x => x.json())
      .then(data => {
        console.log(data.sandboxes.map(s => s.picks[0].inserted_at));
        this.setState({ sandboxes: data.sandboxes });
      });
  }

  render() {
    return (
      <Container>
        <TitleAndMetaTags title="Explore - CodeSandbox" />

        <PageContainer>
          <div
            style={{
              width: '100%',
              display: 'flex',
              marginBottom: '2rem',
              height: 400,
              backgroundColor: '#40A9F3',
              borderRadius: 4,
            }}
          >
            <div style={{ width: '100%', flex: 1 }} />
            {this.state.sandbox && <Preview sandbox={this.state.sandbox} />}
          </div>

          <Heading2 style={{ marginBottom: '2rem' }}>Picked Sandboxes</Heading2>
          <Sandboxes>
            {this.state.sandboxes.map(sandbox => (
              <WideSandbox sandbox={sandbox} />
            ))}
          </Sandboxes>
        </PageContainer>
      </Container>
    );
  }
}
