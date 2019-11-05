import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
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
import { Showcase } from './Showcase';
import Sandboxes from './Sandboxes';
import { Container, Content } from './elements';

interface IProfileProps {
  match: {
    params: { username: string };
    url: string;
  };
}

const Profile: React.FC<IProfileProps> = ({
  match: {
    params: { username },
    url,
  },
}) => {
  const {
    state: {
      profile: { current: user, notFound },
    },
    actions: {
      profile: { profileMounted },
    },
  } = useOvermind();

  useEffect(() => {
    profileMounted({ username });
  }, [profileMounted, username]);

  if (notFound) {
    return <NotFound />;
  }

  if (!user) {
    return <div />;
  }

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
            <Route path={url} exact render={() => <Showcase />} />
            <Route
              path={`${profileSandboxesUrl(user.username)}/:page?`}
              render={({ match }) => (
                <Sandboxes
                  source="currentSandboxes"
                  page={match.params.page && +match.params.page}
                  baseUrl={profileSandboxesUrl(user.username)}
                />
              )}
            />
            <Route
              path={`${profileLikesUrl(user.username)}/:page?`}
              render={({ match }) => (
                <Sandboxes
                  source="currentLikedSandboxes"
                  page={match.params.page && +match.params.page}
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

export default Profile;
