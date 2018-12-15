import React from 'react';
import styled from 'styled-components';

import MaxWidth from 'common/components/flex/MaxWidth';

import firstImage from './unique.png';
import dashboardImage from './dashboard.png';
import secondImage from './containers3.png';

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
        <PublicationItem
          title="What's Unique About CodeSandbox"
          description={`I often get asked: "What's the difference between CodeSandbox and <another online editor>". This is a list of unique features that distinguishes CodeSandbox.`}
          url="https://medium.com/@compuives/whats-unique-about-codesandbox-f1791d867e48"
          image={firstImage}
        />
        <PublicationItem
          title="CodeSandbox Containers"
          description="With Containers we execute the code on a server. This allows you to create Node servers and run any kind of web application like Nuxt, Next and Gatsby."
          url="https://hackernoon.com/codesandbox-containers-5864a8f26715"
          image={secondImage}
        />
        <PublicationItem
          title="CodeSandbox Dashboard & Teams"
          description="Announcing Dashboard & Teams, you now have a dashboard to manage your sandboxes. With that you can now also share your sandboxes with your team."
          url="https://medium.com/@compuives/announcing-codesandbox-dashboard-teams-876f5933160b"
          image={dashboardImage}
        />
      </Items>
    </MaxWidth>
  </Container>
);
