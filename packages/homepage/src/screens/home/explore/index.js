import React, { useState, useEffect } from 'react';
import { H2, P } from '../../../components/Typography';
import SandboxCount from '../../../components/SandboxCount';
import one from '../../../assets/images/explore/1.png';
import two from '../../../assets/images/explore/2.png';
import three from '../../../assets/images/explore/3.png';
import four from '../../../assets/images/explore/4.png';
import five from '../../../assets/images/explore/5.png';
import six from '../../../assets/images/explore/6.png';

import {
  ImageWrapper,
  Button,
  Wrapper,
  Image,
  Iframe,
  itemWidth,
  viewPortMargin,
  smallItemHeight,
} from './elements';
import { WRAPPER_STYLING } from '../../../components/layout';

const Sandbox = ({
  id,
  image,
  big,
  index = 0,
  x,
  y = 0,
  shouldAnimate,
  randomizeHeight = true,
}) => {
  const [clicked, setClicked] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const topOffset = React.useRef(
    y + (randomizeHeight ? Math.random() * 120 : 0)
  );

  const element = React.useRef();

  useEffect(() => {
    const windowListener = () => {
      window.addEventListener('resize', () => {
        setWindowWidth(window.innerWidth);
      });
    };

    window.addEventListener('resize', windowListener);

    return () => {
      window.removeEventListener('resize', windowListener);
    };
  });

  useEffect(() => {
    let lastRender = Date.now();
    let isRendering = true;

    const render = () => {
      const elapsedTime = Date.now() - lastRender;
      const baseSpeed = shouldAnimate ? 5 : 0.5;
      const deltaX = (baseSpeed * elapsedTime) / 1000;

      if (element.current) {
        let currentLeft = parseInt(
          element.current.style.left.replace('px', ''),
          10
        );
        if (currentLeft <= 0) {
          currentLeft = windowWidth + itemWidth + viewPortMargin;
        }
        element.current.style.left = currentLeft - deltaX + 'px';
      }

      lastRender = Date.now();

      if (isRendering) {
        requestAnimationFrame(render);
      }
    };

    if (element) {
      render();
    }

    return () => {
      isRendering = false;
    };
  }, [element, shouldAnimate, windowWidth]);

  return (
    <Wrapper
      big={big}
      index={index}
      style={{
        left: itemWidth + x,
        top: topOffset.current,
      }}
      ref={element}
    >
      {clicked ? (
        <Iframe
          big={big}
          title={id}
          src={`https://codesandbox.io/embed/${id}?fontsize=14&hidenavigation=1&view=preview&hidedevtools=1`}
          sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
        />
      ) : (
        <Button type="button" onClick={setClicked}>
          <Image big={big} src={image} alt={id} />
        </Button>
      )}
    </Wrapper>
  );
};

const Experiment = () => {
  const [hasMouseOver, setMouseOver] = React.useState(false);

  return (
    <>
      <div style={{ marginTop: '2rem', ...WRAPPER_STYLING }}>
        <H2>Create Static Sites, Full-stack Web Apps, or Components</H2>
        <P
          big
          muted
          css={`
            margin-bottom: 2rem;
          `}
        >
          Explore some of the <SandboxCount />+ sandboxes crafted by our
          community of creators.
        </P>
      </div>
      <div>
        <ImageWrapper
          onMouseEnter={() => {
            setMouseOver(true);
          }}
          onMouseLeave={() => {
            setMouseOver(false);
          }}
        >
          <section>
            <Sandbox
              shouldAnimate={!hasMouseOver}
              index={0}
              x={(itemWidth + 16) * 0}
              id="j0y0vpz59"
              big
              image={one}
            />
            <Sandbox
              shouldAnimate={!hasMouseOver}
              index={1}
              x={(itemWidth + 16) * 1}
              id="m7q0r29nn9"
              big
              image={two}
            />

            <Sandbox
              shouldAnimate={!hasMouseOver}
              index={2}
              x={(itemWidth + 16) * 2}
              id="variants-uotor"
              image={three}
              randomizeHeight={false}
            />
            <Sandbox
              shouldAnimate={!hasMouseOver}
              index={2}
              x={(itemWidth + 16) * 2}
              y={smallItemHeight + 16}
              id="ppxnl191zx"
              image={four}
              randomizeHeight={false}
            />

            <Sandbox
              shouldAnimate={!hasMouseOver}
              index={4}
              x={(itemWidth + 16) * 3}
              id="732j6q4620"
              image={five}
            />
            <Sandbox
              shouldAnimate={!hasMouseOver}
              index={5}
              x={(itemWidth + 16) * 4}
              id="react-three-fiber-untitled-game-i2160"
              big
              image={six}
            />
          </section>
        </ImageWrapper>
      </div>
    </>
  );
};
export default Experiment;
