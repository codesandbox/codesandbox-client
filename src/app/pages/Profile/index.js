// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import styled from 'styled-components';
import Fullscreen from 'app/components/flex/Fullscreen';
import userActionCreators from 'app/store/entities/users/actions';
import type { User } from 'common/types';

import MaxWidth from './MaxWidth';
import Header from './Header';
import Navigation from './Navigation';
import Showcase from './Showcase';

import Margin from '../../components/spacing/Margin';
import { usersSelector } from '../../store/entities/users/selectors';

type Props = {
  userActions: typeof userActionCreators,
  match: { params: { username: string } },
  user: User,
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
`;

const mapStateToProps = createSelector(
  usersSelector,
  (_, props) => props.match.params.username,
  (users, username) => {
    const userId = Object.keys(users).find(
      id => users[id].username === username,
    );
    const user = users[userId];

    return { user };
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
      return <Container>User could not be found</Container>;
    }

    const { user } = this.props;
    if (!user) return <div />;

    document.title = `${user.name} - CodeSandbox`;
    return (
      <Container>
        <Header user={user} />
        <Content>
          <MaxWidth>
            <Navigation />
          </MaxWidth>
        </Content>
        <MaxWidth width={1024}>
          <Margin horizontal={2}>
            <Showcase id={user.showcasedSandboxId} />
          </Margin>
        </MaxWidth>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
