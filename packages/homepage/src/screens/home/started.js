import React, { useRef, useEffect } from 'react';
import Rellax from 'rellax';
import styled from 'styled-components';
import { P, H3, H5 } from '../../components/Typography';

import started from '../../assets/images/started.png';
import Tweet from '../../components/Tweet';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 642px;
  grid-gap: 30px;

  ${props => props.theme.breakpoints.lg} {
    grid-template-columns: 1fr;
  }
`;

const Started = () => {
  const parallaxRef = useRef(null);
  useEffect(() => {
    // eslint-disable-next-line no-new
    new Rellax(parallaxRef.current, {
      speed: 1.2,
      center: true,
    });
  }, []);

  return (
    <>
      <Grid>
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
          <div ref={parallaxRef}>
            <Tweet
              style={`
             right: -6rem;
             left: auto;
             width: 30rem;
             margin-top: 2rem;
             min-height: 20rem;
             background: #242424
             max-width: 100%;

               ${props => props.theme.breakpoints.md} {
    grid-template-columns: 1fr;
  }

           `}
              tweet={{
                name: 'Peggy Rayzis',
                quote:
                  "I'm obsessed with CodeSandbox's GitHub import feature! One click and you can convert a repo to a sandbox that automatically stays up to date",
                url:
                  'https://twitter.com/peggyrayzis/status/976557689651236864?s=20',
                username: 'peggyrayzis',
                job: 'Engineering Manager, Apollo GraphQL',
              }}
            />
          </div>
        </div>

        <img
          src={started}
          css={`
            ${props => props.theme.breakpoints.lg} {
              display: none;
            }
          `}
          alt="started"
        />
      </Grid>
    </>
  );
};
export default Started;
