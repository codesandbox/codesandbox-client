import React, { useState } from 'react';
import Button from '../../../components/Button';
import { H2, P } from '../../../components/Typography';
import SandboxCount from '../../../components/SandboxCount';
import one from '../../../assets/images/explore/1.png';
import two from '../../../assets/images/explore/2.png';
import three from '../../../assets/images/explore/3.png';
import four from '../../../assets/images/explore/4.png';
import five from '../../../assets/images/explore/5.png';
import six from '../../../assets/images/explore/6.png';
import seven from '../../../assets/images/explore/7.png';
import eight from '../../../assets/images/explore/8.png';
import nine from '../../../assets/images/explore/9.png';
import ten from '../../../assets/images/explore/10.png';
import eleven from '../../../assets/images/explore/11.png';
import twelve from '../../../assets/images/explore/12.png';

import {
  ImageWrapper,
  StylessButton,
  Image,
  Iframe,
  itemWidth,
  Container,
} from './elements';
import { WRAPPER_STYLING } from '../../../components/layout';

const Sandbox = ({ id, image, big }) => {
  const [clicked, setClicked] = useState(null);

  return (
    <div>
      {clicked ? (
        <Iframe
          big={big}
          title={id}
          src={`https://codesandbox.io/embed/${id}?fontsize=14&hidenavigation=1&view=preview&hidedevtools=1`}
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        />
      ) : (
        <StylessButton
          onClick={() => setClicked(true)}
          // href={`https://codesandbox.io/s/${id}`}
          target="_blank"
        >
          <Image big={big} src={image} alt={id} />
        </StylessButton>
      )}
    </div>
  );
};

const Experiment = () => (
  <div
    css={`
      max-height: 100vh;
      position: relative;
      overflow: hidden;
    `}
  >
    <div style={{ marginTop: '2rem', ...WRAPPER_STYLING, textAlign: 'center' }}>
      <H2>Create Static Sites, Full-stack Web Apps, or Components</H2>
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
        Join a community of creators who’ve crafted <SandboxCount /> sandboxes
        and counting.
      </P>
      <Button
        style={{
          padding: '.75rem 2rem',
          marginBottom: '.5rem',
          borderRadius: '.25rem',
        }}
        href="/s"
      >
        Get Started, it’s free
      </Button>
    </div>
    <Container>
      <ImageWrapper>
        <section>
          <div>
            <Sandbox id="j0y0vpz59" big image={one} />
            <Sandbox
              index={1}
              x={(itemWidth + 16) * 1}
              id="m7q0r29nn9"
              big
              image={two}
            />
          </div>
          <div>
            <Sandbox id="variants-uotor" image={three} />
            <Sandbox id="ppxnl191zx" image={four} />
          </div>
          <div>
            <Sandbox id="732j6q4620" image={five} />
            <Sandbox
              id="react-three-fiber-untitled-game-i2160"
              big
              image={six}
            />
          </div>
          <div>
            <Sandbox id="ln0mi" big image={seven} />

            <Sandbox id="yp21r" big image={eight} />
          </div>
          <div>
            <Sandbox id="2wvzx" big image={nine} />

            <Sandbox id="prb9t" big image={ten} />
          </div>
          <div>
            <Sandbox id="g1u8u" big image={eleven} />

            <Sandbox id="b0ntj" big image={twelve} />
          </div>
        </section>
      </ImageWrapper>
    </Container>
  </div>
);
export default Experiment;
