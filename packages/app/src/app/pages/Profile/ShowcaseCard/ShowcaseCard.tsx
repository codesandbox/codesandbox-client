import React from 'react';
import { LightIcons } from '@codesandbox/template-icons';
import { SmallSandbox } from '@codesandbox/common/lib/types/SmallSandbox';
import GoHeart from 'react-icons/go/heart';
import GoEye from 'react-icons/go/eye';
import GoRepoForked from 'react-icons/go/repo-forked';
import { useOvermind } from 'app/overmind';
import { Link } from '@codesandbox/common/lib/components';
import { SandboxOptionsMenu } from '../SandboxOptionsMenu';
import { abbreviateNumber } from './abbreviateNumber';
import {
  Container,
  Preview,
  SandboxInfo,
  TitleRow,
  Title,
  Description,
  Statistics,
  Action,
  Stat,
  Environment,
} from './elements';

const environments = {
  "create-react-app": <LightIcons.ReactIconLight />,
  "preact-cli": <LightIcons.PreactIconLight />,
  "vue-cli": <LightIcons.VueIconLight />,
  "apollo": <LightIcons.ApolloIconLight />,
  "node": <LightIcons.NodeIconLight />,
};

export const ShowcaseCard: React.FC<SmallSandbox> = ({
  id,
  title,
  description,
  likeCount,
  viewCount,
  forkCount,
  template,
  // eslint-disable-next-line
}) => {
  const {
    actions: {
      editor: { likeSandboxToggled },
    },
    state: { isLoggedIn },
  } = useOvermind();

  return (
    <Container>
      <Link to={`/s/${id}`}>
        <Preview src={`https://codesandbox.io/api/v1/sandboxes/${id}/screenshot.png`} />
      </Link>
      <SandboxInfo>
        <TitleRow>
          <Title>{title}</Title>
          <SandboxOptionsMenu />
        </TitleRow>
        <Description>{description}</Description>
        <Statistics>
          <Action
            liked
            onClick={() => {
              if (isLoggedIn) {
                likeSandboxToggled(id);
              }
            }}
          >
            <GoHeart />
            {abbreviateNumber(likeCount, { decimalPlaces: 1 })}
          </Action>
          <Stat>
            <GoEye />
            {abbreviateNumber(viewCount, { decimalPlaces: 1 })}
          </Stat>
          <Stat>
            <GoRepoForked />
            {abbreviateNumber(forkCount, { decimalPlaces: 1 })}
          </Stat>
          <Environment to="">{environments[template]}</Environment>
        </Statistics>
      </SandboxInfo>
    </Container>
  );
};
