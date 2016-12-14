/* @flow */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Match } from 'react-router';

import sandboxEntity from '../../store/entities/sandboxes';
import { singleSandboxSelector } from '../../store/entities/sandboxes/selector';

import type { Sandbox } from '../../store/entities/sandboxes/';

import Editor from './Editor';

type Props = {
  sandbox: ?Sandbox;
  sandboxActions: typeof sandboxEntity.actions;
  params: {
    username: ?string;
    slug: ?string;
    id: ?string;
  };
};

const mapStateToProps = (state, props) => ({
  sandbox: singleSandboxSelector(state, props.params),
});
const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxEntity.actions, dispatch),
});
class SandboxFound extends React.PureComponent {
  componentDidMount() {
    const { username, slug, id } = this.props.params;
    if (id) {
      this.props.sandboxActions.getById(id);
    } else {
      this.props.sandboxActions.getByUserAndSlug(username, slug);
    }
  }

  props: Props;

  render() {
    const { sandbox } = this.props;

    if (!sandbox) return null;
    return (
      <Match
        pattern="module/:module*" render={matchPattern => (
          <Editor sandbox={sandbox} {...matchPattern} />
        )}
      />
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SandboxFound);
