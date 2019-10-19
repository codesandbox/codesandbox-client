import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { profileLikesUrl, profileSandboxesUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
import { NotFound } from 'app/pages/common/NotFound';
import React from 'react';
import Helmet from 'react-helmet';
import { RouteComponentProps, withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { Container, Content } from './elements';
import Header from './Header';
import Navigation from './Navigation';
import Sandboxes from './Sandboxes';
import Showcase from './Showcase';

const Profile: React.FC<RouteComponentProps<{}>> = ({
  match: {
    params: { username },
    url,
  },
}) => {
  const {
    state: {
      profile: { notFound, current },
    },
    actions: {
      profile: { profileMounted },
    },
  } = useOvermind();

  React.useEffect(() => {
    profileMounted({ username });
  }, [profileMounted, username]);

  if (notFound) {
    return <NotFound />;
  }
  if (!current) {
    return <div />;
  }
  return (
    <Container>
      <Helmet>
        <title>{current.name || current.username} - CodeSandbox</title>
      </Helmet>
      <Header user={current} />
      <Content>
        <MaxWidth>
          <Navigation
            username={current.username}
            sandboxCount={current.sandboxCount}
            likeCount={current.givenLikeCount}
          />
        </MaxWidth>
      </Content>
      <MaxWidth width={1024}>
        <Margin horizontal={2} style={{ minHeight: '60vh' }}>
          <Switch>
            <Route path={url} exact render={() => <Showcase />} />
            <Route path={`${profileSandboxesUrl(current.username)}/:page?`}>
              {({ match }) => (
                <Sandboxes
                  source="currentSandboxes"
                  page={match.params.page && +match.params.page}
                  baseUrl={profileSandboxesUrl(current.username)}
                />
              )}
            </Route>
            <Route path={`${profileLikesUrl(current.username)}/:page?`}>
              {({ match }) => (
                <Sandboxes
                  source="currentLikedSandboxes"
                  page={match.params.page && +match.params.page}
                  baseUrl={profileLikesUrl(current.username)}
                />
              )}
            </Route>
          </Switch>
        </Margin>
      </MaxWidth>
    </Container>
  );
};

// eslint-disable-next-line import/no-default-export
export default withRouter(Profile);
