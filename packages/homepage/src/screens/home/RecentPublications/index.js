import React from 'react';
import styled from 'styled-components';

import MaxWidth from 'common/components/flex/MaxWidth';

import codesandbox2Image from './1-codesandbox2.png';
import zeitTalkImage from './2-zeit-talk.jpg';
import npmArticleImage from './3-npm-article.png';

import media from '../../../utils/media';

const Container = styled.div`
  background-color: ${({ theme }) => theme.background2};

  padding: 6rem 0;
`;

const Title = styled.h3`
  font-weight: 200;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 3rem;
  color: white;
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
`;

const PublicationItem = ({ title, image, url, description }) => (
  <Item href={url} target="_blank" rel="noopener noreferrer">
    <img
      style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}
      src={image}
      alt={title}
    />
    <PublicationTitle>{title}</PublicationTitle>
    <PublicationDescription>{description}</PublicationDescription>
  </Item>
);

export default () => (
  <Container>
    <MaxWidth width={1280}>
      <Title>Recent Publications</Title>

      <Items>
        <PublicationItem
          title="CodeSandbox 2.0"
          description="Announcing CodeSandbox 2.0. With GitHub commiting, a new homepage and support for static files."
          url="https://medium.com/@compuives/announcing-codesandbox-2-0-938cff3a0fcb"
          image={codesandbox2Image}
        />
        <PublicationItem
          title="The Journey of CodeSandbox"
          description="Ives explains how CodeSandbox came to be, how it works and what the future holds."
          url="https://www.youtube.com/watch?v=5lR29NsJKW8"
          image={zeitTalkImage}
        />
        <PublicationItem
          title="NPM in the browser"
          description="What we have done to make npm work in the browser, and what we will do in the future."
          url="https://hackernoon.com/how-we-make-npm-packages-work-in-the-browser-announcing-the-new-packager-6ce16aa4cee6"
          image={npmArticleImage}
        />
      </Items>
    </MaxWidth>
  </Container>
);
