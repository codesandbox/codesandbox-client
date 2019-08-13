import React from 'react';
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';

import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';

import media from '../../../utils/media';

const Container = styled.div`
  background-color: ${({ theme }) => theme.background2};

  padding: 6rem 0;
`;

const Title = styled.h3`
  font-weight: 200;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 0.5rem;
  color: white;
`;

const SubTitle = styled.h4`
  font-weight: 200;
  font-size: 1.25rem;
  text-align: center;
  margin-bottom: 3.5rem;
  color: rgba(255, 255, 255, 0.8);
`;

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const Item = styled.a`
  transition: 0.3s ease transform;
  width: calc(33% - 2rem);

  margin: 0 1rem;
  text-decoration: none;

  color: rgba(255, 255, 255, 0.9);

  img {
    margin-bottom: 0.5rem;
  }

  ${media.phone`
    width: calc(100% - 2rem);
  `};

  &:hover {
    transform: translateY(-5px);
  }
`;

const PublicationTitle = styled.h4`
  font-weight: 400;
  font-size: 1.25rem;
  margin: 0.5rem 0;
`;

const PublicationDescription = styled.p`
  font-weight: 400;
  font-size: 1rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  opacity: 0.6;
`;

const Image = styled.div`
  height: 245px;
  width: 100%;
  background-image: url('${props => props.bg}');
    background-position: center center;
  background-size: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const PublicationItem = ({ title, image, url, description }) => (
  <Item href={url} target="_blank" rel="noopener noreferrer">
    <Image bg={image} aria-label={title} />
    <PublicationTitle>{title}</PublicationTitle>
    <PublicationDescription>{description}</PublicationDescription>
  </Item>
);

export default () => (
  <StaticQuery
    query={graphql`
      query {
        allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "/articles/" } }
          limit: 3
          sort: { order: DESC, fields: [frontmatter___date] }
        ) {
          edges {
            node {
              id
              html
              frontmatter {
                featuredImage {
                  publicURL
                }
                slug
                authors
                photo
                title
                description
                date
              }
            }
          }
        }
      }
    `}
    render={({ allMarkdownRemark }) => {
      const { edges } = allMarkdownRemark;
      const posts = edges
        .map(({ node }) => ({
          id: node.id,
          ...node.frontmatter,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      return (
        <Container>
          <MaxWidth width={1280}>
            <Title>Recent Publications</Title>
            <SubTitle>
              You can follow{' '}
              <a
                href="/blog"
                target="_blank"
                rel="noreferrer noopener"
                style={{ textDecoration: 'none' }}
              >
                our blog
              </a>{' '}
              to stay up to date with new publications.
            </SubTitle>
            <Items style={{ marginBottom: '2rem' }}>
              {posts.map(post => (
                <PublicationItem
                  key={post.id}
                  title={post.title}
                  description={post.description}
                  url={`/post/${post.slug}`}
                  image={post.featuredImage.publicURL}
                />
              ))}
            </Items>
          </MaxWidth>
        </Container>
      );
    }}
  />
);
