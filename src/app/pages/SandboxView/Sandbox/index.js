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
import Centered from '../../../components/flex/Centered';

import Fork from './Fork';
import Editor from './Editor';

type Props = {
  sandbox: ?Sandbox,
  sandboxActions: typeof sandboxActions,
  match: { url: string, params: { id: ?string } },
};
type State = {
  notFound: boolean,
};

const mapStateToProps = (state, props) => createSelector(
  sandboxesSelector,
  entitiesSelector,
  () => props.match.params.id,
  (sandboxes, entities, id) => {
    const sandbox = sandboxes[id];

    if (sandbox) {
      return {
        sandbox: denormalize(sandbox, sandboxEntity, entities),
      };
    } else {
      return { sandbox: null };
    }
  },
);
const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActions, dispatch),
});
class SandboxPage extends React.PureComponent {
  componentDidMount() {
    const { id } = this.props.match.params;

    if (id) {
      this.props.sandboxActions.getById(id).then(null, this.handleNotFound);
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
    const { match, sandbox, sandboxActions } = this.props;
    if (this.state.notFound) {
      return (
        <Title>
          We could not find the Sandbox you're looking for...
        </Title>
      );
    }
    if (!sandbox) return null;

    return (
      <div>
        <Switch>
          <Route
            path={`${match.url}/fork`}
            render={matchParams => <Fork sandbox={sandbox} {...matchParams} />}
          />
          <Route
            path={`${match.url}`}
            render={matchParams => (
              <Editor sandbox={sandbox} {...matchParams} />
            )}
          />
        </Switch>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SandboxPage);
