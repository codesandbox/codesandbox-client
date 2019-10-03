import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import { useOvermind } from 'app/overmind';

import {
  Button,
  ButtonContainer,
  Container,
  Date,
  Description,
  Image,
  SubTitle,
  Title,
  TitleContainer,
  White,
} from './elements';

export const DashboardChangelog: FunctionComponent = () => {
  const {
    actions: { modalClosed },
  } = useOvermind();

  return (
    <Container>
      <TitleContainer>
        <Title>
          What
          {"'"}s New
        </Title>

        <Date>July 2nd, 2018</Date>
      </TitleContainer>

      <Image
        alt="CodeSandbox Announcement"
        src="https://cdn-images-1.medium.com/max/1600/1*wIMw31_Phf1WNEP6zjuTUw.png"
      />

      <Description>
        We
        {"'"}
        re back with a new update! This update is very focused on{' '}
        <White>collaboration</White> and <White>organization</White>. Let
        {"'"}s take a look!
      </Description>

      <SubTitle>Dashboard</SubTitle>

      <Description>
        You can now manage your sandboxes in your own{' '}
        <Link to="/dashboard">dashboard</Link>! You
        {"'"}
        re able to{' '}
        <White>filter, sort, search, delete, create and update</White> multiple
        sandboxes at the same time. The possibilities are endless!
      </Description>

      <SubTitle>Create Teams</SubTitle>

      <Description>
        An extension to the dashboard is <White>teams</White>! You can now
        create a team with unlimited members to share sandboxes for
        collaboration. All sandboxes automatically sync using{' '}
        <White>live collaboration</White> between team members.
      </Description>

      <SubTitle>Free CodeSandbox Live</SubTitle>

      <Description>
        Teams is not our only feature that allows for collaboration. We also
        have <White>real time collaboration</White> with{' '}
        <Link target="_blank" to="/docs/live">
          CodeSandbox Live
        </Link>
        . Until now this was behind a{' '}
        <Link target="_blank" to="/patron">
          Patron
        </Link>{' '}
        subscription, but we
        {"'"}
        re happy to announce that{' '}
        <White>CodeSandbox Live is from now on free for everyone</White>!
      </Description>

      <SubTitle>And More</SubTitle>

      <Description>
        There
        {"'"}s a lot more included in this update! Make sure to check out the
        announcement post to find out more about this update.
      </Description>

      <ButtonContainer>
        <Button
          block
          onClick={() => modalClosed()}
          secondary
          small
          style={{ marginRight: '.25rem' }}
        >
          Close
        </Button>

        {/*
        // @ts-ignore */}
        <Button
          block
          href="/post/announcing-codesandbox-dashboard-teams"
          rel="noreferrer noopener"
          small
          style={{ marginLeft: '.25rem' }}
          target="_blank"
        >
          View Announcement
        </Button>
      </ButtonContainer>
    </Container>
  );
};
