import * as React from 'react';
import css from '@styled-system/css';
import { Link, Redirect } from 'react-router-dom';
import {
  ThemeProvider,
  Text,
  Stack,
  Element,
  Button,
} from '@codesandbox/components';
import codesandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';
import LogoIcon from '@codesandbox/common/lib/components/Logo';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useOvermind } from 'app/overmind';
import { Helmet } from 'react-helmet';
import {
  teamOverviewUrl,
  dashboardUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { PageContainer, ContentContainer } from './elements';
import { teamByToken, joinTeamMutation } from './queries';

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
      <LogoIcon height={64} width={64} />
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
          <Button
            onClick={() => {
              actions.signInClicked({ useExtraScopes: false });
            }}
          >
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

export const TeamInvitation = ({ match }) => {
  const { state } = useOvermind();
  const inviteToken = match.params.token;

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
