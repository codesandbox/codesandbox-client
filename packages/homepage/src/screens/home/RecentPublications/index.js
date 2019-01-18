import React from 'react';
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';

import MaxWidth from 'common/components/flex/MaxWidth';

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
        <MaxWidth width={1280}>
          <Title>Recent Publications</Title>
          <SubTitle>
            You can follow{' '}
            <a
              href="https://medium.com/@compuives/"
              target="_blank"
              rel="noreferrer noopener"
              style={{ textDecoration: 'none' }}
            >
              our blog
            </a>{' '}
            to stay up to date with new publications.
          </SubTitle>
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
