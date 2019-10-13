import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { Route, Switch, RouteProps } from 'react-router-dom';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import {
  profileSandboxesUrl,
  profileLikesUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
import { NotFound } from 'app/pages/common/NotFound';
import Header from './Header';
import Navigation from './Navigation';
import Showcase from './Showcase';
import Sandboxes from './Sandboxes';
import { Container, Content } from './elements';

interface Props {
  match: {
    params: { username: String };
    url: String;
  };
}

export const Profile: React.FC<Props & RouteProps> = ({ match }) => {
  const { username } = match.params;
  const {
    state: { profile },
    actions: {
      profile: { profileMounted },
    },
  } = useOvermind();
  const user = profile.current;

  useEffect(() => {
    profileMounted({ username });
  }, [username, profileMounted]);

  if (profile.notFound) {
    return <NotFound />;
  }

  if (!profile.current) return <div />;
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
            <Route path={`${profileSandboxesUrl(user.username)}/:page?`}>
              <Sandboxes
                source="currentSandboxes"
                page={match.params.page && +match.params.page}
                baseUrl={profileSandboxesUrl(user.username)}
              />
            </Route>

            <Route path={`${profileLikesUrl(user.username)}/:page?`}>
              <Sandboxes
                source="currentLikedSandboxes"
                page={match.params.page && +match.params.page}
                baseUrl={profileLikesUrl(user.username)}
              />
            </Route>
          </Switch>
        </Margin>
      </MaxWidth>
    </Container>
  );
};
