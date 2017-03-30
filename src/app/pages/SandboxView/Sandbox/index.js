/* @flow */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import sandboxEntity from '../../../store/entities/sandboxes/entity';

import { sandboxesSelector } from '../../../store/entities/sandboxes/selectors';
import { entitiesSelector } from '../../../store/entities/selectors';
import sandboxActions from '../../../store/entities/sandboxes/actions';

import type { Sandbox } from '../../../store/entities/sandboxes/entity';
import Title from '../../../components/text/Title';

import Editor from './Editor';

type Props = {
  sandbox: ?Sandbox,
  sandboxActions: typeof sandboxActions,
  match: { url: string, params: { id: ?string } },
};
type State = {
  notFound: boolean,
};

const mapStateToProps = createSelector(
  sandboxesSelector,
  entitiesSelector,
  (_, props) => props.match.params.id,
  (sandboxes, entities, id) => {
    const sandbox = sandboxes[id];

    if (sandbox) {
      return {
        sandbox: denormalize(sandbox, sandboxEntity, entities),
      };
    }

    return { sandbox: null };
  }
);
const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActions, dispatch),
});
class SandboxPage extends React.PureComponent {
  componentDidMount() {
    this.fetchSandbox();
  }

  fetchSandbox = () => {
    const { id } = this.props.match.params;

    if (id) {
      this.props.sandboxActions.getById(id).then(null, this.handleNotFound);
    }
  };

  componentDidUpdate(oldProps) {
    if (this.props.match.params.id !== oldProps.match.params.id) {
      this.fetchSandbox();
    }
  }

  handleNotFound = e => {
    if (e.response && e.response.status === 404) {
      this.setState({ notFound: true });
    }
  };

  props: Props;
  state: State;
  state = { notFound: false };

  render() {
    const { sandbox } = this.props;
    if (this.state.notFound) {
      return (
        <Title>
          We could not find the Sandbox you{"'"}re looking for...
        </Title>
      );
    }
    if (!sandbox) return null;

    document.title = sandbox.title
      ? `${sandbox.title} - CodeSandbox`
      : 'Editor - CodeSandbox';

    return (
      <Switch>
        <Route
          render={matchParams => <Editor sandbox={sandbox} {...matchParams} />}
        />
      </Switch>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SandboxPage);
