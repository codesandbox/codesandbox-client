import Row from '@codesandbox/common/es/components/flex/Row';
import { getSandboxName } from '@codesandbox/common/es/utils/get-sandbox-name';
import { sandboxUrl } from '@codesandbox/common/es/utils/url-generator';
import { Stat } from 'app/components/Stat';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

import {
  Container,
  Description,
  DescriptionContainer,
  Like,
  PlayButtonContainer,
  Stats,
  Title,
} from './elements';
import SvgButton from './play-button.svg';

export const SandboxInfo: FunctionComponent = () => {
  const {
    state: {
      profile: {
        showcasedSandbox,
        showcasedSandbox: {
          alias,
          description,
          forkCount,
          id,
          likeCount,
          viewCount,
        },
      },
      isLoggedIn,
    },
  } = useOvermind();

  return (
    <Container>
      <Row alignItems="center">
        <Title>
          {getSandboxName(showcasedSandbox)} {''}
          {isLoggedIn ? <Like sandbox={showcasedSandbox} /> : null}
        </Title>
      </Row>

      <Row alignItems="flex-start">
        <DescriptionContainer>
          <Description>{description}</Description>
        </DescriptionContainer>

        <Stats>
          <PlayButtonContainer to={sandboxUrl({ alias, id })}>
            <img alt="edit" src={SvgButton} />
          </PlayButtonContainer>

          <Stat name="likes" count={likeCount} />

          <Stat name="views" count={viewCount} />

          <Stat name="forks" count={forkCount} />
        </Stats>
      </Row>
    </Container>
  );
};
