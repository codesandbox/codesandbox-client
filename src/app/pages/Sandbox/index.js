// @flow
import * as React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';

import type { Sandbox } from 'common/types';

import { sandboxesSelector } from 'app/store/entities/sandboxes/selectors';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';

import Title from 'app/components/text/Title';
import SubTitle from 'app/components/text/SubTitle';
import Centered from 'app/components/flex/Centered';

import Editor from './Editor';
import Skeleton from './Editor/Content/Skeleton';

type Props = {
  sandboxes: { [id: string]: Sandbox },
  sandboxActions: typeof sandboxActionCreators,
  match: { params: { id: string } },
};
type State = {
  notFound: boolean,
  error: ?string,
  currentId: ?string,
};

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const mapStateToProps = createSelector(sandboxesSelector, sandboxes => ({
  sandboxes,
}));
const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
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
    const { sandboxes, match } = this.props;
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
      <Container>
        <Editor match={match} sandbox={sandbox} />
      </Container>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SandboxPage);
