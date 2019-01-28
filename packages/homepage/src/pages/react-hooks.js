import React from 'react';
import { graphql } from 'gatsby';

import { protocolAndHost, sandboxUrl } from 'common/utils/url-generator';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PageContainer from '../components/PageContainer';
import { Heading2 } from '../components/headings';
import Layout from '../components/layout';

import WideSandbox from '../screens/explore/WideSandbox';
import { Container, Sandboxes } from './_explore.elements';

export default class extends React.PureComponent {
  state = {
    starters: this.props.data.allAirtable.edges.map(s => ({
      ...s.node.data,
      title: s.node.data.title,
    })),
  };

  loadSandboxes = async id => {
    const s = await fetch(`${protocolAndHost()}/api/v1/sandboxes/${id}`);
    const json = await s.json();
    return json.data;
  };

  render() {
    const { starters } = this.state;

    return (
      <Layout>
        <Container>
          <TitleAndMetaTags
            description="A showcase of amazing uses for React Hooks!"
            title="React Hooks - CodeSandbox"
          />
          <PageContainer as="main" width={1440}>
            <Heading2 style={{ margin: '3rem 0' }}>
              React Hooks Sandboxes
            </Heading2>
            <Sandboxes>
              {starters.map(sandbox => (
                <WideSandbox
                  key={sandbox.id}
                  pickSandbox={({ id }) => {
                    const url = sandboxUrl({ id });
                    return window.open(url, '_blank');
                  }}
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
