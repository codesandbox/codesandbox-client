import * as React from 'react';
import { connect } from 'app/fluent';

import Navigation from 'app/pages/common/Navigation';

import Prompt from './Prompt';
import { Container } from './elements';

export default connect()
  .with(({ state, signals }) => ({
    user: state.user,
    authToken: state.authToken,
    isLoadingCLI: state.isLoadingCLI,
    error: state.error,
    cliMounted: signals.cliMounted,
    signInCliClicked: signals.signInCliClicked
  }))
  .toClass(props =>
    class CLI extends React.Component<typeof props> {
      componentDidMount() {
        this.props.cliMounted();
      }

      render() {
        const { user, authToken, isLoadingCLI, error } = this.props;

        return (
          <Container>
            <Navigation title="CLI Authorization" />
            <Prompt
              error={error}
              token={authToken}
              loading={isLoadingCLI}
              username={user && user.username}
              signIn={this.props.signInCliClicked}
            />
          </Container>
        );
      }
    }
  )
