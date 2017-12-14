import React from 'react';
import styled from 'styled-components';

import MaxWidth from 'common/components/flex/MaxWidth';
import Column from 'common/components/flex/Column';
import Centered from 'common/components/flex/Centered';

import SearchIcon from 'react-icons/lib/md/search';

import NPMIcon from './NPMIcon';
import SearchInput from './SearchInput';
import EmbedAnimation from './EmbedAnimation';
import EmbedIcon from './EmbedIcon';

import media from '../../../utils/media';
import { Background, Heading, SubHeading } from '../../../components/style';

const FeatureHeading = styled.h4`
  color: white;
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 0.5rem;

  text-shadow: 0 1px 0px rgba(0, 0, 0, 0.3);
`;

const FeatureDescription = styled.p`
  color: #d3f2ff;
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.4;

  text-shadow: 0 1px 0px rgba(0, 0, 0, 0.3);
`;

const FeatureContainer = styled.div`
  display: flex;
  /* flex-direction: ${({ right }) => (right ? 'row-reverse' : 'row')}; */

  margin-bottom: 1rem;


  /* text-align: ${({ right }) => (right ? 'right' : 'left')}; */

  svg {
    margin-right: 1rem;

    min-width: 48px;
    height: 48px;
    color: #d3f2ff;

    text-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
  }
  ${media.phone`

    text-align: left;
    flex-direction: row;

    svg {
      height: 32px;
      min-width: 32px;
    }
  `};
`;

const ExtraSpacing = styled.div`
  margin: 0 2rem;

  ${media.phone`
    margin: 0;
  `};
`;
const FeatureRow = styled.div`
  display: flex;
  align-items: flex-start;

  flex-direction: row;

  ${media.phone`
    flex-direction: column-reverse;
  `};
`;

const Link = styled.a`
  color: white;
  font-weight: 600;

  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.secondary.lighten(0.2)()};
  }
`;

const FeatureMargin = styled.div`
  margin-top: 8rem;
  margin-bottom: 4rem;

  ${media.phone`
    margin-top: 4rem;
  `};
`;

const Feature = ({ right, title, Icon, iconSize, children }) => (
  <section>
    <FeatureContainer right={right} iconSize={iconSize}>
      <Icon />
      <div>
        <FeatureHeading>{title}</FeatureHeading>
        <FeatureDescription>{children}</FeatureDescription>
      </div>
    </FeatureContainer>
  </section>
);

export default () => (
  <Background>
    <MaxWidth width={1280}>
      <Centered horizontal>
        <Heading>Share in a single click</Heading>
        <SubHeading>
          Say goodbye to the days where you had to create a zip file just to
          share your code. Now you can copy the link and share away!
        </SubHeading>
      </Centered>

      <FeatureMargin>
        <FeatureRow>
          <Column flex={1} style={{ width: '100%' }}>
            <ExtraSpacing>
              <SearchInput />
            </ExtraSpacing>
          </Column>

          <Column flex={1}>
            <ExtraSpacing>
              <Feature Icon={NPMIcon} iconSize={42} title="NPM Support">
                Think of any npm dependency you want to use, we probably support
                it! You can install a new dependency within seconds. <br />
                <Link
                  href="https://hackernoon.com/how-we-make-npm-packages-work-in-the-browser-announcing-the-new-packager-6ce16aa4cee6"
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  Learn how it works.
                </Link>
              </Feature>

              <Feature Icon={SearchIcon} title="Search & Discovery">
                Want to know how a library works? You can easily browse through
                the{' '}
                <Link href="https://codesandbox.io/search" target="_blank">
                  80,000+ created sandboxes
                </Link>{' '}
                on CodeSandbox. We want this to be a platform where everyone can
                easily learn and share.
              </Feature>
            </ExtraSpacing>
          </Column>
        </FeatureRow>
      </FeatureMargin>

      <FeatureMargin>
        <FeatureRow alignItems="flex-start">
          <Column flex={1} style={{ width: '100%' }}>
            <ExtraSpacing>
              <Feature right Icon={EmbedIcon} iconSize={42} title="Embedding">
                We built a lightweight version of CodeSandbox for embeds, this
                allows you to embed your sandbox anywhere. Viewers can even play
                with the code in the embed, without leaving the website. We
                offer many customization options to make sure you can show the
                embed exactly the way you want.
              </Feature>
            </ExtraSpacing>
          </Column>

          <Column flex={1}>
            <ExtraSpacing>
              <EmbedAnimation />
            </ExtraSpacing>
          </Column>
        </FeatureRow>
      </FeatureMargin>
    </MaxWidth>
  </Background>
);
