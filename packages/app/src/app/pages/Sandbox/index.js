// @flow
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import type { Sandbox } from 'common/types';

import { sandboxesSelector } from 'app/store/entities/sandboxes/selectors';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';
import viewActionCreators from 'app/store/view/actions';
import { preferencesSelector } from 'app/store/preferences/selectors';
import { workspaceHiddenSelector } from 'app/store/view/selectors';
import KeybindingManager from 'app/containers/KeybindingManager';
import QuickActions from 'app/containers/QuickActions';

import Title from 'app/components/text/Title';
import SubTitle from 'app/components/text/SubTitle';
import Centered from 'common/components/flex/Centered';

import Editor from './Editor';
import Skeleton from './Editor/Content/Skeleton';

type Props = {
  sandboxes: { [id: string]: Sandbox },
  sandboxActions: typeof sandboxActionCreators,
  viewActions: typeof viewActionCreators,
  workspaceHidden: boolean,
  match: { params: { id: string } },
  zenMode: boolean,
};
type State = {
  notFound: boolean,
  error: ?string,
  currentId: ?string,
};

const mapStateToProps = createSelector(
  sandboxesSelector,
  preferencesSelector,
  workspaceHiddenSelector,
  (sandboxes, preferences, workspaceHidden) => ({
    sandboxes,
    zenMode: preferences.zenMode,
    workspaceHidden,
  })
);
const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
  viewActions: bindActionCreators(viewActionCreators, dispatch),
});
class SandboxPage extends React.PureComponent<Props, State> {
  componentDidMount() {
    if (
      window.screen.availWidth < 800 &&
      !document.location.search.includes('from-embed')
    ) {
      const addedSign = document.location.search ? '&' : '?';
      document.location.href =
        document.location.href.replace('/s/', '/embed/') +
        addedSign +
        'codemirror=1';
    } else {
      this.fetchSandbox(this.props.match.params.id);
    }
  }

  fetchSandbox = (id: string) => {
    this.setState({ loading: true }, () => {
      this.props.sandboxActions
        .getById(id)
        .then(this.setId, this.handleNotFound);
    });
  };

  setId = (sandbox: Sandbox) => {
    this.setState({ currentId: sandbox.id, loading: false });
  };

  componentDidUpdate(oldProps) {
    const newId = this.props.match.params.id;
    const oldId = oldProps.match.params.id;

    if (newId != null && oldId != null && oldId !== newId) {
      const sandbox = this.props.sandboxes[newId];
      this.setState({ notFound: false }); // eslint-disable-line
      if (!sandbox || !sandbox.forked) {
        this.fetchSandbox(newId);
      } else {
        // Sandbox is already in state, so change currentId to this one
        this.setId(sandbox);
      }
    }
  }

  handleNotFound = e => {
    if (e.response && e.response.status === 404) {
      this.setState({ notFound: true, loading: false });
    } else {
      this.setState({ error: e.apiMessage || e.message, loading: false });
    }
  };

  state = { notFound: false, currentId: null, loading: false };

  render() {
    const {
      sandboxes,
      match,
      zenMode,
      workspaceHidden,
      viewActions,
    } = this.props;
    const { currentId } = this.state;

    if (this.state.loading) {
      return (
        <Centered horizontal vertical>
          <Skeleton />
        </Centered>
      );
    }

    if (this.state.notFound) {
      return (
        <Centered horizontal vertical>
          <Title>
            We could not find the Sandbox you{"'"}re looking for...
            <br />
            <br />
            <Link to="/s/new">Create Sandbox</Link>
          </Title>
        </Centered>
      );
    }

    if (this.state.error) {
      return (
        <Centered horizontal vertical>
          <Title>An error occured when fetching the sandbox:</Title>
          <SubTitle>{this.state.error}</SubTitle>
          <br />
          <br />
          <Link to="/s/new">Create Sandbox</Link>
        </Centered>
      );
    }

    const sandbox = sandboxes[currentId];

    if (sandbox) {
      document.title = sandbox.title
        ? `${sandbox.title} - CodeSandbox`
        : 'Editor - CodeSandbox';
    }

    return (
      <React.Fragment>
        <Editor
          match={match}
          zenMode={zenMode}
          sandbox={sandbox}
          workspaceHidden={workspaceHidden}
          setWorkspaceHidden={viewActions.setWorkspaceHidden}
        />
        <KeybindingManager sandboxId={currentId} />
        <QuickActions sandboxId={currentId} />
      </React.Fragment>
    );
  }
}

export default DragDropContext(HTML5Backend)(
  connect(mapStateToProps, mapDispatchToProps)(SandboxPage)
);
