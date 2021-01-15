import React, { useState } from 'react';

import { motion } from 'framer-motion';
import Layout from '../../components/layout';
import PageContainer from '../../components/PageContainer';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import Switch from '../../components/Switch';
import { P } from '../../components/Typography';
import {
  Plan,
  PlanName,
  FeaturesTableHeader,
  FeaturesTable,
  FeatureTitle,
  TableWrapper,
  ProductChooser,
} from './_elements';
import { personal } from './data/_personal';
import Cards from './_cards';
import { OpenIcon, Save } from './_icons';

import { Title } from '../../components/LayoutComponents';

export default () => {
  const [open, setOpen] = useState({});
  const [mode, setMode] = useState('monthly');
  const [product, setProduct] = useState('team');

  const toggleTable = name => {
    setOpen(o => ({ ...o, [name]: !o[name] }));
  };

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
      <ProductChooser>
        <button
          type="button"
          aria-pressed={product === 'personal'}
          onClick={() => setProduct('personal')}
        >
          For Individuals
        </button>
        <button
          type="button"
          aria-pressed={product === 'team'}
          onClick={() => setProduct('team')}
        >
          For Businesses
        </button>
      </ProductChooser>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          font-weight: bold;
          font-size: 12px;
          margin-bottom: 75px;
        `}
      >
        <span>Bill monthly</span>
        <Switch
          on={mode === 'annually'}
          onClick={() =>
            setMode(m => (m === 'annually' ? 'monthly' : 'annually'))
          }
        />
        <span>Bill annually</span>
        <Save />
      </div>
      <Cards team={product === 'team'} mode={mode} />
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
      <div
        css={`
          margin-bottom: 128px;
        `}
      >
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
      </div>
    </Layout>
  );
};
