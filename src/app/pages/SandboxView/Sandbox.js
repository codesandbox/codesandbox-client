/* @flow */
import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Match } from 'react-router';

import sandboxEntity from '../../store/entities/sandboxes';
import { singleSandboxSelector } from '../../store/entities/sandboxes/selector';
import { currentSandboxIdSelector } from '../../store/selectors/views/sandbox-selector';

import type { Sandbox } from '../../store/entities/sandboxes/';

import Editor from './Editor';
import Fork from './Fork';
import sandboxViewActionCreators from '../../store/actions/views/sandbox';

type Props = {
  sandbox: ?Sandbox;
  sandboxActions: typeof sandboxEntity.actions;
  params: {
    username: ?string;
    slug: ?string;
    id: ?string;
  };
  sandboxViewActions: sandboxViewActionCreators;
  currentSandboxId: ?string;
};
type State = {
  notFound: boolean;
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex: auto;
`;

const NotFound = styled.h1`
  position: fixed;
  top: 50%; bottom: 0; left: 0; right: 0;
  margin: auto;
  text-align: center;
  color: white;
  font-size: 3rem;
  vertical-align: middle;
`;

const mapStateToProps = (state, props) => ({
  sandbox: singleSandboxSelector(state, props.params),
  currentSandboxId: currentSandboxIdSelector(state),
});
const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxEntity.actions, dispatch),
  sandboxViewActions: bindActionCreators(sandboxViewActionCreators, dispatch),
});
class SandboxPage extends React.PureComponent {
  componentDidMount() {
    const { username, slug, id } = this.props.params;
    if (id) {
      this.props.sandboxActions.getById(id).then(null, this.handleNotFound);
    } else {
      this.props.sandboxActions.getByUserAndSlug(username, slug).then(null, this.handleNotFound);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { id, slug, username } = this.props.params;
    if (
      nextProps.params.id !== id ||
      nextProps.params.slug !== slug ||
      nextProps.params.username !== username
    ) {
      this.setState({ notFound: false });
    }
    const { sandbox } = nextProps;
    // Reset sandbox view info if sandbox changes
    if (!this.props.sandbox || (sandbox && sandbox.id !== this.props.currentSandboxId)) {
      this.props.sandboxViewActions.setCurrentSandbox(sandbox.id);
    }
  }

  handleNotFound = (e) => {
    if (e.response && e.response.status === 404) {
      this.setState({ notFound: true });
    }
    console.error(e);
  };

  props: Props;
  state: State;
  state = { notFound: false };

  render() {
    const { sandbox, sandboxActions } = this.props;

    if (this.state.notFound) {
      return <NotFound>We could not find the page you{"'"}re looking for :(</NotFound>;
    }
    if (!sandbox) return null;
    return (
      <Container>
        <Match
          pattern="(code|versions|info|dependencies)/:module*"
          render={matchPattern => (
            <Editor sandbox={sandbox} {...matchPattern} />
          )}
        />
        <Match
          pattern="fork"
          render={() =>
            <Fork sandbox={sandbox} forkSandbox={sandboxActions.forkSandbox} />
          }
        />
      </Container>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SandboxPage);
