import * as React from 'react';
import css from '@styled-system/css';
import { Link } from 'react-router-dom';
import {
  ThemeProvider,
  Text,
  Stack,
  Element,
  Button,
} from '@codesandbox/components';
import LogoIcon from '@codesandbox/common/lib/components/Logo';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useActions, useAppState, useEffects } from 'app/overmind';
import { Helmet } from 'react-helmet';
import {
  dashboardUrl,
  dashboard,
} from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';
import { PageContainer, ContentContainer } from './elements';
import { teamByToken, joinTeamMutation } from './queries';

const InfoDialog = ({
  title,
  description,
  action,
}: {
  title: React.ReactNode | string;
  description?: string | React.ReactNode;
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
    description={
      <>
        Sorry, we could not find this invitation. Try reloading the page. <br />
        If problems persist then check the invite token is correct.
      </>
    }
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
  const actions = useActions();
  const { loading, error, data } = useQuery(teamByToken, {
    variables: { inviteToken },
  });

  if (loading) {
    return <Text size={6}>Loading Invitation...</Text>;
  }

  if (error) {
    return <ErrorDialog error={error} />;
  }

  return (
    <>
      <Helmet>
        <title>
          {data
            ? `Join ${data.teamByToken.name} on CodeSandbox`
            : 'Join workspace on CodeSandbox'}
        </title>
      </Helmet>

      <InfoDialog
        title={
          <>
            Join <b>{data.teamByToken.name}</b> on CodeSandbox
          </>
        }
        description="Please sign in to continue"
        action={
          <Button onClick={() => actions.signInClicked()}>Sign in</Button>
        }
      />
    </>
  );
};

const JoinTeam = ({ inviteToken }: { inviteToken: string }) => {
  const effects = useEffects();
  const [loading, setLoading] = React.useState(true);
  const [team, setTeam] = React.useState<{
    id: string;
  } | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  const [joinTeam] = useMutation(joinTeamMutation);

  React.useEffect(() => {
    const join = async () => {
      try {
        track('Team - Join Team', { source: 'url' });

        const result = await joinTeam({ variables: { inviteToken } });
        const resultTeam = result.data.redeemTeamInviteToken;
        effects.notificationToast.success(
          `Successfully joined ${resultTeam.name}!`
        );

        setTeam(resultTeam);
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

  if (loading || !team?.id) {
    return <Text size={6}>Joining workspace...</Text>;
  }

  // Ensure all endpoints for new team are fetched
  window.location.href = dashboard.recent(team.id, { new_join: 'true' });
  return null;
};

export const TeamInvitation: React.FC<{
  match: { params: { token: string } };
}> = ({ match }) => {
  const state = useAppState();
  const inviteToken = match?.params?.token;

  return (
    <ThemeProvider>
      <PageContainer>
        <ContentContainer>
          {state.hasLogIn ? (
            <JoinTeam inviteToken={inviteToken} />
          ) : (
            <TeamSignIn inviteToken={inviteToken} />
          )}
        </ContentContainer>
      </PageContainer>
    </ThemeProvider>
  );
};
