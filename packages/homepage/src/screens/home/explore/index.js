import React from 'react';
import Button from '../../../components/Button';
import { H2, P } from '../../../components/Typography';
import SandboxCount from '../../../components/SandboxCount';
import one from '../../../assets/images/explore/1.png';
import two from '../../../assets/images/explore/2.png';
import three from '../../../assets/images/explore/3.png';

import six from '../../../assets/images/explore/6.png';
import seven from '../../../assets/images/explore/7.png';
import eight from '../../../assets/images/explore/8.png';

import ten from '../../../assets/images/explore/10.png';

// import four from '../../../assets/images/explore/4.png';
// import five from '../../../assets/images/explore/5.png';
// import nine from '../../../assets/images/explore/9.png';

import { ImageWrapper, StylessButton, Container } from './elements';
import { WRAPPER_STYLING } from '../../../components/layout';

const Sandbox = ({ id, image }) => (
  <StylessButton href={`https://codesandbox.io/s/${id}`} target="_blank">
    <img src={image} alt={id} />
  </StylessButton>
);

const Experiment = () => (
  <div
    css={`
      max-height: 100vh;
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid #343434;
    `}
  >
    <div
      style={{
        marginTop: '2rem',
        ...WRAPPER_STYLING,
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <H2 css={'white-space: pre-line;'}>
        Create static sites, components, <nobr>full-stack</nobr>
        &nbsp;web&nbsp;apps
      </H2>
      <P
        big
        muted
        css={`
          display: block;
          margin-top: 24px;
          margin-bottom: 40px;
          text-align: center;
        `}
      >
        Join a community of creators who’ve crafted <SandboxCount /> public
        sandboxes and counting.
      </P>
      <Button
        style={{
          padding: '.75rem 2rem',
          marginBottom: '.5rem',
          borderRadius: '.25rem',
        }}
        href="/s"
      >
        Get started, it’s free
      </Button>
    </div>
    <Container>
      <ImageWrapper>
        <section>
          <div
            css={`
              align-items: flex-end;
              display: grid;
              transform: translateY(-95px);
            `}
          >
            <Sandbox id="6hi1y" image={one} />
          </div>
          <div
            css={`
              transform: translateY(160px);
            `}
          >
            <Sandbox id="jorpp" image={two} />
            <Sandbox id="2wvzx" image={seven} />
          </div>
          <div>
            <Sandbox id="i2160" image={ten} />
            <Sandbox id="mh13b" image={three} />
          </div>
          <div
            css={`
              transform: translateY(-270px);
            `}
          >
            <Sandbox id="ln0mi" image={six} />
            <Sandbox id="j0y0vpz59" image={eight} />
          </div>
          {/* <div>
            <Sandbox id="y3j31r13zz" image={nine} />
          </div> */}
          {/* <Sandbox id="uotor" image={five} />
           */}
          {/*
            <Sandbox id="prb9t" image={four} /> */}
        </section>
      </ImageWrapper>
    </Container>
  </div>
);
export default Experiment;
