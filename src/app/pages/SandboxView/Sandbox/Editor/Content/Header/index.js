// @flow
import React from 'react';
import styled from 'styled-components';
import Save from 'react-icons/lib/md/save';
import Fork from 'react-icons/lib/go/repo-forked';
import Download from 'react-icons/lib/go/cloud-download';
import Import from 'react-icons/lib/go/package';

import type { Sandbox } from 'app/store/entities/sandboxes/entity';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';

import Action from './Action';

const Container = styled.div`
  position: relative;
  display: flex;
  background-color: ${props => props.theme.background2};
  font-size: 1.2rem;
  color: ${props => props.theme.white};
  z-index: 40;
  margin: 0;
  height: 3rem;
  font-weight: 400;
  flex: 0 0 3rem;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.background2.darken(0.3)};
`;

const Logo = styled.h1`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  line-height: 3rem;
  font-size: 1.2rem;
  font-weight: 500;
  vertical-align: middle;
  width: 100%;
  font-weight: 400;
  text-decoration: none;
  color: white;
  left: 0; right: 0;
`;

type Props = {
  sandbox: Sandbox,
  sandboxActions: typeof sandboxActionCreators,
};

export default class Header extends React.PureComponent {
  props: Props;

  massUpdateModules = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.massUpdateModules(sandbox.id);
  };

  forkSandbox = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.forkSandbox(sandbox.id);
  };

  render() {
    return (
      <Container>
        <Action onClick={this.forkSandbox} title="Fork" Icon={Fork} />
        <Action onClick={this.massUpdateModules} title="Save" Icon={Save} />
        <Action title="Download" Icon={Download} placeholder />
        <Action title="Import" Icon={Import} placeholder />
        <Logo>CodeSandbox</Logo>
      </Container>
    );
  }
}
