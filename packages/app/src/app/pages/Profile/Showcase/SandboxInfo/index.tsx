import Row from '@codesandbox/common/lib/components/flex/Row';
import { Sandbox } from '@codesandbox/common/lib/types';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';

import { Stat } from 'app/components/Stat';
import { useOvermind } from 'app/overmind';

import {
  Container,
  Description,
  Like,
  PlayButtonContainer,
  Stats,
  Title,
} from './elements';
import SvgButton from './play-button.svg';

type Props = {
  sandbox: Sandbox;
};
export const SandboxInfo: FunctionComponent<Props> = ({ sandbox }) => {
  const {
    state: { isLoggedIn },
  } = useOvermind();

  return (
    <Container>
      <Row alignItems="center">
        <Title>
          {getSandboxName(sandbox)}{' '}
          {isLoggedIn ? <Like sandbox={sandbox} /> : null}
        </Title>
      </Row>

      <Row alignItems="flex-start">
        <div style={{ flex: 6 }}>
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
};
