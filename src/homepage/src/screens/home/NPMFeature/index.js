import React from 'react';
import styled from 'styled-components';

import theme from 'common/theme';

import MaxWidth from 'app/components/flex/MaxWidth';
import Row from 'app/components/flex/Row';
import Column from 'app/components/flex/Column';
import Centered from 'app/components/flex/Centered';
import Margin from 'app/components/spacing/Margin';

import SearchIcon from 'react-icons/lib/md/search';
import NPMIcon from './NPMIcon';

import media from '../../../utils/media';

import SearchInput from './SearchInput';

const Strobe = styled.div`
  height: 6px;
  width: 100%;

  background-image: linear-gradient(
    90deg,
    ${({ theme }) => theme.primary} 0%,
    ${({ theme }) => theme.primary.lighten(0.1)} 50%,
    ${({ theme }) => theme.primary} 100%
  );

  box-shadow: 0 -6px 40px ${({ theme }) => theme.primary.clearer(0.2)};
`;

const Heading = styled.h2`
  text-align: center;
  font-weight: 200;
  font-size: 2.5rem;
  margin-top: 3rem;
  margin-bottom: 1rem;

  text-transform: uppercase;

  color: ${({ theme }) => theme.primary};
  text-shadow: 0 0 100px ${({ theme }) => theme.primary.clearer(0.4)};
`;

const SubHeading = styled.p`
  font-size: 1.25rem;

  text-align: center;
  font-weight: 400;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);

  line-height: 1.4;
  max-width: 40rem;

  color: rgba(255, 255, 255, 0.8);
`;

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
  flex-direction: row;

  margin-bottom: 1rem;

  ${media.phone`
    margin-top: 2rem;
  `};

  text-align: ${({ right }) => (right ? 'right' : 'left')};

  svg {
    margin-${({ right }) => (right ? 'left' : 'right')}: 1rem;

    min-width: 38px;
    height: 38px;
    color: #d3f2ff;

    text-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
  }
`;

const Bg = styled.div`
  background-image: linear-gradient(
    45deg,
    ${theme.secondary.darken(0.1)()} 0%,
    ${theme.secondary.darken(0.3)()} 100%
  );
`;

const Rule = styled.hr`
  margin: 1rem 0;
  background-color: rgba(255, 255, 255, 0.4);
`;

const FeatureRow = styled.div`
  display: flex;
  align-items: flex-start;

  flex-direction: row;

  ${media.phone`
    flex-direction: column;
  `};
`;

const Link = styled.a`
  color: white;

  text-decoration: none;

  &:hover {
    color: ${theme.secondary.lighten(0.2)()};
  }
`;

const Feature = ({ right, title, Icon, iconSize, children }) => (
  <section>
    <FeatureContainer right={right} iconSize={iconSize}>
      {!right && <Icon />}
      <div>
        <FeatureHeading>{title}</FeatureHeading>
        <FeatureDescription>{children}</FeatureDescription>
      </div>
      {right && <Icon />}
    </FeatureContainer>
  </section>
);

export default class EditorFeatures extends React.Component {
  render() {
    return (
      <Bg>
        {/* <Strobe /> */}
        <MaxWidth width={1280}>
          <Centered horizontal>
            <Heading>Share in a single click</Heading>
            <SubHeading>
              Say goodbye to the days where you had to create a zip file just to
              share your code. Now you can copy the link and share away!
            </SubHeading>
          </Centered>

          <Margin top={8} bottom={4}>
            <FeatureRow>
              <Column flex={1}>
                <Margin right={2} left={2}>
                  <SearchInput />
                </Margin>
              </Column>

              <Column flex={1}>
                <Margin left={2} right={2}>
                  <Feature Icon={NPMIcon} iconSize={42} title="NPM Support">
                    Think of any npm dependency you want to use, we probably
                    support it! You can install a new dependency within seconds.{' '}
                    <br />
                    <Link
                      href="https://hackernoon.com/how-we-make-npm-packages-work-in-the-browser-announcing-the-new-packager-6ce16aa4cee6"
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      Learn how it works.
                    </Link>
                  </Feature>

                  <Feature Icon={SearchIcon} title="Search & Discovery">
                    Want to know how a library works? You can easily browse
                    through the{' '}
                    <Link href="https://codesandbox.io/search" target="_blank">
                      80,000+ created sandboxes
                    </Link>{' '}
                    on CodeSandbox. We want this to be a platform where everyone
                    can easily learn and share.
                  </Feature>
                </Margin>
              </Column>
            </FeatureRow>
          </Margin>

          <Margin top={8} bottom={4}>
            <FeatureRow alignItems="flex-start">
              <Column flex={1}>
                <Margin left={2} right={4}>
                  <Feature right Icon={NPMIcon} iconSize={42} title="Embedding">
                    Think of any npm dependency you want to use, we probably
                    support it! This is perfect if you ever want to try a
                    library first, or if you search for examples of a library.
                  </Feature>
                </Margin>
              </Column>

              <Column flex={1}>
                <Margin right={2} left={2}>
                  <SearchInput />
                </Margin>
              </Column>
            </FeatureRow>
          </Margin>
        </MaxWidth>
      </Bg>
    );
  }
}
