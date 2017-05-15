// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import styled from 'styled-components';

import Fullscreen from 'app/components/flex/Fullscreen';
import userActionCreators from 'app/store/entities/users/actions';
import { currentUserSelector } from 'app/store/user/selectors';
import type { User } from 'common/types';
import Margin from 'app/components/spacing/Margin';
import { usersSelector } from 'app/store/entities/users/selectors';
import { profileSandboxesUrl, profileLikesUrl } from 'app/utils/url-generator';

import NotFound from 'app/pages/NotFound';

import MaxWidth from './MaxWidth';
import Header from './Header';
import Navigation from './Navigation';
import Showcase from './Showcase';
import SandboxList from './SandboxList';

type Props = {
  userActions: typeof userActionCreators,
  match: { params: { username: string }, url: string },
  user: User,
  isCurrentUser: boolean,
};

const Container = styled(Fullscreen)`
  color: white;

  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: linear-gradient(-180deg, #282D2F 0%, #1D1F20 100%);
`;

const Content = styled(Fullscreen)`
  border-top: 1px solid ${props => props.theme.background3};
  flex: 0 0 70px;
`;

const mapStateToProps = createSelector(
  usersSelector,
  (_, props) => props.match.params.username,
  currentUserSelector,
  (users, username, currentUser) => {
    const userId = Object.keys(users).find(
      id => users[id].username === username,
    );
    const user = users[userId];

    const isCurrentUser =
      currentUser && user && currentUser.username === user.username;

    return { user, isCurrentUser };
  },
);
const mapDispatchToProps = (dispatch: Function) => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
});
class Profile extends React.PureComponent {
  props: Props;
  state: {
    notFound: boolean,
  } = {
    notFound: false,
  };

  fetchUser = async (username: string) => {
    try {
      this.setState({ notFound: false });
      await this.props.userActions.fetchUser(username);
    } catch (e) {
      this.setState({ notFound: true });
    }
  };

  componentDidMount() {
    const { username } = this.props.match.params;

    this.fetchUser(username);
  }

  render() {
    if (this.state.notFound) {
      return <NotFound />;
    }

    const { user, match, userActions, isCurrentUser } = this.props;
    if (!user) return <div />;

    document.title = `${user.name} - CodeSandbox`;
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
              <Route
                path={match.url}
                exact
                render={() => (
                  <Showcase
                    isCurrentUser={isCurrentUser}
                    id={user.showcasedSandboxShortid}
                  />
                )}
              />
              <Route
                path={`${profileSandboxesUrl(user.username)}/:page?`}
                children={({ match }) => (
                  <SandboxList
                    username={user.username}
                    fetchSandboxes={userActions.fetchAllSandboxes}
                    sandboxes={user.sandboxes}
                    sandboxCount={user.sandboxCount}
                    baseUrl={profileSandboxesUrl(user.username)}
                    page={match.params.page && +match.params.page}
                  />
                )}
              />
              <Route
                path={`${profileLikesUrl(user.username)}/:page?`}
                children={({ match }) => (
                  <SandboxList
                    username={user.username}
                    fetchSandboxes={userActions.fetchLikedSandboxes}
                    sandboxes={user.likedSandboxes}
                    sandboxCount={user.givenLikeCount}
                    baseUrl={profileLikesUrl(user.username)}
                    page={match.params.page && +match.params.page}
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
