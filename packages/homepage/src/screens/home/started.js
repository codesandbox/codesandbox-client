import React from 'react';
import styled from 'styled-components';
import { P, H3, H5 } from '../../components/Typography';

import started from '../../assets/images/started.png';
import Tweet from '../../components/Tweet';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 642px;
  grid-gap: 30px;
`;

const Started = () => (
  <>
    <Grid css="">
      <div
        css={`
          position: relative;
        `}
      >
        <H3
          css={`
            margin-bottom: 1.5rem;
          `}
        >
          Get started in an instant
        </H3>
        <H5>Start from a template, or GitHub</H5>
        <P muted>React, Vue, Angular, whichever</P>
        <H5>Hot reload and auto-deploy</H5>
        <P muted>Your app is updated as you type</P>
        <H5>Live preview </H5>
        <P muted>See changes as you make them</P>
        <Tweet
          right
          tweet={{
            name: 'Peggy Rayzis',
            quote:
              "I'm obsessed with CodeSandbox's GitHub import feature!! 😍 One click and you can convert a repo to a sandbox that automatically stays up to date with the latest commits.",
            url:
              'https://twitter.com/peggyrayzis/status/976557689651236864?s=20',
            username: 'peggyrayzis',
            job: 'DX at Apollo',
          }}
        />
      </div>
      <img src={started} alt="started" />
    </Grid>
  </>
);

export default Started;
