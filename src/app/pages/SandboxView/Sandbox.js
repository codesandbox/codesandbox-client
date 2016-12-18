/* @flow */
import React from 'react';
import styled from 'styled-components';
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
type State = {
  notFound: boolean;
};

const NotFound = styled.h1`
  position: fixed;
  top: 50%; bottom: 0; left: 0; right: 0;
  margin: auto;
  text-align: center;
  color: white;
  font-size: 4rem;
  vertical-align: middle;
`;

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
  }

  handleNotFound = (e) => {
    if (e.response.status === 404) {
      this.setState({ notFound: true });
    }
  };

  props: Props;
  state: State;
  state = { notFound: false };

  render() {
    const { sandbox } = this.props;

    if (this.state.notFound) {
      return <NotFound>404 Not Found!</NotFound>;
    }
    if (!sandbox) return null;
    return (
      <Match
        pattern="module/:module*"
        render={matchPattern => (
          <div style={{ width: '100%', height: '100%' }}>
            <Editor sandbox={sandbox} {...matchPattern} />
          </div>
        )}
      />
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SandboxFound);
