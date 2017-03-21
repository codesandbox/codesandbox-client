// @flow
import React from 'react';
import styled from 'styled-components';
import Save from 'react-icons/lib/md/save';
import Fork from 'react-icons/lib/go/repo-forked';

import type { Sandbox } from 'app/store/entities/sandboxes/entity';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';

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

const Action = styled.div`
  transition: 0.3s ease all;
  display: flex;
  flex-direction: row;
  align-items: center;
  vertical-align: middle;
  font-size: 1rem;
  line-height: 1;
  padding: 0 1rem;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  z-index: 1;

  &:hover {
    color: rgba(255,255,255, 1);
    border-bottom: 2px solid ${props => props.theme.secondary};
  }
`;

const Icon = styled.div`
  padding-right: 0.5rem;
  vertical-align: middle;
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
        <Action onClick={this.massUpdateModules}>
          <Icon>
            <Save />
          </Icon> Save
        </Action>
        <Action onClick={this.forkSandbox}>
          <Icon>
            <Fork />
          </Icon> Fork
        </Action>
        <Logo>CodeSandbox</Logo>
      </Container>
    );
  }
}
