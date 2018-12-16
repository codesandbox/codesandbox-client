import React from 'react';

import { sandboxUrl } from 'common/utils/url-generator';
import Row from 'common/components/flex/Row';
import Stat from 'app/components/Stat';

import SvgButton from './play-button.svg';
import {
  Container,
  Title,
  Like,
  Description,
  Stats,
  PlayButtonContainer,
} from './elements';

function SandboxInfo({ sandbox }) {
  return (
    <Container>
      <Row alignItems="center">
        <Title>
          {sandbox.title || 'Undefined'} <Like sandbox={sandbox} />
        </Title>
      </Row>
      <Row alignItems="flex-start">
        <div
          css={`
            flex: 6;
          `}
        >
          <Description>{sandbox.description}</Description>
        </div>
        <Stats>
          <PlayButtonContainer to={sandboxUrl({ id: sandbox.id })}>
            <img alt="edit" src={SvgButton} />
          </PlayButtonContainer>
          <Stat name="likes" count={sandbox.likeCount} />
          <Stat name="views" count={sandbox.viewCount} />
          <Stat name="forks" count={sandbox.forkCount} />
        </Stats>
      </Row>
    </Container>
  );
}

export default SandboxInfo;
