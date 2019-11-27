import React from 'react';
import { useOvermind } from 'app/overmind';
import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  Title,
  PublishDate,
  Banner,
  Subtitle,
  Description,
  Highlight,
  Actions,
  CloseButton,
  ViewButton,
} from './elements';

export const DashboardChangelog: React.FC = () => {
  const {
    actions: { modalClosed },
  } = useOvermind();

  return (
    <Container>
      <Header>
        <Title>
          What
          {"'"}s New
        </Title>
        <PublishDate>July 2nd, 2018</PublishDate>
      </Header>
      <Banner
        alt="CodeSandbox Announcement"
        src="https://cdn-images-1.medium.com/max/1600/1*wIMw31_Phf1WNEP6zjuTUw.png"
      />
      <Description>
        We
        {"'"}
        re back with a new update! This update is very focused on{' '}
        <Highlight>collaboration</Highlight> and{' '}
        <Highlight>organization</Highlight>. Let
        {"'"}s take a look!
      </Description>

      <Subtitle>Dashboard</Subtitle>
      <Description>
        You can now manage your sandboxes in your own{' '}
        <Link to="/dashboard">dashboard</Link>! You
        {"'"}
        re able to{' '}
        <Highlight>
          filter, sort, search, delete, create and update
        </Highlight>{' '}
        multiple sandboxes at the same time. The possibilities are endless!
      </Description>

      <Subtitle>Create Teams</Subtitle>
      <Description>
        An extension to the dashboard is <Highlight>teams</Highlight>! You can
        now create a team with unlimited members to share sandboxes for
        collaboration. All sandboxes automatically sync using{' '}
        <Highlight>live collaboration</Highlight> between team members.
      </Description>

      <Subtitle>Free CodeSandbox Live</Subtitle>
      <Description>
        Teams is not our only feature that allows for collaboration. We also
        have <Highlight>real time collaboration</Highlight> with{' '}
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
        <Highlight>CodeSandbox Live is from now on free for everyone</Highlight>
        !
      </Description>

      <Subtitle>And More</Subtitle>
      <Description>
        There
        {"'"}s a lot more included in this update! Make sure to check out the
        announcement post to find out more about this update.
      </Description>

      <Actions>
        <CloseButton onClick={() => modalClosed()}>Close</CloseButton>
        <ViewButton href="/post/announcing-codesandbox-dashboard-teams">
          View Announcement
        </ViewButton>
      </Actions>
    </Container>
  );
};
