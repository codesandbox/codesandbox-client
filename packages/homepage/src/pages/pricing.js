import React from 'react';
import styled from 'styled-components';
import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import TitleAndMetaTags from '../components/TitleAndMetaTags';

import { Title } from '../templates/_feature.elements';

const Card = styled.div`
  width: 100%;
  height: 544px;

  background: ${props => (props.dark ? '#151515' : '#0971F1')};
  border-radius: 4px;
  padding: 2.5rem;
  text-align: center;
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardTitle = styled.h3`
  font-style: normal;
  font-weight: 500;
  font-size: 23px;
  color: ${props => props.theme.homepage.white};
`;

const Price = styled.h6`
  font-weight: 500;
  font-size: 36px;
  line-height: 43px;
  text-align: center;

  color: ${props => props.theme.homepage.white};
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  font-style: normal;
  font-size: 23px;
  line-height: 27px;
  text-align: center;
  color: ${props => props.theme.homepage.muted};
  margin-top: 3rem;
`;

const Button = styled.a`
  height: 44px;
  text-decoration: none;
  background: ${props => props.theme.homepage.grey};
  border-radius: 2px;
  font-weight: 500;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.homepage.white};

  ${props =>
    props.white &&
    `
    background: ${props.theme.homepage.white};
    color: ${props.theme.homepage.blue};
  `}
`;

export default () => (
  <Layout>
    <TitleAndMetaTags title="Pricing - CodeSandbox" />
    <PageContainer width={1086}>
      <Title textCenter>Pricing</Title>
    </PageContainer>
    <div
      css={`
        display: grid;
        grid-template-columns: 26rem 26rem;
        grid-gap: 2rem;
        justify-content: center;

        ${props => props.theme.breakpoints.lg} {
          grid-template-columns: 26rem;
        }
      `}
    >
      <Card dark>
        <div>
          <CardTitle>Community</CardTitle>
          <Price>Free</Price>
          <List>
            <li>✓ Development & Prototyping</li> <li>✓ Online IDE </li>
            <li>✓ Embeds </li>
            <li>✓ CodeSandbox CI </li>
            <li>✓ Teams</li>
          </List>
        </div>
        <Button href="/s">Create Sandbox, it’s free </Button>
      </Card>
      <Card>
        <div>
          <CardTitle>Pro</CardTitle>
          <Price>From $5/month</Price>
          <List
            css={`
              color: white;
            `}
          >
            <li
              css={`
                margin-bottom: 1rem;
              `}
            >
              Everything in Community, plus:
            </li>
            <li>+ Unlimited Private Sandboxes </li>
            <li>+ Private GitHub Repos</li>
          </List>
        </div>
        <Button white href="/patreon">
          Subscribe to Pro
        </Button>
      </Card>
    </div>
  </Layout>
);
