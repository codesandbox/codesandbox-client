import React from 'react';
import styled from 'styled-components';
import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import TitleAndMetaTags from '../components/TitleAndMetaTags';

import { Title } from '../templates/_feature.elements';
import { P } from '../components/Typography';

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

const FeaturesTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 190px 190px;
  font-style: normal;
  font-weight: 500;
  font-size: 23px;
  line-height: 27px;

  color: ${props => props.theme.homepage.white};
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #242424;
`;

const FeaturesTable = styled.ul`
  list-style: none;
  margin: 0;

  li {
    display: grid;
    grid-template-columns: 1fr 190px 190px;
    margin-bottom: 1rem;

    span {
      width: 100%;
      display: block;
      text-align: center;
      font-weight: 500;
      font-size: 23px;
      line-height: 27px;
    }
  }
`;

const FeatureTitle = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 23px;

  color: ${props => props.theme.homepage.white};
  text-align: left !important;
  padding-bottom: 0.25rem;
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
    <h3
      css={`
        font-weight: 500;
        font-size: 36px;
        line-height: 43px;

        color: ${props => props.theme.homepage.white};
        margin-bottom: 3.75rem;
        margin-top: 6rem;
      `}
    >
      Features
    </h3>
    <FeaturesTableHeader>
      <span>Development & Prototyping</span>
      <span
        css={`
          text-align: center;
        `}
      >
        Community
      </span>
      <span
        css={`
          text-align: center;
        `}
      >
        Pro
      </span>
    </FeaturesTableHeader>
    <FeaturesTable>
      <li>
        <div>
          <FeatureTitle>Templates</FeatureTitle>
          <P muted small>
            Start from an official template, or create your own
          </P>
        </div>
        <span>✓</span>
        <span>✓</span>
      </li>

      <li>
        <div>
          <FeatureTitle>Static File Hosting</FeatureTitle>
          <P muted small>
            All static files served via CDN
          </P>
        </div>
        <span>✓</span>
        <span>✓</span>
      </li>

      <li>
        <div>
          <FeatureTitle>Public Sandboxes</FeatureTitle>
          <P muted small>
            Sandboxes, both the preview and code, are available publicly by
            default
          </P>
        </div>
        <span>50</span>
        <span>Unlimited</span>
      </li>

      <li>
        <div>
          <FeatureTitle>Unlimited Private Sandboxes</FeatureTitle>
          <P muted small>
            Set a sandbox as private or unlisted so others can't see the code
          </P>
        </div>
        <span />
        <span>✓</span>
      </li>

      <li>
        <div>
          <FeatureTitle>Private GitHub Repos</FeatureTitle>
          <P muted small>
            Import and sync repos which are private on GitHub to CodeSandbox
          </P>
        </div>
        <span />
        <span>✓</span>
      </li>
    </FeaturesTable>
  </Layout>
);
