// @flow
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { CurrentUser } from 'common/types';
import { Link } from 'react-router-dom';

import GithubIcon from 'react-icons/lib/go/mark-github';

import Button from 'app/components/buttons/Button';
import Logo from 'app/components/Logo';
import Row from 'app/components/flex/Row';
import { currentUserSelector, jwtSelector } from 'app/store/user/selectors';
import userActionCreators from 'app/store/user/actions';
import Tooltip from 'app/components/Tooltip';

import User from './User';
import { newSandboxUrl } from '../../utils/url-generator';

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

const Action = styled.div`
  transition: 0.3s ease all;
  margin: 0 2rem;
  cursor: pointer;
  color: white;

  &:hover {
    color: white;
  }
`;

const PlusIcon = styled(Link)`
  color: inherit;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 300;
`;

type Props = {
  title: string,
  user: CurrentUser,
  hasLogin: boolean,
  userActions: typeof userActionCreators,
};

const mapStateToProps = state => ({
  user: currentUserSelector(state),
  hasLogin: !!jwtSelector(state),
});
const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
});
class Navigation extends React.PureComponent {
  props: Props;
  render() {
    const { title, hasLogin, user, userActions } = this.props;

    return (
      <Row justifyContent="space-between">
        <Row>
          <a href="/">
            <LogoWithBorder height={40} width={40} />
          </a>
          <Border width={1} size={500} />
          <Title>
            {title}
          </Title>
        </Row>
        <Row>
          <Action>
            <Tooltip title="New Sandbox">
              <PlusIcon to={newSandboxUrl()}>+</PlusIcon>
            </Tooltip>
          </Action>
          {hasLogin
            ? <User signOut={userActions.signOut} user={user} />
            : <Button small onClick={userActions.signIn}>
                <Row>
                  <GithubIcon style={{ marginRight: '0.5rem' }} /> Sign in with
                  GitHub
                </Row>
              </Button>}
        </Row>
      </Row>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
