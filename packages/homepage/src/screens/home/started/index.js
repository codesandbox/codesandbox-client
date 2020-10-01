import React, { useRef, useEffect } from 'react';

import { P, H5 } from '../../../components/Typography';

import started from '../../../assets/images/started.png';
import Tweet from '../../../components/Tweet';

import { Grid, Wrapper, tweetStyle, Img, Title } from './elements';
import { applyParallax } from '../../../utils/parallax';

const tweet = {
  name: 'Peggy Rayzis',
  quote:
    "I'm obsessed with CodeSandbox's GitHub import feature! One click and you can convert a repo to a sandbox that automatically stays up to date.",
  url: 'https://twitter.com/peggyrayzis/status/976557689651236864?s=20',
  username: 'peggyrayzis',
  job: 'Engineering Manager, Apollo GraphQL',
};

const Started = () => {
  const parallaxRef = useRef(null);
  useEffect(() => {
    applyParallax(parallaxRef.current, {
      speed: 1.2,
      center: true,
    });
  }, [parallaxRef]);

  return (
    <Grid>
        <Wrapper>
          <Title>Get started in an instant</Title>
          <H5>Start from a template, or GitHub</H5>
          <P muted>React, Vue, Angular, whichever.</P>
          <H5>Hot reload and auto-deploy</H5>
          <P muted>Your app is updated as you type.</P>
          <H5>Live preview </H5>
          <P muted>See changes as you make them.</P>
          <div ref={parallaxRef}>
            <Tweet style={tweetStyle} tweet={tweet} />
          </div>
        </Wrapper>

        <Img src={started} alt="started" />
      </Grid>
  );
};
export default Started;
