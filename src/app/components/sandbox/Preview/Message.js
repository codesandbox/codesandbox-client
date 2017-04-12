import React from 'react';
import styled from 'styled-components';
import InfoIcon from 'react-icons/lib/md/info';
import WarningIcon from 'react-icons/lib/md/warning';
import ErrorIcon from 'react-icons/lib/md/error';
import type { Module } from 'common/types';

import Button from 'app/components/buttons/Button';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';

import Editor from './Editor';

const Container = styled.div`
  font-family: 'Source Code Pro', monospace;
  font-weight: 400;
  display: flex;
  justify-content: center;
  padding: 0.5rem;
  background-color: ${({ color, theme }) => {
  if (color === 'error') {
    return theme.redBackground;
  }
  return theme.primary;
}}
  color: ${props => props.theme.red};
  height: 100%;
  width: 100%;
  padding: 1rem;
  vertical-align: middle;
  line-height: 1.4;
  text-align: center;
`;

const Content = styled.div`
  width: 70%;
`;

const Icon = styled.div`
  margin: 1rem;
  font-size: 3rem;
`;

type Props = {
  sandboxId: string,
  error: ?{ type: string, title: string, message: string },
  message: ?string,
  sandboxActions: typeof sandboxActionCreators,
  modules: Array<Module>,
};

class Message extends React.PureComponent {
  props: Props;

  getIcon = () => {
    const { error, message } = this.props;

    if (message) return <Icon><InfoIcon /></Icon>;
    if (error.severity === 'warning') return <Icon><WarningIcon /></Icon>;

    return <Icon><ErrorIcon /></Icon>;
  };

  addDependency = name => async () => {
    const { sandboxId, sandboxActions } = this.props;
    await sandboxActions.addNPMDependency(sandboxId, name);
    sandboxActions.fetchDependenciesBundle(sandboxId);
  };

  openModule = () => {
    const { error, sandboxId, sandboxActions } = this.props;
    sandboxActions.setCurrentModule(sandboxId, error.moduleId);
  };

  getMessage = () => {
    const { error, modules } = this.props;

    const module = modules.find(m => m.id === error.moduleId) || {};
    if (error.type === 'dependency-not-found') {
      return (
        <div>
          Could not find the dependency
          <b> {"'"}{error.payload.dependency}{"'"}</b>.
          <div style={{ marginTop: '1rem' }}>
            <Button
              onClick={this.addDependency(error.payload.dependency)}
              small
            >
              ADD DEPENDENCY TO PROJECT
            </Button>
          </div>
        </div>
      );
    } else if (error.type === 'no-dom-change') {
      return (
        <div>
          It seems like <b>{module.title}</b> doesn{"'"}t render anything.
          <div style={{ marginTop: '1rem' }}>
            We
            {"'"}
            re adding support for viewing generated documentation in the near future.
            {error.payload.react &&
              <div>
                For now we recommend adding
                {' '}
                <Editor readOnly name={error.payload.componentName} />
                to view this component.
              </div>}
          </div>
        </div>
      );
    }

    return (
      <div>
        {module && <div>Error in <b>{module.title}</b>:</div>}
        <div style={{ marginTop: '1rem' }}>{error.title}: {error.message}</div>

        {module &&
          <div style={{ marginTop: '1rem' }}>
            <Button onClick={this.openModule} small>
              OPEN MODULE
            </Button>
          </div>}
      </div>
    );
  };

  render() {
    const { error, message } = this.props;

    return (
      <Container color={error && error.severity === 'error' && 'error'}>
        <Content>
          {this.getIcon()}
          {message ? <div>{message}</div> : this.getMessage()}
        </Content>
      </Container>
    );
  }
}

export default Message;
