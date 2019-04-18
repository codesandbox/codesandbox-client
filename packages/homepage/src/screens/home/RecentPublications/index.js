import React from 'react';
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';

import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';

import media from '../../../utils/media';

const Container = styled.div`
  margin: 160px 0;
`;

const Title = styled.h3`
  font-family: Poppins;
  font-weight: 500;
  font-size: 38px;
  margin-bottom: 24px;
  color: ${props => props.theme.lightText};
`;

const Items = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: space-around;
  grid-gap: 90px;

  ${media.tablet`
    grid-template-columns: repeat(2, 1fr);
  `};

  ${media.phone`
    grid-template-columns: repeat(1, 1fr);
  `};
`;

const Item = styled.a`
  transition: 0.3s ease transform;
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
  font-family: Poppins;
  font-weight: 500;
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
        allMediumPost(limit: 3, sort: { fields: [createdAt], order: DESC }) {
          edges {
            node {
              id
              title
              uniqueSlug
              virtuals {
                subtitle
                previewImage {
                  imageId
                }
              }
            }
          }
        }
      }
    `}
    render={({ allMediumPost: { edges } }) => (
      <Container>
        <MaxWidth width={1440}>
          <Title>Recent Publications</Title>
          <Items style={{ marginBottom: '2rem' }}>
            {edges.map(post => (
              <PublicationItem
                key={post.node.id}
                title={post.node.title}
                description={post.node.virtuals.subtitle}
                url={`https://medium.com/@compuives/${post.node.uniqueSlug}`}
                image={`https://cdn-images-1.medium.com/max/2000/${
                  post.node.virtuals.previewImage.imageId
                }`}
              />
            ))}
          </Items>
        </MaxWidth>
      </Container>
    )}
  />
);
