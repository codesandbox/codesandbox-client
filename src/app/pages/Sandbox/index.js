/* @flow */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import sandboxEntity from 'app/store/entities/sandboxes/entity';

import { sandboxesSelector } from 'app/store/entities/sandboxes/selectors';
import { entitiesSelector } from 'app/store/entities/selectors';
import sandboxActions from 'app/store/entities/sandboxes/actions';

import type { Sandbox } from 'app/store/entities/sandboxes/entity';
import Title from 'app/components/text/Title';
import Centered from 'app/components/flex/Centered';

import Editor from './Editor';

type Props = {
  sandbox: ?Sandbox,
  sandboxes: { [id: string]: Sandbox },
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
        sandboxes,
      };
    }

    return { sandbox: null, sandboxes };
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
    const newId = this.props.match.params.id;
    const oldId = oldProps.match.params.id;

    if (newId != null && oldId !== newId) {
      if (!this.props.sandboxes[newId]) {
        this.fetchSandbox();
      }
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
        <Centered horizontal vertical>
          <Title>
            We could not find the Sandbox you{"'"}re looking for...
          </Title>
        </Centered>
      );
    }
    if (!sandbox) return null;

    document.title = sandbox.title
      ? `${sandbox.title} - CodeSandbox`
      : 'Editor - CodeSandbox';

    return (
      <Centered horizontal vertical>
        <Editor sandbox={sandbox} />
      </Centered>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SandboxPage);
