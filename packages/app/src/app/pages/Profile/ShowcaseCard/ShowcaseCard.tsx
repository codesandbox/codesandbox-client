import React from 'react';
import { LightIcons } from '@codesandbox/template-icons';
import { GoHeart, GoEye, GoRepoForked } from 'react-icons/go';
import { MdMoreHoriz } from 'react-icons/md';
import { Link, MenuItem, Separator } from '@codesandbox/common/lib/components';
import { abbreviateNumber } from './abbreviateNumber';
import {
  Container,
  Preview,
  SandboxInfo,
  TitleRow,
  Title,
  Menu,
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
  // - Add handles for all options menu buttons (Pin, Open, Fork, Hide, Trash)
  return (
    <Container>
      <Link to={`/s/${id}`}>
        <Preview src={preview} />
      </Link>
      <SandboxInfo>
        <TitleRow>
          <Title>{title}</Title>
          <Menu label={<MdMoreHoriz />} aria-label="Sandbox Options">
            <MenuItem>Pin Sandbox</MenuItem>
            <Separator />
            <MenuItem>Open Sandbox</MenuItem>
            <Separator />
            <MenuItem>Fork Sandbox</MenuItem>
            <Separator />
            <MenuItem disabled>Hide Sandbox</MenuItem>
            <Separator />
            <MenuItem danger>Move to Trash</MenuItem>
          </Menu>
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
