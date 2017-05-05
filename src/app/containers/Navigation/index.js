// @flow
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { CurrentUser } from 'common/types';

import Button from 'app/components/buttons/Button';
import Logo from 'app/components/Logo';
import Row from 'app/components/flex/Row';
import { userSelector, jwtSelector } from 'app/store/user/selectors';
import userActionCreators from 'app/store/user/actions';

import User from './User';

const LogoWithBorder = styled(Logo)`
  padding-right: 1rem;
`;

const Border = styled.hr`
  display: inline-block;
  height: 28px;
  border: none;
  border-right: 1px solid rgba(255, 255, 255, 0.4);
`;

const Title = styled.h1`
  margin-left: 1rem;
  font-size: 1.2rem;
  color: white;
  font-weight: 300;
`;

const Actions = styled.div`
  display: flex;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 1.5rem;
`;

const Action = styled.div`
  transition: 0.3s ease all;
  margin: 0 1rem;
  cursor: pointer;

  &:hover {
    color: white;
  }
`;

const ActionIcon = styled.div`
  display: inline-block;
  font-size: 1.125rem;
  padding-right: 0.5rem;
`;

type Props = {
  title: string,
  user: CurrentUser,
  hasLogin: boolean,
  userActions: typeof userActionCreators,
  actions: Array<{
    name: string,
    action: Function,
    Icon: React.Element,
  }>,
};

const mapStateToProps = state => ({
  user: userSelector(state),
  hasLogin: !!jwtSelector(state),
});
const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
});
class Navigation extends React.PureComponent {
  props: Props;
  render() {
    const { title, hasLogin, user, userActions, actions = [] } = this.props;

    return (
      <Row justifyContent="space-between">
        <Row>
          <a href="/">
            <LogoWithBorder height={40} width={40} />
          </a>
          <Border width={1} size={500} />
          <Title>{title}</Title>

          <Actions>
            {actions.map(({ name, Icon }) => {
              return (
                <Action key={name}>
                  <ActionIcon><Icon /></ActionIcon>{name}
                </Action>
              );
            })}
          </Actions>
        </Row>
        <Row>
          {hasLogin
            ? <User user={user} />
            : <Button small onClick={userActions.signIn}>
                Login with GitHub
              </Button>}
        </Row>
      </Row>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
