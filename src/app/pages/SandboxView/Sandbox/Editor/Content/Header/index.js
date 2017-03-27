// @flow
import React from 'react';
import styled from 'styled-components';
import Save from 'react-icons/lib/md/save';
import Fork from 'react-icons/lib/go/repo-forked';
import Download from 'react-icons/lib/go/cloud-download';
import Import from 'react-icons/lib/go/package';

import type { Sandbox } from 'app/store/entities/sandboxes/entity';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';
import Tooltip from 'app/components/Tooltip';

import Action from './Action';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
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
  a {
    text-decoration: none;
    color: white;
  }
  left: 0; right: 0;
`;

const Left = styled.div`
  display: flex;
  height: 100%;
`;

const Right = styled.div`
  display: flex;
  padding: 0.75rem 0;
`;

const Icon = styled.div`
  display: inline-block;
  width: ${props => props.half ? 1.5 : 3}rem;
  height: 1.5rem;
  border: 1px solid rgba(0,0,0,0.1);
`;

const ViewIcon = styled.div`
  transition: 0.3s ease all;
  position: relative;
  margin: 0 0.5rem;
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;

  &:after {
    transition: 0.3s ease all;
    content: "";
    position: absolute;
    left: 0; right: 0; bottom: 0; top: 0;
    background-color: rgba(0,0,0,0.6);
    opacity: ${props => props.active ? 0 : 1};
    border-radius: 2px;
    overflow: hidden;
  }
  &:hover::after {
    opacity: 0;
  }
`;

const EditorIcon = styled(Icon)`
  background-color: ${props => props.theme.secondary};
`;

const PreviewIcon = styled(Icon)`
  background-color: ${props => props.theme.primary};
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

  zipSandbox = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.createZip(sandbox.id);
  };

  forkSandbox = () => {
    const { sandbox, sandboxActions } = this.props;

    const shouldFork = sandbox.owned
      ? confirm('Do you want to fork your own sandbox?')
      : true;
    if (shouldFork) {
      sandboxActions.forkSandbox(sandbox.id);
    }
  };

  setEditorView = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.setViewMode(sandbox.id, true, false);
  };

  setMixedView = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.setViewMode(sandbox.id, true, true);
  };

  setPreviewView = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.setViewMode(sandbox.id, false, true);
  };

  render() {
    const { sandbox } = this.props;
    const canSave = sandbox.modules.some(m => m.isNotSynced);
    return (
      <Container>
        <Left>
          <Action onClick={this.forkSandbox} title="Fork" Icon={Fork} />
          <Action
            onClick={canSave && this.massUpdateModules}
            placeholder={canSave ? false : 'All modules are saved'}
            title="Save"
            Icon={Save}
          />
          <Action title="Download" Icon={Download} onClick={this.zipSandbox} />
          <Action title="Import" Icon={Import} placeholder="Coming soon!" />
        </Left>

        <Logo title="CodeSandbox"><a href="/">CodeSandbox</a></Logo>

        <Right>
          <Tooltip message="Editor view">
            <ViewIcon
              onClick={this.setEditorView}
              active={sandbox.showEditor && !sandbox.showPreview}
            >
              <EditorIcon />
            </ViewIcon>
          </Tooltip>
          <Tooltip message="Split view">
            <ViewIcon
              onClick={this.setMixedView}
              active={sandbox.showEditor && sandbox.showPreview}
            >
              <EditorIcon half />
              <PreviewIcon half />
            </ViewIcon>
          </Tooltip>
          <Tooltip message="Preview view">
            <ViewIcon
              onClick={this.setPreviewView}
              active={!sandbox.showEditor && sandbox.showPreview}
            >
              <PreviewIcon />
            </ViewIcon>
          </Tooltip>
        </Right>
      </Container>
    );
  }
}
