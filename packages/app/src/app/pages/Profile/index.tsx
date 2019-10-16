import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import {
  profileSandboxesUrl,
  profileLikesUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { NotFound } from 'app/pages/common/NotFound';
import { useOvermind } from 'app/overmind';
import Header from './Header';
import Navigation from './Navigation';
import Showcase from './Showcase';
import Sandboxes from './Sandboxes';
import { Container, Content } from './elements';

interface IProfileProps extends RouteComponentProps<{ username: string }> {}

export const Profile: React.FC<IProfileProps> = ({ match }) => {
  const {
    state: {
      profile: { current: user, notFound },
    },
    actions: {
      profile: { profileMounted },
    },
  } = useOvermind();
  const { username } = match.params;

  useEffect(() => {
    profileMounted({ username });
  }, [profileMounted, username]);

  if (notFound) {
    return <NotFound />;
  }

  if (!user) return <div />;

  return (
    <Container>
      <Helmet>
        <title>{user.name || user.username} - CodeSandbox</title>
      </Helmet>
      <Header user={user} />
      <Content>
        <MaxWidth>
          <Navigation
            username={user.username}
            sandboxCount={user.sandboxCount}
            likeCount={user.givenLikeCount}
          />
        </MaxWidth>
      </Content>
      <MaxWidth width={1024}>
        <Margin horizontal={2} style={{ minHeight: '60vh' }}>
          <Switch>
            <Route path={match.url} exact render={() => <Showcase />} />
            <Route
              path={`${profileSandboxesUrl(user.username)}/:page?`}
              // eslint-disable-next-line
              children={({ match: psMatch }) => (
                <Sandboxes
                  source="currentSandboxes"
                  page={psMatch.params.page && +psMatch.params.page}
                  baseUrl={profileSandboxesUrl(user.username)}
                />
              )}
            />
            <Route
              path={`${profileLikesUrl(user.username)}/:page?`}
              // eslint-disable-next-line
              children={({ match: plMatch }) => (
                <Sandboxes
                  source="currentLikedSandboxes"
                  page={plMatch.params.page && +plMatch.params.page}
                  baseUrl={profileLikesUrl(user.username)}
                />
              )}
            />
          </Switch>
        </Margin>
      </MaxWidth>
    </Container>
  );
};