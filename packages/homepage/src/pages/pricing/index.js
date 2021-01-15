import React, { useState } from 'react';

import { motion } from 'framer-motion';
import Layout from '../../components/layout';
import PageContainer from '../../components/PageContainer';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import { P } from '../../components/Typography';
import {
  Card,
  CardTitle,
  Price,
  PriceSubText,
  Plan,
  PlanName,
  List,
  Button,
  FeaturesTableHeader,
  FeaturesTable,
  FeatureTitle,
  CardContainer,
  TeamOrIndividualWrapper,
  TableWrapper,
} from './_elements';
import { personal } from './data';

import { Title } from '../../components/LayoutComponents';

export default () => {
  const [open, setOpen] = useState({});

  const toggleTable = name => {
    setOpen(o => ({ ...o, [name]: !o[name] }));
  };

  const OpenIcon = ({ open: openTable }) => (
    <motion.svg
      initial={{ transform: 'rotate(90deg)' }}
      animate={{ transform: `rotate(${openTable ? 0 : 90}deg)` }}
      width="13"
      height="10"
      viewBox="0 0 13 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.03394 9.16661C6.7723 9.5296 6.19871 9.51329 5.96082 9.13608L0.99817 1.26742C0.746349 0.868135 1.0519 0.362543 1.54503 0.362543L6.47188 0.362544L12.1793 0.362544C12.6897 0.362544 12.9922 0.900233 12.7055 1.29794L7.03394 9.16661Z"
        fill="white"
      />
    </motion.svg>
  );

  return (
    <Layout>
      <TitleAndMetaTags title="Pricing - CodeSandbox" />
      <PageContainer width={1086}>
        <Title
          css={`
            font-size: 64px;
            max-width: 802px;
            margin: auto;
            line-height: 76px;
            margin-bottom: 76px;
            margin-top: 40px;
          `}
        >
          Choose a plan that's right for you
        </Title>
      </PageContainer>
      <TeamOrIndividualWrapper>
        <div>For individuals</div>
        <div />
        <div>For teams & businesses</div>
      </TeamOrIndividualWrapper>
      <CardContainer>
        <Card dark>
          <div>
            <CardTitle>Community</CardTitle>
            <Price
              css={`
                min-height: 72px;
              `}
            >
              Free
            </Price>
            <List>
              <li>
                <span>✓</span> Development & Prototyping
              </li>{' '}
              <li>
                <span>✓</span> Online IDE{' '}
              </li>
              <li>
                <span>✓</span> Embeds{' '}
              </li>
              <li>
                <span>✓</span> CodeSandbox CI{' '}
              </li>
              <li>
                <span>✓</span> Teams
              </li>
            </List>
          </div>
          <Button href="/s">Create Sandbox, it’s free </Button>
        </Card>
        <Card>
          <div>
            <CardTitle>Pro</CardTitle>
            <div style={{ minHeight: 72 }}>
              <Price style={{ marginBottom: '0.5rem' }}>$9/Month</Price>
              <PriceSubText>billed annually or $12 month-to-month</PriceSubText>
            </div>
            <List
              css={`
                color: white;
              `}
            >
              <li
                css={`
                  margin-bottom: 2rem;
                `}
              >
                Everything in Community, plus:
              </li>
              <li>+ Unlimited Private Sandboxes </li>
              <li>+ Private GitHub Repos</li>
            </List>
          </div>
          <Button white href="/pro">
            Subscribe to Pro
          </Button>
        </Card>
        <Card
          css={`
            background: #5962df;
          `}
        >
          <div>
            <CardTitle>Pro Workspaces</CardTitle>
            <Price
              css={`
                min-height: 72px;
              `}
            >
              Join the waitlist
            </Price>
            <List
              as="section"
              css={`
                color: white;
                font-size: 16px;
                margin: 0 auto;
                ${props => props.theme.breakpoints.xl} {
                  max-width: 298px;
                  text-align: center;
                }
              `}
            >
              Prototype, interview, and collaborate on code with your entire
              team.
              <br />
              <br />
              Manage and work on sandboxes collectively — get feedback, or code
              together.
              <br />
              <br />
              Currently in closed beta.
            </List>
          </div>
          <Button
            white
            href="https://airtable.com/shrlgLSJWiX8rYqyG"
            css={{
              color: '#5962df',
            }}
          >
            Get early access
          </Button>
        </Card>
      </CardContainer>

      <Title
        as="h2"
        css={`
          font-size: 33px;
          margin-top: 70px;
          margin-bottom: 48px;
          text-align: left;
        `}
      >
        Compare plans & features
      </Title>
      {personal.items.map(item => (
        <TableWrapper>
          <FeaturesTableHeader
            onClick={() => toggleTable(item.name)}
            css={`
              margin-top: 0;
            `}
          >
            <span>{item.name}</span>
            <OpenIcon open={open[item.name]} />
          </FeaturesTableHeader>
          <FeaturesTable
            as={motion.div}
            initial={{ height: 0 }}
            animate={{ height: `${open[item.name] ? 'auto' : 0}` }}
            open={open[item.name]}
          >
            <Plan as="div">
              <span />
              {personal.plans.map(plan => (
                <PlanName paid={!plan.free}>{plan.name}</PlanName>
              ))}
            </Plan>
            {item.features.map(feature => (
              <li>
                <div>
                  <FeatureTitle>{feature.name}</FeatureTitle>
                  <P muted small>
                    {feature.desc}
                  </P>
                </div>
                {feature.available.map(available => {
                  if (typeof available === 'string') {
                    return <span className="text">{available}</span>;
                  }

                  return <span>{available ? '✓' : ''}</span>;
                })}
              </li>
            ))}
          </FeaturesTable>
        </TableWrapper>
      ))}
    </Layout>
  );
};
