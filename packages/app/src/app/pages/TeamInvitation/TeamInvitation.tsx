import { useMutation, useQuery } from '@apollo/react-hooks';
import LogoIcon from '@codesandbox/common/es/components/Logo';
import track from '@codesandbox/common/es/utils/analytics';
import {
  dashboardUrl,
  teamOverviewUrl,
} from '@codesandbox/common/es/utils/url-generator';
import {
  Button,
  Element,
  Stack,
  Text,
  ThemeProvider,
} from '@codesandbox/components';
import codesandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Link, Redirect } from 'react-router-dom';

import { ContentContainer, PageContainer } from './elements';
import { joinTeamMutation, teamByToken } from './queries';

const InfoDialog = ({
  title,
  description,
  action,
}: {
  title: React.ReactNode | string;
  description?: string;
  action: React.ReactNode;
}) => (
  <Element
    paddingX={14}
    paddingTop={8}
    paddingBottom={8}
    css={css({ borderRadius: 8, backgroundColor: 'grays.900' })}
  >
    <Stack gap={12} direction="vertical" align="center">
      <LogoIcon height={56} width={56} />
      <Stack
        gap={3}
        direction="vertical"
        css={{ textAlign: 'center', color: 'white' }}
      >
        <Text size={5} align="center">
          {title}
        </Text>
        {description && (
          <Text variant="muted" size={4} align="center">
            {description}
          </Text>
        )}
      </Stack>
      {action}
    </Stack>
  </Element>
);

const ErrorDialog = ({ error }: { error: Error }) => (
  <InfoDialog
    title="Something went wrong while fetching the invitation"
    description={error.message.replace('GraphQL error: ', '')}
    action={
      <Stack style={{ width: '100%' }} gap={2}>
        <Button
          // @ts-ignore
          as={Link}
          to={dashboardUrl()}
          style={{ textDecoration: 'none', flex: 1 }}
          variant="secondary"
        >
          Dashboard
        </Button>
        <Button
          onClick={() => {
            document.location.reload();
          }}
          style={{ flex: 1 }}
        >
          Refresh
        </Button>
      </Stack>
    }
  />
);

const TeamSignIn = ({ inviteToken }: { inviteToken: string }) => {
  const { actions } = useOvermind();
  const queryRes = useQuery(teamByToken, { variables: { inviteToken } });

  if (queryRes.loading) {
    return <Text size={6}>Loading Invitation...</Text>;
  }

  if (queryRes.error) {
    return <ErrorDialog error={queryRes.error} />;
  }

  return (
    <>
      <Helmet>
        <title>
          {queryRes.data
            ? `Join ${queryRes.data.teamByToken.name} on CodeSandbox`
            : 'Join team on CodeSandbox'}
        </title>
      </Helmet>

      <InfoDialog
        title={
          <>
            Join <b>{queryRes.data.teamByToken.name}</b> on CodeSandbox
          </>
        }
        description="Please sign in to GitHub to continue"
        action={
          <Button onClick={() => actions.signInClicked()}>
            Sign in to GitHub
          </Button>
        }
      />
    </>
  );
};

const JoinTeam = ({ inviteToken }: { inviteToken: string }) => {
  const { effects } = useOvermind();
  const [loading, setLoading] = React.useState(true);
  const [teamId, setTeamId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  const [joinTeam] = useMutation(joinTeamMutation);

  React.useEffect(() => {
    const join = async () => {
      try {
        track('Team - Join Team', { source: 'url' });

        const result = await joinTeam({ variables: { inviteToken } });
        const team = result.data.redeemTeamInviteToken;
        effects.notificationToast.success(
          'Successfully joined ' + team.name + '!'
        );

        setTeamId(team.id);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    join();
  }, [joinTeam, inviteToken, effects.notificationToast]);

  if (error) {
    return <ErrorDialog error={error} />;
  }

  if (loading || !teamId) {
    return <Text size={6}>Joining Team...</Text>;
  }

  return <Redirect to={teamOverviewUrl(teamId)} />;
};

export const TeamInvitation: React.FC<{
  match: { params: { token: string } };
}> = ({ match }) => {
  const { state } = useOvermind();
  const inviteToken = match?.params?.token;

  const content = (() => {
    if (!state.hasLogIn) {
      return <TeamSignIn inviteToken={inviteToken} />;
    }

    return <JoinTeam inviteToken={inviteToken} />;
  })();

  return (
    <ThemeProvider theme={codesandboxBlack}>
      <PageContainer>
        <ContentContainer>{content}</ContentContainer>
      </PageContainer>
    </ThemeProvider>
  );
};
