import React from 'react';
import styled from 'styled-components';
import { H2, P } from '../../components/Typography';

import code from '../../assets/images/code.png';
import bug from '../../assets/images/bug.png';
import share from '../../assets/images/share.png';
import Tweet from '../../components/Tweet';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 416px 1fr;
  grid-gap: 2.5rem;
  position: relative;
`;

const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 300px);
  grid-gap: 2rem;
  margin-top: 6.5rem;
  position: relative;
  z-index: 2;
  margin-left: 200px;
`;

const White = styled.span`
  color: white;
`;

const Share = () => (
  <>
    <Grid>
      <div>
        <Tweet
          style={`
          right: auto;
          left: auto;
          width: 416px;
          margin-top: 0;
          height: 412px;
          position: absolute;
        `}
          tweet={{
            username: 'brian_d_vaughn',
            job: 'Software Engineer, React Core Team',
            name: 'Brian Vaughn',
            quote:
              "It's dramatically improved my experience of sharing ideas and responding to online questions",
            url:
              'https://twitter.com/brian_d_vaughn/status/987758237104594945?s=20',
          }}
        />
      </div>
      <div>
        <H2>Share with a Click</H2>
        <P
          muted
          css={`
            margin-bottom: 2rem;
          `}
        >
          Every sandbox gets a secure URL, ready to share
        </P>
        <P muted>
          <White>Share code snippets and creations </White> with friends,
          colleagues, the world
        </P>
        <P muted>
          <White>Provide reproducible bug reports</White> when creating GitHub
          issues
        </P>
        <P muted>
          <White>Ask or answer questions with code</White> on Stack Overflow or
          Twitter
        </P>
      </div>
    </Grid>
    <Section>
      <img src={share} alt="Share" />
      <img src={code} alt="Speak Code" />
      <img src={bug} alt="Track Bugs" />
    </Section>
  </>
);

export default Share;
