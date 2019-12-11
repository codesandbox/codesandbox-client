import React from 'react';
import { LightIcons } from '@codesandbox/template-icons';
import GoHeart from 'react-icons/go/heart';
import GoEye from 'react-icons/go/eye';
import GoRepoForked from 'react-icons/go/repo-forked';
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
  React: <LightIcons.ReactIconLight />,
};

interface IShowcaseCardProps {
  id: string;
  preview: string;
  title: string;
  description: string;
  likes: number;
  views: number;
  forks: number;
  environment: string;
}

export const ShowcaseCard: React.FC<IShowcaseCardProps> = ({
  id,
  preview,
  title,
  description,
  likes,
  views,
  forks,
  environment,
  // eslint-disable-next-line
}) => {
  // TODO:
  // - Add handler for Liking/Unliking the sandbox.
  return (
    <Container>
      <Link to={`/s/${id}`}>
        <Preview src={preview} />
      </Link>
      <SandboxInfo>
        <TitleRow>
          <Title>{title}</Title>
          <SandboxOptionsMenu />
        </TitleRow>
        <Description>{description}</Description>
        <Statistics>
          <Action>
            <GoHeart />
            {abbreviateNumber(likes, { decimalPlaces: 1 })}
          </Action>
          <Stat>
            <GoEye />
            {abbreviateNumber(views, { decimalPlaces: 1 })}
          </Stat>
          <Stat>
            <GoRepoForked />
            {abbreviateNumber(forks, { decimalPlaces: 1 })}
          </Stat>
          <Environment to="">{environments[environment]}</Environment>
        </Statistics>
      </SandboxInfo>
    </Container>
  );
};
