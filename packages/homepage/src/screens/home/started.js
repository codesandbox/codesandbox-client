import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';
import { P, H3, H5 } from '../../components/Typography';

import started from '../../assets/images/started.png';
import Tweet from '../../components/Tweet';

const isBrowser = typeof window !== `undefined`;

function getScrollPosition() {
  return isBrowser
    ? { x: window.pageXOffset, y: window.pageYOffset }
    : { x: 0, y: 0 };
}

export function useScrollPosition() {
  const [position, setScrollPosition] = useState(getScrollPosition());

  useEffect(() => {
    let requestRunning;
    function handleScroll() {
      if (isBrowser && requestRunning === null) {
        requestRunning = window.requestAnimationFrame(() => {
          setScrollPosition(getScrollPosition());
          requestRunning = null;
        });
      }
    }

    if (isBrowser) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [setScrollPosition]);

  return position;
}

export function useScrollXPosition() {
  const { x } = useScrollPosition();
  return x;
}

export function useScrollYPosition() {
  const { y } = useScrollPosition();
  return y;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 642px;
  grid-gap: 30px;

  ${props => props.theme.breakpoints.md} {
    grid-template-columns: 1fr;
  }
`;

const Started = () => {
  const scrollY = useScrollYPosition();

  return (
    <>
      {console.log(scrollY)}
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
          <div>
            <Tweet
              style={`
             right: -6rem;
             left: auto;
             width: 30rem;
             margin-top: 2rem;
             min-height: 20rem;
             background: #242424
             max-width: 100%;

           `}
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
        </div>

        <img src={started} alt="started" />
      </Grid>
    </>
  );
};

export default Started;
