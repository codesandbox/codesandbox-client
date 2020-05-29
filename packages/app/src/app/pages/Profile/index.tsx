import MaxWidth from '@codesandbox/common/es/components/flex/MaxWidth';
import {
  profileLikesUrl,
  profileSandboxesUrl,
} from '@codesandbox/common/es/utils/url-generator';
import { useOvermind } from 'app/overmind';
import { NotFound } from 'app/pages/common/NotFound';
import React, { FunctionComponent, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Container, Content, Margin } from './elements';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { Sandboxes } from './Sandboxes';
import { Showcase } from './Showcase';

type Props = RouteComponentProps<{ username: string }>;
export const Profile: FunctionComponent<Props> = ({
  match: {
    params: { username },
    url,
  },
}) => {
  const {
    actions: {
      profile: { profileMounted },
    },
    state: {
      profile: { current: user, notFound },
    },
  } = useOvermind();

  useEffect(() => {
    profileMounted(username);
  }, [profileMounted, username]);

  if (notFound) {
    return <NotFound />;
  }

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Helmet>
        <title>{user.name || user.username} - CodeSandbox</title>
      </Helmet>

      <Header />

      <Content>
        <MaxWidth>
          <Navigation />
        </MaxWidth>
      </Content>

      <MaxWidth width={1024}>
        <Margin horizontal={2}>
          <Switch>
            <Route component={Showcase} exact path={url} />

            <Route
              path={`${profileSandboxesUrl(user.username)}/:page?`}
              render={({ match }: RouteComponentProps<{ page?: string }>) => (
                <Sandboxes
                  baseUrl={profileSandboxesUrl(user.username)}
                  page={Number(match.params.page) || 1}
                  source="currentSandboxes"
                />
              )}
            />

            <Route
              path={`${profileLikesUrl(user.username)}/:page?`}
              render={({ match }: RouteComponentProps<{ page?: string }>) => (
                <Sandboxes
                  baseUrl={profileLikesUrl(user.username)}
                  page={Number(match.params.page) || 1}
                  source="currentLikedSandboxes"
                />
              )}
            />
          </Switch>
        </Margin>
      </MaxWidth>
    </Container>
  );
};
