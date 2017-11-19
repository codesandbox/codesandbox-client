// @flow
import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SignInButton from 'app/containers/SignInButton';
import NewSandbox from 'app/containers/modals/NewSandbox';

import PlusIcon from 'react-icons/lib/go/plus';
import Logo from 'common/components/Logo';
import Row from 'common/components/flex/Row';
import Tooltip from 'common/components/Tooltip';
import HeaderSearchBar from 'app/components/HeaderSearchBar';

import { jwtSelector, isPatronSelector } from 'app/store/user/selectors';
import modalActionCreators from 'app/store/modal/actions';
import { patronUrl } from 'common/utils/url-generator';
// $FlowIssue
import PatronBadge from '-!svg-react-loader!common/utils/badges/svg/patron-4.svg'; // eslint-disable-line import/no-webpack-loader-syntax

import UserMenu from '../UserMenu';

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
  justify-content: center;
  align-items: center;
  margin: 0 1rem;
`;

const Action = styled.div`
  transition: 0.3s ease all;
  margin: 0 1rem;
  cursor: pointer;
  color: white;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;

type Props = {
  title: string,
  hasLogin: boolean,
  isPatron: boolean,
  modalActions: typeof modalActionCreators,
};

const mapStateToProps = state => ({
  hasLogin: !!jwtSelector(state),
  isPatron: isPatronSelector(state),
});
const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(modalActionCreators, dispatch),
});
class Navigation extends React.PureComponent<Props> {
  openNewSandbox = () => {
    this.props.modalActions.openModal({
      width: 900,
      Body: <NewSandbox />,
    });
  };

  render() {
    const { title, hasLogin, isPatron } = this.props;

    return (
      <Row justifyContent="space-between">
        <Row>
          <a href="/">
            <LogoWithBorder height={40} width={40} />
          </a>
          <Border width={1} size={500} />
          <Title>{title}</Title>
        </Row>
        <Row>
          <Actions>
            <Action>
              <HeaderSearchBar />
            </Action>
            {!isPatron && (
              <Action>
                <Tooltip position="bottom" title="Support CodeSandbox">
                  <Link to={patronUrl()}>
                    <PatronBadge width={40} height={40} />
                  </Link>
                </Tooltip>
              </Action>
            )}
            <Action onClick={this.openNewSandbox}>
              <Tooltip position="bottom" title="New Sandbox">
                <PlusIcon height={35} />
              </Tooltip>
            </Action>
          </Actions>
          {hasLogin ? <UserMenu /> : <SignInButton />}
        </Row>
      </Row>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
