import React from 'react';
import styled from 'styled-components';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PageContainer from '../components/PageContainer';
import { Heading1 } from '../components/headings';

import media from '../utils/media';

const Container = styled.div`
  color: rgba(255, 255, 255, 0.9);
`;

const Changelog = styled.article`
  display: flex;

  margin-bottom: 2rem;

  ${media.phone`
    flex-direction: column;

    * {
      flex: 1;
    }
  `};
`;

const Info = styled.div`
  flex: 3;
  background-color: ${props => props.theme.background};
  padding: 1rem;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
`;

const ReleaseDate = styled.div`
  margin-top: 1.25rem;
  flex: 1;
  color: rgba(255, 255, 255, 0.7);

  ${media.phone`
    display: flex;
    align-items: center;

    p {
      margin-bottom: 0;
    }
  `};
`;

const ChangelogTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const Changelogs = styled.div`
  margin-top: 4rem;
`;

const Content = styled.div`
  *:last-child {
    margin-bottom: 0;
  }
`;

const GitHubUserContainer = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
`;

const GitHubUserImage = styled.img`
  width: 36px;
  height: 36px;
  max-height: 36px;
  max-width: 36px;
  border-radius: 2px;
  margin: 0;
  margin-right: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const OlderPosts = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 300;
`;

const Description = styled.p`
  margin-top: 1rem;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.4;
`;

const Anchor = styled.a`
  text-decoration: none;
  color: white;
`;

const GitHubUser = ({ username }) => (
  <GitHubUserContainer href={`https://github.com/${username}`}>
    <GitHubUserImage
      alt={username}
      src={`https://github.com/${username}.png?size=48`}
    />

    {username}
  </GitHubUserContainer>
);

// eslint-disable-next-line
export default class ChangelogPage extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;

    return (
      <Container>
        <TitleAndMetaTags title="CodeSandbox - Recent Updates" />
        <PageContainer width={1024}>
          <Heading1>Recent Updates</Heading1>
          <Description>
            This the list of recent updates to CodeSandbox. We only keep track
            of our notable updates here, for smaller updates you can check our{' '}
            <a href="https://github.com/CompuIves/codesandbox-client">
              GitHub repository
            </a>.
          </Description>
          <Changelogs>
            {posts.map(({ node: post }) => {
              const { frontmatter, fields, html } = post;

              return (
                <Changelog>
                  <ReleaseDate>
                    <p>{fields.date}</p>
                    <div>
                      {frontmatter.authors.map(username => (
                        <GitHubUser username={username} key={username} />
                      ))}
                    </div>
                  </ReleaseDate>

                  <Info>
                    <Anchor name={`#${fields.slug}`} href={`#${fields.slug}`}>
                      <ChangelogTitle id={fields.slug}>
                        {frontmatter.title}
                      </ChangelogTitle>
                    </Anchor>
                    <Content dangerouslySetInnerHTML={{ __html: html }} />
                  </Info>
                </Changelog>
              );
            })}
          </Changelogs>
          <OlderPosts>We keep track of updates since December 2017.</OlderPosts>
        </PageContainer>
      </Container>
    );
  }
}

export const pageQuery = graphql`
  query Changelogs {
    allMarkdownRemark(
      filter: { id: { regex: "/changelog/" } }
      sort: { fields: [fields___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            authors
          }
          fields {
            date(formatString: "MMMM DD, YYYY")
            slug
          }
          html
        }
      }
    }
  }
`;
