import React, { useState } from 'react';
import { H2, P } from '../../../components/Typography';
import SandboxCount from '../../../components/SandboxCount';
import one from '../../../assets/images/explore/1.png';
import two from '../../../assets/images/explore/2.png';
import three from '../../../assets/images/explore/3.png';
import four from '../../../assets/images/explore/4.png';
import five from '../../../assets/images/explore/5.png';
import six from '../../../assets/images/explore/6.png';

import { ImageWrapper, Button, Wrapper, Image, Iframe } from './elements';

const Sandbox = ({ id, image, big }) => {
  const [clicked, setClicked] = useState(null);

  return (
    <Wrapper big={big}>
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

const Experiment = () => (
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
        Explore some of the <SandboxCount />+ sandboxes crafted by our community
        of creators.
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
