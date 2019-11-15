import React, { useState } from 'react';

import styled from 'styled-components';
import { H2, P } from '../../components/Typography';

import one from '../../assets/images/explore/1.png';
import two from '../../assets/images/explore/2.png';
import three from '../../assets/images/explore/3.png';
import four from '../../assets/images/explore/4.png';
import five from '../../assets/images/explore/5.png';
import six from '../../assets/images/explore/6.png';

const ImageWrapper = styled.div`
  margin-top: 2rem;
  width: calc(100vw - ((100vw - 1200px) / 2) - 10px);
  overflow: auto;

  > section {
    display: flex;
    align-items: center;
  }

  img {
    cursor: pointer;
    max-width: initial;
  }

  div > div {
    margin-bottom: 2rem;
  }

  div {
    margin: 1rem;
  }

  &::-webkit-scrollbar {
    width: 0.5em;
    height: 0.5em;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const Button = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0;
`;

const Sandbox = ({ id, image, big }) => {
  const [clicked, setClicked] = useState(null);

  return (
    <div
      style={{
        width: 324,
        height: big ? 548 : 420,
      }}
    >
      {clicked ? (
        <iframe
          title={id}
          src={`https://codesandbox.io/embed/${id}?fontsize=14&hidenavigation=1&view=preview`}
          style={{
            width: 324,
            height: big ? 548 : 420,
            border: 0,
            borderRadius: 4,
            overflow: 'hidden',
          }}
          sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
        />
      ) : (
        <Button type="button" onClick={setClicked}>
          <img src={image} alt={id} />
        </Button>
      )}
    </div>
  );
};

const Experiment = () => (
  // const { scrollY } = useViewportScroll();
  // const y = useTransform(scrollY, [0, -100], [0, 5], { clamp: false });

  <>
    <div
      css={`
        margin-top: 15rem;
      `}
    >
      <H2>Create Static Sites, Full-stack Web Apps, or Components</H2>
      <P
        muted
        css={`
          margin-bottom: 2rem;
        `}
      >
        Explore some of the 2,817,838+ sandboxes crafted by our community of
        creators
      </P>
    </div>
    <div>
      <ImageWrapper>
        <section>
          <Sandbox id="j0y0vpz59" big image={one} />
          <Sandbox id="m7q0r29nn9" big image={two} />
          <div
            css={`
              width: 324px;
            `}
          >
            <Sandbox id="variants-uotor" image={three} />
            <Sandbox id="ppxnl191zx" image={four} />
          </div>
          <Sandbox id="732j6q4620" image={five} />
          <Sandbox id="react-three-fiber-untitled-game-i2160" big image={six} />
        </section>
      </ImageWrapper>
    </div>
  </>
);
export default Experiment;
