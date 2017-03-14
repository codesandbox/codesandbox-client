// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import sandboxActions from '../../../store/entities/sandboxes/actions';

import Title from '../../../components/text/Title';
import SubTitle from '../../../components/text/SubTitle';
import type { Sandbox } from '../../../store/entities/sandboxes/entity';

type Props = {
  sandboxActions: typeof sandboxActions,
  sandbox: Sandbox,
  forkSandbox: (id: string) => void,
};
type State = {
  error: boolean,
  redirect: ?string,
};

const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActions, dispatch),
});
class Fork extends React.PureComponent {
  componentDidMount() {
    this.forkSandbox();
  }

  props: Props;
  state: State;
  state = {
    error: false,
    redirect: undefined,
  };

  forkSandbox = async () => {
    const { sandbox, sandboxActions } = this.props;
    try {
      const redirect = await sandboxActions.forkSandbox(sandbox.id);

      this.setState({
        redirect,
      });
    } catch (e) {
      this.setState({ error: true });
    }
  };

  render() {
    const { error, redirect } = this.state;

    if (error) {
      return <Title>An error occured, please try again later</Title>;
    }

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    return (
      <div>
        <Title delay={0.2}>Forking Sandbox</Title>
        <SubTitle delay={0.3}>Copying files...</SubTitle>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Fork);
