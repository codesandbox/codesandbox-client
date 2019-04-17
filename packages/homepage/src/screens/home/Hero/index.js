import React from 'react';
import styled from 'styled-components';

import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Logo from '@codesandbox/common/lib/components/Logo';
import { Button } from '@codesandbox/common/lib/components/Button';
import media from '../../../utils/media';

const Container = styled.div`
  margin-top: 100px;
  padding: 6rem 0;
`;

const Title = styled.h3`
  padding-top: 50px;
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 64px;
  color: ${props => props.theme.secondary};

  ${media.phone`
    font-size: 48px;
  `};

  span {
    color: white;
  }
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 200px;
`;

const TagLine = styled.h4`
  margin: 48px 0;
  font-family: Open Sans;
  font-size: 32px;

  color: ${props => props.theme.lightText};
`;

export default () => (
  <Container>
    <MaxWidth width={1440}>
      <Hero>
        <div>
          <Title>
            Code<span>Sandbox</span>
          </Title>
          <TagLine>
            Code, prototype, collaborate & share all in the browser.
          </TagLine>
          <Button
            style={{ display: 'inline-block', width: 160, marginRight: 24 }}
            href="/s"
            small
          >
            Create Sandbox
          </Button>
          <Button
            style={{ display: 'inline-block', width: 160 }}
            secondary
            href="/explore"
            small
          >
            Explore
          </Button>
        </div>
        <Logo
          width={323}
          height={371}
          css={`
            max-width: 100%;

            @media screen and (max-width: 900px) {
              display: none;
            }
          `}
        />
      </Hero>
    </MaxWidth>
  </Container>
);
