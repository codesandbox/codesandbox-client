/* @flow */
import React from 'react';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import sandboxActions from '../../store/entities/sandboxes/actions';
import delayEffect from '../../utils/animation/delay-effect';
import Title from '../../components/text/Title';
import SubTitle from '../../components/text/SubTitle';

type Props = {
  sandboxActions: typeof sandboxActions,
};
type State = {
  redirect: ?string,
  error: boolean,
};
const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActions, dispatch),
});
class Create extends React.PureComponent {
  props: Props;
  state: State;

  state = {
    redirect: null,
    error: false,
  };

  componentDidMount() {
    this.props.sandboxActions
      .createSandbox()
      .then(
        redirect => this.setState({ redirect }),
        error => this.setState({ error: true }),
      );
  }

  render() {
    const {
      redirect,
      error,
    } = this.state;

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    if (error) {
      return <Title>An error occured, please try again later</Title>;
    }

    return <Title delay={1}>Creating sandbox, hang tight!</Title>;
  }
}
export default connect(null, mapDispatchToProps)(Create);
