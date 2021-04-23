/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { motion } from 'framer-motion';
import Layout from '../../components/layout';
import PageContainer from '../../components/PageContainer';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import Switch from '../../components/Switch';
import { P } from '../../components/Typography';
import { Title } from '../../components/LayoutComponents';
import {
  Plan,
  PlanName,
  FeaturesTableHeader,
  FeaturesTable,
  FeatureTitle,
  TableWrapper,
  ModeChooser,
  ProductChooser,
  TableSection,
} from './_elements';
import { personal } from './data/_personal';
import { business } from './data/_business';
import Cards from './_cards';
import { OpenIcon, SavePersonal, SaveTeam } from './_icons';

export default () => {
  const [open, setOpen] = useState({});
  const [mode, setMode] = useState('annually');
  const [product, setProduct] = useState();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setProduct(urlParams.get('for') === 'individual' ? 'personal' : 'team');
  }, []);

  useEffect(() => {
    const array = product === 'personal' ? personal : business;
    const opened = {};

    array.defaultOpen.forEach(item => {
      opened[item] = true;
    });

    setOpen(opened);
  }, [product]);

  const toggleTable = name => {
    if (!open[name]) {
      track('Plan detail opened', {
        category: name,
        tab: product === 'personal' ? 'Individual' : 'Business',
      });
    }
    setOpen(o => ({ ...o, [name]: !o[name] }));
  };

  const array = product === 'personal' ? personal : business;

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
      <ModeChooser>
        <span>Bill monthly</span>
        <Switch
          on={mode === 'annually'}
          onClick={() =>
            setMode(m => (m === 'annually' ? 'monthly' : 'annually'))
          }
        />
        <span>Bill annually</span>
        {product === 'team' ? <SaveTeam /> : <SavePersonal />}
      </ModeChooser>
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
      <TableSection>
        {array.items.map(item => (
          <TableWrapper>
            <FeaturesTableHeader
              team={product === 'team'}
              onClick={() => toggleTable(item.name)}
              css={`
                margin-top: 0;
              `}
            >
              <span>{item.name}</span>
              <OpenIcon open={open[item.name]} />
            </FeaturesTableHeader>
            <FeaturesTable
              team={product === 'team'}
              as={motion.div}
              initial={{ height: 0 }}
              animate={{ height: `${open[item.name] ? 'auto' : 0}` }}
              open={open[item.name]}
            >
              <Plan as="div" team={product === 'team'}>
                <span />
                {array.plans.map(plan => (
                  <PlanName style={{ color: plan.color }} paid={!plan.free}>
                    {plan.name}
                  </PlanName>
                ))}
              </Plan>
              {item.features.map(feature => {
                if (feature.subheading) {
                  return (
                    <>
                      <li
                        css={`
                          grid-template-columns: 1fr;
                        `}
                      >
                        {' '}
                        <FeatureTitle>{feature.subheading}</FeatureTitle>
                      </li>
                      {feature.features.map(fea => (
                        <li>
                          <div>
                            <FeatureTitle>{fea.name}</FeatureTitle>
                            <P muted small>
                              {fea.desc}
                            </P>{' '}
                          </div>
                          <Checks feature={fea} product={product} />
                        </li>
                      ))}
                    </>
                  );
                }
                return (
                  <li>
                    <div>
                      <FeatureTitle>{feature.name}</FeatureTitle>
                      <P muted small>
                        {feature.desc}
                      </P>
                    </div>
                    <Checks feature={feature} product={product} />
                  </li>
                );
              })}
            </FeaturesTable>
          </TableWrapper>
        ))}
      </TableSection>
    </Layout>
  );
};

const Checks = ({ feature, product }) => {
  if (typeof feature.available === 'boolean') {
    return product === 'team' ? (
      <>
        <span>✓</span>
        <span>✓</span>
        <span>✓</span>
      </>
    ) : (
      <>
        <span>✓</span>
        <span>✓</span>
      </>
    );
  }

  return feature.available.map(available => {
    if (typeof available === 'string') {
      return <span className="text">{available}</span>;
    }

    return <span>{available ? '✓' : ''}</span>;
  });
};
