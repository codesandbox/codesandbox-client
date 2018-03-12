import * as React from 'react';
import { connect } from 'app/fluent'
import { Route, Switch } from 'react-router-dom';

import MaxWidth from 'common/components/flex/MaxWidth';
import Margin from 'common/components/spacing/Margin';
import {
  profileSandboxesUrl,
  profileLikesUrl,
} from 'common/utils/url-generator';

import NotFound from 'app/pages/common/NotFound';

import Header from './Header';
import Navigation from './Navigation';
import Showcase from './Showcase';
import Sandboxes from './Sandboxes';

import { Container, Content } from './elements';

type Props = {
  match: {
    params: { username: string },
    url: string,
  },
  signals: any,
  store: any,
};

export default connect<Props>()
  .with(({ state, signals }) => ({
    notFound: state.profile.notFound,
    user: state.profile.current,
    profileMounted: signals.profile.profileMounted
  }))
  .toClass(props =>
    class Profile extends React.Component<typeof props> {
      componentDidMount() {
        const { username } = this.props.match.params;

        this.props.profileMounted({ username });
      }

      componentDidUpdate(prevProps) {
        const prevUsername = prevProps.match.params.username;
        const username = this.props.match.params.username;

        if (prevUsername !== username) {
          this.props.profileMounted({ username });
        }
      }

      render() {
        const { match, notFound, user } = this.props;

        if (notFound) {
          return <NotFound />;
        }

        if (!user) return <div />;

        document.title = `${user.name || user.username} - CodeSandbox`;

        return (
          <Container>
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
                    children={({ match }) => (
                      <Sandboxes
                        source="currentSandboxes"
                        page={match.params.page && +match.params.page}
                        baseUrl={profileSandboxesUrl(user.username)}
                      />
                    )}
                  />
                  <Route
                    path={`${profileLikesUrl(user.username)}/:page?`}
                    // eslint-disable-next-line
                    children={({ match }) => (
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
      }
    }
  )
